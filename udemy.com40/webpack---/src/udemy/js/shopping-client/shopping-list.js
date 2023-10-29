import {action, observable, runInAction} from 'mobx';

/*
 * Internal data structure for use in shopping-client.js.
 *
 * When working with the shopping-session API, there are many cases where the user
 * has "queued up" actions to perform. As success / fail results come back, the
 * server's "current state" is out-of-date compared to the user's interface. This object
 * acts as a buffer between these two states, allowing the user to make modifications
 * more quickly than the shopping storage can process them.
 *
 * Basic operation: stores additions and removals as applied by user
 *
 */
function shoppingList(name, initialItems, unseenCount) {
    const state = observable({
        name,
        addAttempts: [],
        removeAttempts: [],
        items: initialItems || [],
        unseenCount: observable.box(unseenCount || 0),
    });

    function finishAttempt(item, list) {
        return action(() => {
            // only remove a single item occurrence from the list, in case the item
            // has been moved multiple times between API calls
            list.remove(list.find((t) => t.buyable.id === item.buyable.id));
        });
    }

    const api = observable({
        name: state.name,
        get unseenCount() {
            return state.unseenCount.get();
        },

        /*
         * The current set of items in the list, with pending modifications applied.
         */

        get items() {
            // track # of "occurrences" of each buyableId in a map; e.g. {123: 1, 456: 3}
            // Note: we count "exists in state.items array" as 1 occurrence
            const getBuyableIdCounts = (items) => {
                const counts = {};
                items.forEach((item) => {
                    const id = item.buyable.id;
                    counts[id] = (counts[id] || 0) + 1;
                });
                return counts;
            };
            const itemCounts = getBuyableIdCounts(state.items);
            const addCounts = getBuyableIdCounts(state.addAttempts);
            const removeCounts = getBuyableIdCounts(state.removeAttempts);

            // Return any item that has been added more times than it has been removed
            const seenItems = new Set();
            const possibleItems = [];
            state.addAttempts.concat(state.items).forEach((item) => {
                const id = item.buyable.id;
                if (!seenItems.has(id)) {
                    seenItems.add(id);
                    const totalCount =
                        (itemCounts[id] || 0) + (addCounts[id] || 0) - (removeCounts[id] || 0);
                    if (totalCount > 0) {
                        possibleItems.push(item);
                    }
                }
            });
            return possibleItems;
        },

        setItems: action((newItems) => {
            state.items.clear();
            state.items.replace(newItems);
        }),

        set unseenCount(value) {
            runInAction(() => {
                state.unseenCount.set(value);
            });
        },

        get isEmpty() {
            return api.items.length === 0;
        },

        findItemByBuyable(type, id) {
            return (
                api.items.find(
                    (item) =>
                        item.buyable &&
                        item.buyable.buyable_object_type === type &&
                        item.buyable.id === id,
                ) || null
            );
        },

        hasBuyable(type, id) {
            return Boolean(api.findItemByBuyable(type, id));
        },

        hasBuyables(buyables) {
            return (
                buyables.length > 0 &&
                buyables.every((e) => api.hasBuyable(e.buyable_object_type, e.id))
            );
        },

        get hasPendingOperations() {
            return state.addAttempts.length > 0 || state.removeAttempts.length > 0;
        },

        add: action((item) => {
            state.addAttempts.unshift(item);
            return finishAttempt(item, state.addAttempts);
        }),

        remove: action((item) => {
            state.removeAttempts.push(item);
            return finishAttempt(item, state.removeAttempts);
        }),

        clear: action(() => {
            state.items.clear();
            state.addAttempts.clear();
            state.removeAttempts.clear();
        }),

        get purchasePriceAmount() {
            return price(api.items, 'purchase_price');
        },

        get listPriceAmount() {
            return price(api.items, 'list_price');
        },

        get discountAmount() {
            const discountPrices = api.items
                .filter((item) => item.current_discount && item.current_discount.saving_price)
                .map((item) => item.current_discount);
            if (!discountPrices.length) {
                return 0;
            }
            return -price(discountPrices, 'saving_price');
        },

        get discountPercentage() {
            const listPriceAmount = api.listPriceAmount;
            return listPriceAmount
                ? Math.round(100 * (1 - api.purchasePriceAmount / listPriceAmount))
                : 0;
        },
    });

    return api;
}

function price(items, priceType) {
    return items.reduce((total, item) => total + parseFloat(item[priceType].amount), 0);
}

export default shoppingList;
