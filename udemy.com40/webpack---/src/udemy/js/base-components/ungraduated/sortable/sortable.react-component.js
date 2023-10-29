import autobind from 'autobind-decorator';
import React, {Component} from 'react';
import BaseSortable from 'react-sortablejs';

/**
 * This is a wrapper for react-sortablejs, which itself is a wrapper for sortablejs.
 */
export default class Sortable extends Component {
    static propTypes = BaseSortable.propTypes;

    static defaultProps = BaseSortable.defaultProps;

    /**
     * This is a workaround for:
     *     DOMException: Failed to execute 'removeChild' on 'Node':
     *     The node to be removed is not a child of this node.
     * It happens when an item is moved from one list to another. It seems that sortablejs
     * clones event.item in the old list. React doesn't know about this, so it
     * attempts to unmount event.item instead of its clone. This results in
     * (old list).removeChild(event.item), which raises the error. The workaround is to
     * manually insert event.item into the old list.
     *
     * react-sortablejs has a similar workaround:
     *     evt.from.insertBefore(evt.item, referenceNode);
     * but the problem is that they apply it onUpdate, which causes flickering when we drag
     * within the same list (event.item is inserted, and then immediately removed when
     * we render the updated order).
     */
    @autobind
    onEnd(event) {
        if (this.props.options.onEnd) {
            if (event.from !== event.to) {
                // Manually insert event.item at oldIndex (right next to the clone)
                // so that there won't be an error if React unmounts it.
                event.from.insertBefore(event.item, event.from.childNodes[event.oldIndex]);
            }
            this.props.options.onEnd(event);
        }
    }

    @autobind
    setRef(baseSortableInstance) {
        if (baseSortableInstance) {
            this.sortable = baseSortableInstance.sortable;
        } else {
            this.sortable = null;
        }
    }

    render() {
        const props = {...this.props};
        props.options = {...props.options, onEnd: this.onEnd};
        return <BaseSortable {...props} ref={this.setRef} />;
    }
}

/**
 * Create two sortables. Drag the first item from the first sortable to the
 * bottom of the page. The scrolling doesn't stop once the item is over the second sortable.
 * http://jsbin.com/fohununuji/edit?html,css,js,output
 * If the sortable list ends up completely outside the viewport, the dragover event no longer fires,
 * and we have no way to scroll the list back into the viewport.
 * This function works around this issue by
 * limiting scrolling such that the sortable list is always in the viewport.
 * @param sortable: the sortablejs instance. This can be retrieved via a ref:
 *     <Sortable ref={ sortableInstance => this.sortable = sortableInstance.sortable } />
 * @param buffer: if e.g. the buffer is 150, then user can scroll down as long as the last
 * 150px of the sortable are in the viewport, and scroll up as long as the top of the sortable is
 * at most 150px below the top of the viewport.
 * The other params are the same as those in the sortablejs scrollFn option.
 * This function only handles vertical scrolling, not horizontal scrolling.
 */
export function scrollWithinSortable(scrollOffsetX, scrollOffsetY, evt, sortable, buffer = 0) {
    if (scrollOffsetY === 0 || !sortable) {
        return;
    }
    const {top, bottom} = sortable.el.getBoundingClientRect();
    if ((top > buffer && scrollOffsetY < 0) || (bottom < buffer && scrollOffsetY > 0)) {
        return;
    }
    window.scrollTo(window.pageXOffset + scrollOffsetX, window.pageYOffset + scrollOffsetY);
}
