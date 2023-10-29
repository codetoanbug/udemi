import {ClientEvent} from '@udemy/event-tracking';

class MarketplaceInsightsActionEvent extends ClientEvent {
    constructor({action, category, objectType, objectId, actionType}) {
        super('MarketplaceInsightsActionEvent');
        this.action = action;
        this.category = category;
        this.objectType = objectType;
        this.objectId = objectId;
        this.actionType = actionType;
    }
}

class MarketplaceInsightsSearchResponseLoadEvent extends ClientEvent {
    constructor({
        searchState,
        isAutocorrect,
        responseType,
        response,
        recommendation,
        errorMessage,
        sourcePage,
        hasNoDemand,
    }) {
        super('MarketplaceInsightsSearchResponseLoadEvent');
        this.searchState = searchState;
        this.isAutocorrect = isAutocorrect;
        this.responseType = responseType;
        this.response = response;
        this.recommendation = recommendation;
        this.errorMessage = errorMessage;
        this.sourcePage = sourcePage;
        this.hasNoDemand = hasNoDemand;
    }
}

class MarketplaceInsightsSearchEvent extends ClientEvent {
    constructor({query, language}) {
        super('MarketplaceInsightsSearchEvent');
        this.query = query;
        this.language = language;
    }
}

export {
    MarketplaceInsightsActionEvent,
    MarketplaceInsightsSearchEvent,
    MarketplaceInsightsSearchResponseLoadEvent,
};
