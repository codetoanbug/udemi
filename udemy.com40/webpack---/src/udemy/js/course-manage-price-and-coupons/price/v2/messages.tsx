import {FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS} from 'course-manage-v2/constants';

export const PRICE_SELECT_FREE_PRICES_HEADING_TEXT = gettext('Set a price for your course');
export const PRICE_SELECT_FREE_PRICES_BODY_TEXT = interpolate(
    gettext(
        'Please select the currency and the price tier for your course. ' +
            'If you’d like to offer your course for free, it must have a total video length of less than %s hours. ' +
            'Also, courses with practice tests can not be free.',
    ),
    [FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS],
);

export const WHERE_PRICE_SHOWN_LINK_TEXT = gettext('When will this price be shown?');
export const PRICE_SELECT_OPTED_IN_HEADING_TEXT = gettext('Set a backup price for your course');
export const PRICE_SELECT_OPTED_IN_BODY_TEXT = gettext(
    'Learners will see this backup price in case your Deals price cannot be shown.',
);
export const PRICE_SELECT_OPTED_OUT_HEADING_TEXT = PRICE_SELECT_FREE_PRICES_HEADING_TEXT;
export const PRICE_SELECT_OPTED_OUT_BODY_TEXT = gettext(
    'Please select the currency and the price tier for your course.',
);
export const PRICE_SELECT_BODY_TEXT_COMMON = interpolate(
    gettext(
        'If you’d like to offer your course for free, ' +
            'it must have a total video length of less than %s hours and can not have practice tests. ' +
            'If you switch your course between free and paid more than once, your promotional announcements will be limited.',
    ),
    [FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS],
);
export const PRICE_SELECT_OPTED_IN_EXPLANATION_HEADING_TEXT = gettext(
    'The backup price may be shown in certain situations, such as:',
);
export const PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_ONE = gettext(
    "In regions where we don't use the Deals program.",
);
export const PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_TWO = gettext(
    'In case of a temporary problem affecting the program',
);

export const FIND_OUT_MORE_LINK_TEXT = gettext('Find out more');
export const FREE_PAID_WARNING_ALERT_TITLE = gettext('A note when switching between free and paid');
export const FREE_PAID_WARNING_ALERT_TEXT = gettext(
    'If you switch your course between free and paid more than once, ' +
        'your promotional announcements will be limited.',
);

export const OPTED_IN_DEALS_HEADING_TEXT = gettext("You've opted into the Deals Program");
export const LEAR_MORE_LINK_TEXT = gettext('Learn more');
export const OPTED_IN_DEALS_BODY_TEXT = gettext(
    'Through this program we optimize your list price for most currencies. ' +
        'We will also offer your course at a discount during occasional promotions.',
);

export const PREMIUM_APPLICATION_WARNING_OWNER_TITLE_TEXT = gettext(
    'Please finish your premium application',
);
export const PREMIUM_APPLICATION_WARNING_OWNER_BODY_TEXT = gettext(
    "You'll be able to set your price once your payout method is approved.",
);
export const PREMIUM_APPLICATION_WARNING_CO_OWNER_TITLE_TEXT = gettext(
    'The owner of the course must complete the premium instructor application ' +
        'in order to update the course price.',
);
export const PREMIUM_APPLICATION_WARNING_BUTTON_TEXT = gettext('Complete the premium application');

export const PURCHASE_PRICE_RANGE_HEADING_TEXT = gettext('Purchase price range');
export const PRICE_RANGE_TO_BE_COMPUTED_YET_TEXT = gettext(
    "You will be able to see your course's price range (lowest discount price to list price) 14 days after you publish.",
);
export const PRICE_RANGE_ERROR_TEXT = gettext(
    "We're unable to display the course price range at this time. Please check back later.",
);

export const PRICE_RANGE_TEXT = gettext('%s - %s');
export const PRICE_RANGE_NON_FREE_LINE_ONE = gettext(
    'This price range includes both discount and list prices for your course. ' +
        "As part of the Deals Program, you can't set or edit this price range.",
);
export const PRICE_RANGE_NON_FREE_LINE_TWO = gettext(
    "The price Udemy sets is based on factors such as your course's content, " +
        'similar course prices, and learner response.',
);

export const PRICE_SELECT_OPTION_SELECT = gettext('Select');
export const PRICE_SELECT_OPTION_FREE = gettext('Free');
export const PRICE_SELECT_OPTED_INTO_DEALS_LABEL_TEXT = gettext('Backup Price Tier');
export const PRICE_SELECT_OPTED_OUT_DEALS_LABEL_TEXT = gettext('Price Tier');
export const PRICE_SELECT_OPTION_TIER_TEXT = gettext('(tier %s)');
export const PRICE_SELECT_CURRENCY_LABEL_TEXT = gettext('Currency');
export const PRICE_SELECT_CHANGES_SAVED_SUCCESS_TEXT = gettext(
    'Your changes have been successfully saved.',
);
export const PRICE_SELECT_SAVE_BUTTON_TEXT = gettext('Save');
export const PRICE_SELECT_PRICE_LABEL_TEXT = gettext('Price');

export const OPTED_OUT_DEALS_HEADING_TEXT = gettext('Want us to handle pricing and promotions?');
export const OPTED_OUT_DEALS_CONTENT_TEXT = gettext(
    'Enroll in the Deals Program to let Udemy dynamically set the price for your course based on demand, ' +
        'learner ratings, and other competing courses.',
);
export const OPTED_OUT_DEALS_CONTENT_SUB_HEADING_TEXT = gettext(
    "While we can't make guarantees, there are plenty of reasons to join our Deals Program:",
);
export const OPTED_OUT_DEALS_CONTENT_SUB_LINE_ONE = gettext(
    'Nearly 95% of top-earning instructors are opted-in to the Deals Program.',
);
export const OPTED_OUT_DEALS_CONTENT_SUB_LINE_TWO = gettext(
    'Courses opted-in to the Deals Program have an average of 5x more learners.',
);
export const OPTED_OUT_DEALS_CONTENT_SUB_LINE_THREE = gettext(
    'Courses opted-in to the Deals Program have learners in nearly 3x more countries on average.',
);
export const OPTED_OUT_DEALS_LINK_TEXT = gettext('Opt into Deals Program');

export const PRICE_POPOVER_OPTED_INTO_DEALS_TEXT = gettext(
    "Students will see your course's backup price in their local currency, " +
        'based on the corresponding tier in the <a class="priceTierMatrixUrl">price matrix</a>.',
);
export const PRICE_POPOVER_OPTED_OUT_DEALS_TEXT = gettext(
    'Your course price is based on the corresponding ' +
        'tier in the <a class="priceTierMatrixUrl">price matrix</a>. ' +
        'Learners will see it in their local currency.',
);
