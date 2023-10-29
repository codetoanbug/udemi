import {ClientEvent} from '@udemy/event-tracking';

/**
 This event is fired when a user interacts with a feature using the feature discovery component
 */
interface FeatureDiscoveryClickEventProps {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
}

export class FeatureDiscoveryClickEvent extends ClientEvent {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
    constructor({featureId, featureName, featureState, type}: FeatureDiscoveryClickEventProps) {
        super('FeatureDiscoveryClickEvent');
        this.featureId = featureId;
        this.featureName = featureName;
        this.featureState = featureState;
        this.type = type;
    }
}

/**
 This event is fired when a user clicks out of a feature in the active state.
 */
interface FeatureDiscoveryDeEscalateEventProps {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
}

export class FeatureDiscoveryDeEscalateEvent extends ClientEvent {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
    constructor({
        featureId,
        featureName,
        featureState,
        type,
    }: FeatureDiscoveryDeEscalateEventProps) {
        super('FeatureDiscoveryDeEscalateEvent');
        this.featureId = featureId;
        this.featureName = featureName;
        this.featureState = featureState;
        this.type = type;
    }
}

/**
 This event is fired when a user sees the feature using the feature discovery component
 */
interface FeatureDiscoveryImpressionEventProps {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
}

export class FeatureDiscoveryImpressionEvent extends ClientEvent {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
    constructor({
        featureId,
        featureName,
        featureState,
        type,
    }: FeatureDiscoveryImpressionEventProps) {
        super('FeatureDiscoveryImpressionEvent');
        this.featureId = featureId;
        this.featureName = featureName;
        this.featureState = featureState;
        this.type = type;
    }
}

/**
 This event is fired when a feature discovery system handles the DELAY state transition event
 */
interface FeatureDiscoveryDelayEventProps {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
}

export class FeatureDiscoveryDelayEvent extends ClientEvent {
    featureId: number;
    featureName: string;
    featureState: string;
    type: string;
    constructor({featureId, featureName, featureState, type}: FeatureDiscoveryDelayEventProps) {
        super('FeatureDiscoveryDelayEvent');
        this.featureId = featureId;
        this.featureName = featureName;
        this.featureState = featureState;
        this.type = type;
    }
}

/**
 This event is fired when the state of the feature has changed
 */
interface FeatureDiscoveryStateChangeEventProps {
    featureId: number;
    featureName: string;
    previousState: string;
    currentState: string;
}

export class FeatureDiscoveryStateChangeEvent extends ClientEvent {
    featureId: number;
    featureName: string;
    previousState: string;
    currentState: string;
    constructor({
        featureId,
        featureName,
        previousState,
        currentState,
    }: FeatureDiscoveryStateChangeEventProps) {
        super('FeatureDiscoveryStateChangeEvent');
        this.featureId = featureId;
        this.featureName = featureName;
        this.previousState = previousState;
        this.currentState = currentState;
    }
}
