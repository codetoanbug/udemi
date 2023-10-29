import {Tracker} from '@udemy/event-tracking';
import {AuthenticatedUser} from '@udemy/ud-data/dist/@types/types';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {
    FeatureDiscoveryClickEvent,
    FeatureDiscoveryDeEscalateEvent,
    FeatureDiscoveryDelayEvent,
    FeatureDiscoveryImpressionEvent,
    FeatureDiscoveryStateChangeEvent,
} from './events';
import {RenderingStrategy} from './feature-discoverability.react-component';
import {UserFeatureDataStore, ONE_DAY_IN_MS} from './user-feature-data.mobx-store';

// Feature states
export const enum FeatureState {
    ACTIVE = 'ACTIVE',
    PASSIVE = 'PASSIVE',
    PAUSED = 'PAUSED',
    DORMANT = 'DORMANT',
    END = 'END',
}

export const FeatureEvents: {[key: string]: string} = {
    ESCALATE: 'ESCALATE',
    DESIRED_ACTION: 'DESIRED_ACTION',
    DISMISS_FOREVER: 'DISMISS_FOREVER',
    GO_DORMANT: 'GO_DORMANT', // based on passive session count increases, put user in DORMANT state
    DE_ESCALATE: 'DE_ESCALATE',
    DELAY_TO_DORMANT: 'DELAY_TO_DORMANT', // based on user interaction (i.e. "remind me later"), put user in DORMANT state, which revives to PASSIVE
    DELAY_TO_PAUSED: 'DELAY_TO_PAUSED', // based on user interaction (i.e. "remind me later"), put user in PAUSED state, which revives to ACTIVE
    RESUME: 'RESUME',
    RESURRECT: 'RESURRECT',
};

// Config required by feature state guards
export interface MachineConfig {
    id: number;
    name: string;
    escalateAfterSessionCount: number;
    dormantSessionCount: number;
    daysToResurrect: number;
    resumeAfterSessionCount: number;
}

interface EventContext {
    action?: () => void;
    cond?: () => boolean;
    target: FeatureState;
}

// Interface of State Machine Object
export interface MachineContext {
    initial: FeatureState;
    context: MachineConfig;
    states: {
        [key in FeatureState]: {
            on?: {
                [key in keyof typeof FeatureEvents]: EventContext;
            };
        };
    };
}

export class FeatureDiscoverabilityStore {
    machine: MachineContext;
    @observable currentState: FeatureState = FeatureState.PASSIVE;
    userFeatureDataStore: UserFeatureDataStore;

    constructor(
        config: MachineConfig,
        renderingStrategy: RenderingStrategy,
        me: AuthenticatedUser,
    ) {
        this.machine = (this.createMachine(config) as unknown) as MachineContext;
        this.renderingStrategy = renderingStrategy;
        // We get the initial state from local storage, if it exists;
        // otherwise, we set PASSIVE.
        this.userFeatureDataStore = new UserFeatureDataStore(config.id, config.name, me);
        this.currentState = this.userFeatureDataStore.featureState;

        // Enact any valid session and/or state changes since the last time the user
        // interacted with this feature state machine
        //
        // NOTE: Any event dispatches will only apply if the state transition is valid
        //       (according to state machine configuration below)
        if (this.userFeatureDataStore.isNewSession()) {
            this.userFeatureDataStore.incrementSession();
            this.dispatch({type: FeatureEvents.RESUME});
            this.dispatch({type: FeatureEvents.GO_DORMANT});
            this.dispatch({type: FeatureEvents.ESCALATE});
        }
        this.userFeatureDataStore.updateSessionData();
        this.dispatch({type: FeatureEvents.RESURRECT});
    }

    private readonly renderingStrategy: RenderingStrategy;

    @autobind
    @action
    componentForState() {
        return this.renderingStrategy[this.currentState];
    }

    @autobind
    @action
    setState(newState: FeatureState) {
        this.currentState = newState;
        this.userFeatureDataStore.updateFeatureStateInStorage(newState);
    }

    @autobind
    @action
    featureImpressed() {
        const componentForState = this.componentForState();
        if (componentForState) {
            if (this.userFeatureDataStore.isNewSession()) {
                this.userFeatureDataStore.incrementSession();
            }
            this.userFeatureDataStore.updateSessionData();
            this.trackFeatureDiscoveryImpression(componentForState.primaryComponentType);
        }
    }

