import {Price} from '@udemy/shopping';

export interface PriceTextContext {
    pricing_result: {
        price: Price;
        has_discount_saving?: boolean;
    };
    show_discount_info?: boolean;
    has_discount_saving?: boolean;
    list_price: Price;
    is_valid_student?: boolean;
    purchase_date?: string;
}

/**
 * Resolves the correct pricing data given an object that adhere's to the `PriceTextContext` shape
 * @param context an object containing pricing data
 * @returns pricing data
 */
export function getPriceTextData(context: PriceTextContext) {
    const pricingResult = context.pricing_result;
    const showDiscountPrice = context.show_discount_info && pricingResult.has_discount_saving;
    const discountPrice = pricingResult.has_discount_saving
        ? pricingResult.price.amount
        : context.list_price.amount;
    const discountPriceString = pricingResult.has_discount_saving
        ? pricingResult.price.price_string
        : context.list_price.price_string;
    const listPrice = showDiscountPrice ? context.list_price.amount : discountPrice;
    const listPriceString = showDiscountPrice
        ? context.list_price.price_string
        : discountPriceString;
    const isValidStudent = context.is_valid_student;
    const purchaseDate = context.purchase_date;

    return {
        discountPrice,
        discountPriceString,
        isValidStudent,
        listPrice,
        listPriceString,
        purchaseDate,
        showDiscountPrice,
    };
}
