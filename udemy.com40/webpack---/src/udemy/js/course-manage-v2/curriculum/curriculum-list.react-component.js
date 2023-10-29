import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Sortable, {
    scrollWithinSortable,
} from 'base-components/ungraduated/sortable/sortable.react-component';

import CurriculumEditorStore from './curriculum-editor.mobx-store';
import CurriculumListItem from './curriculum-list-item.react-component';
import {
    createOptionsForSortableSectionItems,
    sectionItemScrollBuffer,
} from './item/create-options-for-sortable';
import './curriculum-list.less';

const propTypes = {
    store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
};

// https://mobx.js.org/best/react-performance.html suggests "Render lists in dedicated components".
// We don't want to reconcile the list every time the reorderingUi changes.
const CurriculumList = ({store, ...props}) => {
    return (
        <div
            styleName={classNames({
                dragging: store.reorderingUi.isDragging,
                'first-child-is-clone': store.reorderingUi.isFirstChildClone,
                'inline-insert-enabled': store.inlineInsertEnabled,
            })}
        >
            <CurriculumListSortable {...props} />
        </div>
    );
};

CurriculumList.propTypes = propTypes;

export default inject('store')(observer(CurriculumList));

@inject('store')
@observer
class CurriculumListSortable extends Component {
    static propTypes = propTypes;

    constructor(props, context) {
        super(props, context);
        this.optionsForSortable = createOptionsForSortableSectionItems({
            onChoose: this.onSortItemChoose,
            onUnchoose: this.onSortItemUnchoose,
            onStart: this.onSortItemStart,
            onEnd: this.onSortItemEnd,
            onMove: this.onMove,
            scrollFn: this.onSortItemScroll,
        });
    }

    @autobind
    onMove(event) {
        return this.props.store.onMove(event.dragged, event.related);
    }

    @autobind
    onSortItemChoose(event) {
        this.props.store.setReorderingUi({isFirstChildClone: event.oldIndex === 0});
    }

    @autobind
    onSortItemUnchoose() {
        this.props.store.setReorderingUi({isFirstChildClone: false});
    }

    @autobind
    onSortItemStart() {
        document.body.classList.add('course-manage-on-drag');

        this.props.store.setReorderingUi({isDragging: true});
    }

    @autobind
    onSortItemEnd(event) {
        document.body.classList.remove('course-manage-on-drag');

        this.props.store.setReorderingUi({isDragging: false, isFirstChildClone: false});

        // If the ghost section is currently not visible, we need to offset our moving index
        // by 1 as it is still always at the beginning of the store's list
        const ghostSectionOffset = this.props.store.isFirstElementSection ? 1 : 0;
        this.props.store.moveItem(
            event,
            event.oldIndex + ghostSectionOffset,
            event.newIndex + ghostSectionOffset,
        );
    }

    @autobind
    onSortItemScroll(scrollOffsetX, scrollOffsetY, evt) {
        scrollWithinSortable(
            scrollOffsetX,
            scrollOffsetY,
            evt,
            this.sortable,
            sectionItemScrollBuffer,
        );
    }

    @autobind
    setSortableRef(sortableInstance) {
        this.sortable = sortableInstance ? sortableInstance.sortable : null;
    }

    render() {
        const {store} = this.props;

        if (!store.canShowCurriculum) {
            return null;
        }

        let list;
        if (store.inlineInsertEnabled && !store.isFirstElementSection) {
            // We render the fake section for practice test-only courses so we can show the same
            // structure as standard courses. Remember that practice test-only courses don't have
            // sections.
            // In no practice test we use to hook the addItems elements.
            list = store.flatList;
        } else {
            // For standard courses, it is important that the fake section is not rendered at all,
            // as opposed to rendered as a noscript tag or hidden with CSS, because we rely on
            // :first-child CSS to apply different styles to the first real section.
            list = store.flatListWithoutFakeSection;
        }

        return (
            <Sortable
                styleName="curriculum-list"
                data-purpose="curriculum-list"
                ref={this.setSortableRef}
                options={this.optionsForSortable}
            >
                {list.slice(0, store.renderItemsUpToIndex).map((curriculumItem, index) => {
                    return (
                        <CurriculumListItem
                            key={curriculumItem.key}
                            index={index}
                            isTheLastElement={index === list.length - 1}
                            isTheLastElementInSection={store.isLastItemInSection(curriculumItem)}
                            curriculumItem={curriculumItem}
                        />
                    );
                })}
            </Sortable>
        );
    }
}