    @autobind
    @action
    featureClicked() {
        this.userFeatureDataStore.resetSessionCount();
        const componentForState = this.componentForState();
        if (componentForState) {
            const type = componentForState.primaryComponentType;

            Tracker.publishEvent(
                new FeatureDiscoveryClickEvent({
                    featureId: this.machine.context.id,
                    featureName: this.machine.context.name,
                    featureState: this.currentState.toLowerCase(), // lowercase for eventing
                    type,
                }),
            );
        }
    }

    @autobind
    trackFeatureDiscoveryImpression(type: string) {
        Tracker.publishEvent(
            new FeatureDiscoveryImpressionEvent({
                featureId: this.machine.context.id,
                featureName: this.machine.context.name,
                featureState: this.currentState.toLowerCase(), // lowercase for eventing
                type,
            }),
        );
    }

    @autobind
    trackFeatureDiscoveryStateChange(previousState: string, currentState: string) {
        Tracker.publishEvent(
            new FeatureDiscoveryStateChangeEvent({
                featureId: this.machine.context.id,
                featureName: this.machine.context.name,
                previousState: previousState.toLowerCase(), // lowercase for eventing
                currentState: currentState.toLowerCase(), // lowercase for eventing
            }),
        );
    }

    @autobind
    trackFeatureDiscoveryDelayEvent() {
        const componentForState = this.componentForState();
        if (componentForState) {
            const type = componentForState.primaryComponentType;
            Tracker.publishEvent(
                new FeatureDiscoveryDelayEvent({
                    featureId: this.machine.context.id,
                    featureName: this.machine.context.name,
                    featureState: this.currentState.toLowerCase(), // lowercase for eventing
                    type,
                }),
            );
        }
    }

    @autobind
    dispatch(event: {type: string}) {
        // Dispatch function checks the current state and event type and changes the feature state.
        // Each state has different event options.(ESCALATE, DELAY, DISMISS_FOREVER, .etc)
        // So, dispatch doesn't change the state if the state and event combination doesn't
        // match with the machine definition
        // There are some conditions on events,
        // if the state has a condition, dispatch returns the target state or current state
        // Dispatch function also calls the action if exist

        let newState: FeatureState;
        const desiredEvent = this.machine.states[this.currentState]?.on?.[event.type];

        // Change the state if provided condition passed
        const hasCondition = Boolean((desiredEvent as EventContext)?.cond);
        if (hasCondition) {
            const passedCondition = (desiredEvent as EventContext).cond?.();
            if (passedCondition) {
                newState = (desiredEvent as EventContext).target;
                desiredEvent?.action?.(); // Run associated action when state transition is valid
            } else {
                newState = this.currentState;
            }
        } else {
            newState = (desiredEvent as EventContext)?.target ?? this.currentState;
            desiredEvent?.action?.(); // Run associated action when state transition is valid
        }
        // Track state change event only when the state had changed
        if (this.currentState != newState) {
            this.trackFeatureDiscoveryStateChange(this.currentState, newState);
        }
        // Update State
        this.setState(newState as FeatureState);
    }

