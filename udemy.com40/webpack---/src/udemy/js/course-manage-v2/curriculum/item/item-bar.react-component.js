import {Tooltip} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {curriculumItemKeyClasses} from './constants';
import {sectionItemHandleCSSClass} from './create-options-for-sortable';
import CurriculumItemModel from './curriculum-item.mobx-model';
import ItemIconButton from './item-icon-button.react-component';
import {ItemStatusIcon, ItemTypeIcon} from './item-icons.react-component';
import './item-bar.less';

@observer
export default class ItemBar extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        collapseButton: PropTypes.node,
        curriculumItem: PropTypes.instanceOf(CurriculumItemModel).isRequired,
        deleteButton: PropTypes.node.isRequired,
        editButton: PropTypes.node.isRequired,
        publishedLabel: PropTypes.node.isRequired,
        unpublishedLabel: PropTypes.node.isRequired,
    };

    static defaultProps = {
        children: null,
        className: '',
        collapseButton: null,
    };

    constructor(props) {
        super(props);
        this.tittleDesktopElementRef = React.createRef();
    }

    @observable isOpen = false;

    @action
    onToggleTooltip = (isOpen) => {
        if (isOpen) {
            const isTittleOverflowed =
                this.tittleDesktopElementRef.current.offsetWidth <
                this.tittleDesktopElementRef.current.scrollWidth;

            this.isOpen = isTittleOverflowed;
        } else {
            this.isOpen = false;
        }
    };

    render() {
        const {
            className,
            curriculumItem,
            deleteButton,
            editButton,
            collapseButton,
            publishedLabel,
            unpublishedLabel,
            children,
        } = this.props;
        const isSection = curriculumItem.keyClass === curriculumItemKeyClasses.section;
        return (
            <Tooltip
                trigger={
                    <div
                        className={classNames(
                            'item-icon-button-trigger',
                            sectionItemHandleCSSClass,
                            className,
                        )}
                        styleName={classNames('item-bar row', {
                            'item-bar-section': isSection,
                            'item-bar-deleting': curriculumItem.isDeleting,
                        })}
                    >
                        <div styleName="flex main row">
                            <div styleName="flex left">
                                <div styleName="left-content row" data-purpose="item-full-title">
                                    <ItemStatusIcon
                                        curriculumItem={curriculumItem}
                                        styleName="icon"
                                    />
                                    <span
                                        className={classNames({'ud-text-bold': isSection})}
                                        styleName="label"
                                        data-purpose="item-object-index"
                                    >
                                        {curriculumItem.is_published
                                            ? `${publishedLabel} ${curriculumItem.object_index}:`
                                            : `${unpublishedLabel}:`}
                                    </span>
                                    <span styleName="title-desktop row">
                                        <ItemTypeIcon
                                            curriculumItem={curriculumItem}
                                            styleName="icon"
                                        />
                                        <span
                                            styleName="ellipsis"
                                            ref={this.tittleDesktopElementRef}
                                        >
                                            {curriculumItem.title}
                                        </span>
                                    </span>
                                    {editButton}
                                    {deleteButton}
                                </div>
                                <div styleName="title-mobile left-content row">
                                    <ItemTypeIcon
                                        curriculumItem={curriculumItem}
                                        styleName="icon"
                                    />
                                    <span styleName="ellipsis">{curriculumItem.title}</span>
                                </div>
                            </div>
                            {children}
                        </div>
                        <div styleName="right row">
                            {collapseButton}
                            <ItemIconButton
                                iconType="move"
                                componentClass="div"
                                styleName="drag-handle"
                            />
                        </div>
                    </div>
                }
                placement="bottom-end"
                isOpen={this.isOpen}
                onToggle={this.onToggleTooltip}
                canOnlyToggleOnHover={true}
                shouldCloseOtherPoppers={false}
                detachFromTarget={true}
            >
                {curriculumItem.title}
            </Tooltip>
        );
    }
}

ItemBar.ButtonContainer = ({children}) => <div styleName="button-container">{children}</div>;
