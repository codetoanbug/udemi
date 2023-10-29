import {action, computed, observable, runInAction, IObservableArray} from 'mobx';

import {ShoppingItem, Buyable, Priceable, Price} from '../types/shopping-types';

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
export class ShoppingList {
    private readonly state;

    constructor(name: string, initialItems?: IObservableArray<ShoppingItem>, unseenCount?: number) {
        this.state = observable({
            name,
            addAttempts: observable.array<ShoppingItem>(),
            removeAttempts: observable.array<ShoppingItem>(),
            items: initialItems ?? observable.array(),
            unseenCount: observable.box(unseenCount ?? 0),
        });
    }

    finishAttempt(item: ShoppingItem, list: IObservableArray<ShoppingItem>) {
        return action(() => {
            // only remove a single item occurrence from the list, in case the item
            // has been moved multiple times between API calls
            const itemToRemove = list.find((t) => t.buyable.id === item.buyable.id);
            if (itemToRemove) {
                list.remove(itemToRemove);
            }
        });
    }

    @computed
    get name() {
        return this.state.name;
    }

    @computed
    get unseenCount() {
        return this.state.unseenCount.get();
    }

    set unseenCount(value: number) {
        runInAction(() => {
            this.state.unseenCount.set(value);
        });
    }

    /*
     * The current set of items in the list, with pending modifications applied.
     */
    @computed
    get items() {
        // track # of "occurrences" of each buyableId in a map; e.g. {123: 1, 456: 3}
        // Note: we count "exists in state.items array" as 1 occurrence
        const getBuyableIdCounts = (items: ShoppingItem[]) => {
            const counts: Record<number, number> = {};
            items.forEach((item) => {
                const id = item.buyable.id;
                counts[id] = (counts[id] || 0) + 1;
            });
            return counts;
        };

        const itemCounts = getBuyableIdCounts(this.state.items);
        const addCounts = getBuyableIdCounts(this.state.addAttempts);
        const removeCounts = getBuyableIdCounts(this.state.removeAttempts);

        // Return any item that has been added more times than it has been removed
        const seenItems = new Set();
        const possibleItems: ShoppingItem[] = [];
        this.state.addAttempts.concat(this.state.items).forEach((item) => {
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
    }

    @action
    setItems = (newItems: ShoppingItem[]) => {
        this.state.items.clear();
        this.state.items.replace(newItems);
    };

    @computed
    get isEmpty() {
        return this.items.length === 0;
    }

    findItemByBuyable(type: string, id: number) {
        return (
            this.items.find(
                (item) =>
                    item.buyable &&
                    item.buyable.buyable_object_type === type &&
                    item.buyable.id === id,
            ) || null
        );
    }

    hasBuyable(type: string, id: number) {
        return Boolean(this.findItemByBuyable(type, id));
    }

    hasBuyables(buyables: Buyable[]) {
        return (
            buyables.length > 0 &&
            buyables.every((e) => this.hasBuyable(e.buyable_object_type, e.id))
        );
    }

    @computed
    get hasPendingOperations() {
        return this.state.addAttempts.length > 0 || this.state.removeAttempts.length > 0;
    }

    @action
    add = (item: ShoppingItem) => {
        this.state.addAttempts.unshift(item);
        return this.finishAttempt(item, this.state.addAttempts);
    };

    @action
    remove = (item: ShoppingItem) => {
        this.state.removeAttempts.push(item);
        return this.finishAttempt(item, this.state.removeAttempts);
    };

    @action
    clear = () => {
        this.state.items.clear();
        this.state.addAttempts.clear();
        this.state.removeAttempts.clear();
    };

    @computed
    get purchasePriceAmount() {
        return price(this.items, 'purchase_price');
    }

    @computed
    get listPriceAmount() {
        return price(this.items, 'list_price');
    }

    @computed
    get discountAmount() {
        const discountPrices = this.items
            .filter((item) => item.current_discount && item.current_discount.saving_price)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((item) => item.current_discount!);
        if (!discountPrices.length) {
            return 0;
        }
        return -price(discountPrices, 'saving_price');
    }

    @computed
    get discountPercentage() {
        const listPriceAmount = this.listPriceAmount;
        return listPriceAmount
            ? Math.round(100 * (1 - this.purchasePriceAmount / listPriceAmount))
            : 0;
    }
}

function price(items: Priceable[], priceType: keyof Priceable) {
    return items.reduce(
        (total, item) => total + parseFloat(String((item[priceType] as Price)?.amount)),
        0,
    );
}