    @autobind
    @action
    createMachine(config: MachineConfig) {
        return {
            context: {
                ...config,
            },
            states: {
                [FeatureState.PASSIVE]: {
                    on: {
                        [FeatureEvents.ESCALATE]: {
                            cond: this.shouldEscalate,
                            target: FeatureState.ACTIVE,
                        },
                        [FeatureEvents.DESIRED_ACTION]: {
                            action: this.handleDesiredAction,
                            target: FeatureState.END,
                        },
                        [FeatureEvents.DISMISS_FOREVER]: {
                            action: this.handleDismissForever,
                            target: FeatureState.END,
                        },
                        [FeatureEvents.GO_DORMANT]: {
                            action: this.handleGoDormant,
                            cond: this.shouldGoDormant,
                            target: FeatureState.DORMANT,
                        },
                        [FeatureEvents.DELAY_TO_DORMANT]: {
                            action: this.handleDelayToDormant,
                            target: FeatureState.DORMANT,
                        },
                        [FeatureEvents.DELAY_TO_PAUSED]: {
                            action: this.handleDelay,
                            target: FeatureState.PAUSED,
                        },
                    },
                },
                [FeatureState.ACTIVE]: {
                    on: {
                        [FeatureEvents.DE_ESCALATE]: {
                            action: this.handleDeEscalate,
                            target: FeatureState.PASSIVE,
                        },
                        [FeatureEvents.DESIRED_ACTION]: {
                            action: this.handleDesiredAction,
                            target: FeatureState.END,
                        },
                        [FeatureEvents.DISMISS_FOREVER]: {
                            action: this.handleDismissForever,
                            target: FeatureState.END,
                        },
                        [FeatureEvents.DELAY_TO_PAUSED]: {
                            action: this.handleDelay,
                            target: FeatureState.PAUSED,
                        },
                        [FeatureEvents.GO_DORMANT]: {
                            action: this.handleGoDormant,
                            cond: this.shouldGoDormant,
                            target: FeatureState.DORMANT,
                        },
                    },
                },
                [FeatureState.PAUSED]: {
                    on: {
                        [FeatureEvents.RESUME]: {
                            cond: this.shouldResume,
                            target: FeatureState.ACTIVE,
                            action: this.handleResume,
                        },
                    },
                },
                [FeatureState.DORMANT]: {
                    on: {
                        [FeatureEvents.RESURRECT]: {
                            cond: this.shouldResurrect,
                            target: FeatureState.PASSIVE,
                            action: this.handleResurrect,
                        },
                    },
                },
                [FeatureState.END]: {},
            },
        };
    }

    @autobind shouldEscalate() {
        return (
            this.userFeatureDataStore.sessionCount > this.machine.context.escalateAfterSessionCount
        );
    }

    @autobind
    shouldGoDormant() {
        if (
            this.currentState === FeatureState.ACTIVE &&
            this.componentForState()?.primaryComponentType !== 'activation-card'
        ) {
            return false;
        }
        return this.userFeatureDataStore.sessionCount > this.machine.context.dormantSessionCount;
    }

    @autobind
    shouldResume() {
        return (
            this.userFeatureDataStore.sessionCount > this.machine.context.resumeAfterSessionCount
        );
    }

    @autobind
    shouldResurrect() {
        if (!this.userFeatureDataStore.dormantStartDate) return false;

        const resurrectionDelay = this.machine.context.daysToResurrect * ONE_DAY_IN_MS;
        const resurrectionThreshold =
            this.userFeatureDataStore.dormantStartDate + resurrectionDelay;
        return Date.now() > resurrectionThreshold;
    }

    @autobind
    @action
    handleDismissForever() {
        this.userFeatureDataStore.setDismissForever(true);
    }

    @autobind
    @action
    handleDesiredAction() {
        this.userFeatureDataStore.setDesiredActionDone(true);
    }

    @autobind
    @action
    handleGoDormant() {
        document.dispatchEvent(new CustomEvent(FeatureEvents.GO_DORMANT));
        this.userFeatureDataStore.setDormantStartDate(Date.now());
    }

    @autobind
    @action
    handleDelayToDormant() {
        this.trackFeatureDiscoveryDelayEvent();
        document.dispatchEvent(new CustomEvent(FeatureEvents.GO_DORMANT));
        this.userFeatureDataStore.setDormantStartDate(Date.now());
    }

    @autobind
    @action
    handleResurrect() {
        this.userFeatureDataStore.resetSessionCount();
        this.userFeatureDataStore.setDormantStartDate(null);
    }

    @autobind
    @action
    handleDelay() {
        this.trackFeatureDiscoveryDelayEvent();
        this.userFeatureDataStore.resetSessionCount();
    }

    @autobind
    @action
    handleResume() {
        this.userFeatureDataStore.resetSessionCount();
    }

    @autobind
    @action
    handleDeEscalate() {
        const componentForState = this.componentForState();
        if (componentForState) {
            const type = componentForState.primaryComponentType;
            Tracker.publishEvent(
                new FeatureDiscoveryDeEscalateEvent({
                    featureId: this.machine.context.id,
                    featureName: this.machine.context.name,
                    featureState: this.currentState.toLowerCase(), // lowercase for eventing
                    type,
                }),
            );
        }
    }
}
