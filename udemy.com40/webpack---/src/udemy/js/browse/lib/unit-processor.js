import {
    PAGE_TYPE_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_LOGGED_OUT_HOMEPAGE,
    PAGE_TYPE_CATEGORY,
    PAGE_TYPE_SUBCATEGORY,
    PAGE_TYPE_TOPIC,
    PAGE_TYPE_SUBS_TOPIC,
    PAGE_TYPE_FREE_TOPIC,
    PAGE_TYPE_ORG_TOPIC,
    PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE,
} from '@udemy/discovery-api';

import {attachFrontendTrackingIds} from '../tracking';

// Generic utility to consolidate two units into one w/ a custom name and item type composed of configurable item types.
export function consolidateUnits(units, consolidatedUnitName, itemType, consolidateItemTypes = []) {
    const newUnits = [];

    const consolidatedUnit = {
        items: [],
        type: consolidatedUnitName,
        item_type: itemType,
        source_objects: [],
    };

    units.forEach((unit) => {
        if (consolidateItemTypes.includes(unit.type)) {
            consolidatedUnit.items = consolidatedUnit.items.concat(unit.items);
            consolidatedUnit.source_objects = unit.source_objects;
        } else {
            newUnits.push(unit);
        }
    });

    if (consolidatedUnit.items.length > 0) {
        newUnits.push(consolidatedUnit);
    }

    return newUnits;
}

// Combine "related categories" and "related subcategories" into one virtual unit.
// Note: It's important that we do not modify the original units.
function consolidateRelatedCategories(request, units, pageType) {
    if (
        ![
            PAGE_TYPE_TOPIC,
            PAGE_TYPE_FREE_TOPIC,
            PAGE_TYPE_ORG_TOPIC,
            PAGE_TYPE_SUBS_TOPIC,
        ].includes(pageType)
    ) {
        return units;
    }
    return consolidateUnits(
        units,
        'related_categories_and_subcategories',
        'category_or_subcategory',
        ['related_categories', 'related_subcategories', 'related_categories_and_subcategories'],
    );
}

function injectValueProps(request, units, pageType) {
    const PAGE_TYPES_TO_INJECT_IN = [
        PAGE_TYPE_CATEGORY,
        PAGE_TYPE_SUBCATEGORY,
        PAGE_TYPE_LOGGED_IN_HOMEPAGE,
        PAGE_TYPE_LOGGED_OUT_HOMEPAGE,
        PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE,
    ];
    if (!PAGE_TYPES_TO_INJECT_IN.includes(pageType)) {
        return units;
    }
    const newUnits = [];

    // Checking the initial load otherwise unitProcessor injecting the component every request.
    if (request.from !== 0) {
        return units;
    }

    const valuePropsUnit = {
        type: 'discovery_value_props',
        item_type: 'value_props',
    };

    const indexToInjectAfter = pageType === PAGE_TYPE_LOGGED_IN_HOMEPAGE ? 1 : 0;

    units.forEach((unit, i) => {
        newUnits.push(unit);
        if (i === indexToInjectAfter) {
            newUnits.push(valuePropsUnit);
        }
    });

    return newUnits;
}

function injectFeaturedTopics(request, units, pageType) {
    // future might add other pages (like category), check with product
    if (pageType !== PAGE_TYPE_LOGGED_IN_HOMEPAGE) {
        return units;
    }

    const newUnits = [];

    const featuredTopicsUnit = {
        type: 'featured_topics_unit',
        item_type: 'course_label',
    };

    units.forEach((unit, i) => {
        if (request.from === 0 && i === 1) {
            newUnits.push(featuredTopicsUnit);
        }
        newUnits.push(unit);
    });

    return newUnits;
}

// eslint-disable-next-line no-unused-vars
function attachFrontendTrackingIdsToUnits(request, units, pageType) {
    if (!units) {
        return [];
    }
    return units.map((unit) => {
        if (unit.items) {
            attachFrontendTrackingIds(unit.items);
        }
        return unit;
    });
}

const unitProcessors = [
    consolidateRelatedCategories,
    injectValueProps,
    injectFeaturedTopics,
    attachFrontendTrackingIdsToUnits,
];

export default class UnitProcessor {
    static processResponse(request, response, pageType) {
        // It's important that we don't modify the original response.
        // Response may be a cached object, so any direct modification would be reflected in the
        // cache, which we don't want.
        const units = this.processUnits(request, response.results, pageType);
        return {
            ...response,
            results: units,
        };
    }

    static processUnits(request, units, pageType) {
        let processedUnits = units;
        unitProcessors.forEach((processor) => {
            processedUnits = processor(request, processedUnits, pageType);
        });
        return processedUnits;
    }
}
