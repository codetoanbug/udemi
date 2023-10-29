import React from 'react';

const ItemInjector = React.memo((props) => sortChildren(props.children));

export default ItemInjector;

export function sortChildren(children) {
    const unsorted = React.Children.toArray(children).map((item, i) => {
        let itemIndex = item.props && item.props['data-item-index'];
        if (!isNaN(itemIndex) && itemIndex < 0) {
            itemIndex = children.length + itemIndex;
        }
        return {
            item,
            itemIndex,
            index: i,
        };
    });

    const compare = (a, b) => {
        if (!isNaN(a.itemIndex) && !isNaN(b.itemIndex)) {
            return a.itemIndex - b.itemIndex;
        }

        /** itemIndex takes precedence over index */
        if (!isNaN(a.itemIndex)) {
            if (a.itemIndex - b.index === 0) {
                return -1;
            }
            return a.itemIndex - b.index;
        }
        if (!isNaN(b.itemIndex)) {
            if (a.index - b.itemIndex === 0) {
                return 1;
            }
            return a.index - b.itemIndex;
        }

        return a.index - b.index;
    };

    const sorted = unsorted.sort(compare);

    return sorted.map(({item}) => item);
}
