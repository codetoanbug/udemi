import {Tracker} from '@udemy/event-tracking';

import {
    MarketplaceInsightsActionEvent,
    MarketplaceInsightsSearchEvent,
    MarketplaceInsightsSearchResponseLoadEvent,
} from './events';
import {RESPONSE_TYPE} from './insights.mobx-store';

export function trackClick({action, category, objectType, objectId, actionType}) {
    return function () {
        Tracker.publishEvent(
            new MarketplaceInsightsActionEvent({
                action,
                category,
                objectType,
                objectId,
                actionType,
            }),
        );
    };
}

export function trackSearchEvent({query, language}) {
    Tracker.publishEvent(
        new MarketplaceInsightsSearchEvent({
            query,
            language,
        }),
    );
}

export function trackSearchResponseLoad({
    searchState,
    isAutocorrect,
    responseType,
    insights,
    errorMessage,
    sourcePage,
}) {
    let response = null;
    if (responseType === RESPONSE_TYPE.COURSE_LABEL) {
        response = insights.course_label_metrics.course_label.id.toString();
    } else if (responseType === RESPONSE_TYPE.QUERY) {
        response = insights.query_metrics.query;
    } else if (responseType === RESPONSE_TYPE.SUGGESTIONS) {
        response = JSON.stringify(
            insights.course_label_suggestions.map((courseLabelMetrics) =>
                courseLabelMetrics.course_label.id.toString(),
            ),
        );
    }

    let recommendation = null;
    let hasNoDemand = null;
    if (insights && insights.course_label_metrics) {
        recommendation = insights.course_label_metrics.recommendation;
        hasNoDemand = insights.course_label_metrics.hasNoDemand;
    }
    Tracker.publishEvent(
        new MarketplaceInsightsSearchResponseLoadEvent({
            searchState,
            isAutocorrect,
            responseType,
            response,
            recommendation,
            errorMessage,
            sourcePage,
            hasNoDemand,
        }),
    );
}
