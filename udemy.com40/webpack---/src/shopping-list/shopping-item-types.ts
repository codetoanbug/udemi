import {toJS} from 'mobx';

import {
    BundleBuyable,
    BuyableObjectType,
    GiftBuyable,
    LicenseBuyable,
    ShoppingItem,
} from '../types/shopping-types';

interface ItemTypeConfig {
    type: BuyableObjectType;
    buildShoppingItems(item: ShoppingItem): ShoppingItem[];
}

export const shoppingItemTypes: ItemTypeConfig[] = [
    {
        type: 'course',
        buildShoppingItems: (item: ShoppingItem) => [item],
    },
    {
        type: 'bundle',
        buildShoppingItems: (item: ShoppingItem) => {
            const courses = toJS((item.buyable as BundleBuyable).courses);
            const updatedCourses: ShoppingItem[] = [];
            courses.forEach((course) => {
                const courseAsItem = {...course} as unknown as ShoppingItem;
                courseAsItem.buyable = course;
                updatedCourses.push(courseAsItem);
            });

            return updatedCourses;
        },
    },
    {
        type: 'gift',
        buildShoppingItems: (item: ShoppingItem) => {
            const updatedItem = toJS(item);
            updatedItem.buyable = (updatedItem.buyable as GiftBuyable).course;
            return [updatedItem];
        },
    },
    {
        type: 'license',
        buildShoppingItems: (item: ShoppingItem) => {
            const updatedItem = toJS(item);
            updatedItem.buyable = (updatedItem.buyable as LicenseBuyable).course;
            return [updatedItem];
        },
    },
];
