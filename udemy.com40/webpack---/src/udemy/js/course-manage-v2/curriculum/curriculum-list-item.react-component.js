import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AddItemForms from './add-item-forms.react-component';
import AddItemToggler from './add-item-toggler.react-component';
import CurriculumEditorStore from './curriculum-editor.mobx-store';
import Editor from './editor.react-component';
import {curriculumItemKeyClasses} from './item/constants';
import {draggableSectionItemCSSClass} from './item/create-options-for-sortable';
import CurriculumItemModel from './item/curriculum-item.mobx-model';
import './curriculum-list.less';

export const AddNonSectionItem = inject('store')(
    observer((props) => {
        const {disabled, store, isLastItem, ...newProps} = props;
        if (disabled) {
            return null;
        }

        const {relatedItemKey} = newProps;
        const isOpen =
            relatedItemKey === store.inlineItemEditorActiveKey &&
            !store.isSectionModeInlineItemEditor;

        return (
            <div
                styleName={classNames('inline-insert', {
                    'inline-insert-non-section-item': true,
                    'last-item': isLastItem,
                })}
            >
                <div
                    styleName={classNames('inline-insert-button-row', {
                        open: isOpen,
                        'inline-insert-last-item': isLastItem && !isOpen,
                    })}
                >
                    <AddItemToggler
                        key={`${isLastItem}`}
                        styleName="inline-insert-button"
                        isOpen={isOpen}
                        isLastItem={isLastItem}
                        {...newProps}
                    />
                </div>
                {isOpen && (
                    <div styleName="inline-insert-form">
                        <AddItemForms />
                    </div>
                )}
            </div>
        );
    }),
);

AddNonSectionItem.propTypes = {
    ...AddItemToggler.propTypes,
    disabled: PropTypes.bool,
};

AddNonSectionItem.defaultProps = {
    ...AddItemToggler.defaultProps,
    disabled: false,
};

export const AddSection = inject('store')(
    observer((props) => {
        const {disabled, isLastItem, store, ...newProps} = props;
        if (disabled) {
            return null;
        }

        const {relatedItemKey} = newProps;
        const isOpen =
            relatedItemKey === store.inlineItemEditorActiveKey &&
            store.isSectionModeInlineItemEditor;

        return (
            <div styleName="inline-insert inline-insert-section">
                <div styleName={classNames('inline-insert-button-row', {open: isOpen})}>
                    <AddItemToggler
                        styleName="inline-insert-button"
                        isOpen={isOpen}
                        type="section"
                        isLastItem={isLastItem}
                        {...newProps}
                    />
                </div>
                {isOpen && (
                    <div styleName="inline-insert-form">
                        <AddItemForms onlySectionForm={true} />
                    </div>
                )}
            </div>
        );
    }),
);

AddSection.propTypes = {
    ...AddItemToggler.propTypes,
    disabled: PropTypes.bool,
    isLastItem: PropTypes.bool,
};

AddSection.defaultProps = {
    ...AddItemToggler.defaultProps,
    disabled: false,
    isLastItem: false,
};

@inject('store')
@observer
export default class CurriculumListItem extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumItemModel).isRequired,
        index: PropTypes.number.isRequired,
        isTheLastElement: PropTypes.bool,
        isTheLastElementInSection: PropTypes.bool,
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
    };

    static defaultProps = {
        isTheLastElement: false,
        isTheLastElementInSection: false,
    };

    @autobind
    handleAddItemClick(key) {
        const {
            setInlineItemEditorActiveKey,
            inlineItemEditorActiveKey,
            isSectionModeInlineItemEditor,
        } = this.props.store;
        const isCurrentlyOpen = isSectionModeInlineItemEditor || inlineItemEditorActiveKey !== key;
        const newKeyOrClose = isCurrentlyOpen ? key : null;
        setInlineItemEditorActiveKey(newKeyOrClose, false);
    }

    @autobind
    handleAddItemSectionClick(key) {
        const {
            setInlineItemEditorActiveKey,
            inlineItemEditorActiveKey,
            isSectionModeInlineItemEditor,
        } = this.props.store;
        const isCurrentlyOpen = !isSectionModeInlineItemEditor || inlineItemEditorActiveKey !== key;
        const newKeyOrClose = isCurrentlyOpen ? key : null;
        setInlineItemEditorActiveKey(newKeyOrClose, true);
    }

    render() {
        const {curriculumItem, isTheLastElement, isTheLastElementInSection, store} = this.props;
        const isSection = curriculumItem.keyClass === curriculumItemKeyClasses.section;
        if (!store.inlineInsertEnabled) {
            return (
                <div
                    id={curriculumItem.key}
                    className={draggableSectionItemCSSClass}
                    styleName={isSection ? 'list-item section' : 'list-item non-section-item'}
                >
                    <Editor curriculumItem={curriculumItem} />
                </div>
            );
        }

        if (isSection) {
            if (curriculumItem.isFake) {
                // it is a fake section just to add the first "add button"
                const emptyFakeSection = curriculumItem.items.length === 0;
                return (
                    <div
                        id={curriculumItem.key}
                        styleName={classNames('list-item section fake-section', {
                            'fake-section-empty': emptyFakeSection,
                        })}
                    >
                        <AddSection
                            disabled={store.course.isPracticeTestCourse}
                            onClick={this.handleAddItemSectionClick}
                            relatedItemKey={curriculumItem.key}
                            isLastItem={emptyFakeSection}
                        />
                        <AddNonSectionItem
                            disabled={!store.course.isPracticeTestCourse}
                            onClick={this.handleAddItemClick}
                            relatedItemKey={curriculumItem.key}
                        />
                    </div>
                );
            }

            return (
                <div
                    id={curriculumItem.key}
                    className={draggableSectionItemCSSClass}
                    styleName="list-item section"
                >
                    <AddSection
                        onClick={this.handleAddItemSectionClick}
                        relatedItemKey={curriculumItem.key}
                    />
                    <Editor curriculumItem={curriculumItem} />
                    <AddNonSectionItem
                        onClick={this.handleAddItemClick}
                        relatedItemKey={curriculumItem.key}
                        isLastItem={isTheLastElementInSection}
                    />
                    <AddSection
                        disabled={!isTheLastElement}
                        onClick={this.handleAddItemSectionClick}
                        relatedItemKey={-1}
                        isLastItem={true}
                    />
                </div>
            );
        }

        return (
            <div
                id={curriculumItem.key}
                className={draggableSectionItemCSSClass}
                styleName="list-item non-section-item"
            >
                <Editor curriculumItem={curriculumItem} />
                <AddNonSectionItem
                    onClick={this.handleAddItemClick}
                    relatedItemKey={curriculumItem.key}
                    isLastItem={isTheLastElementInSection}
                />
                <AddSection
                    disabled={!isTheLastElement || store.course.isPracticeTestCourse}
                    onClick={this.handleAddItemSectionClick}
                    relatedItemKey={-1}
                    isLastItem={true}
                />
            </div>
        );
    }
}
