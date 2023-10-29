export default function getPriceTextData(context) {
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
