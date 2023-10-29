import {TrackImpression} from '@udemy/event-tracking';
import {UDData, withUDData} from '@udemy/ud-data';
import {AuthenticatedUser} from '@udemy/ud-data/dist/@types/types';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {
    FeatureDiscoverabilityStore,
    FeatureEvents,
    FeatureState,
    MachineConfig,
} from './feature-discoverability.mobx-store';

export interface RenderedComponent {
    component: React.ReactNode;
    primaryComponentType: string;
}

export type RenderingStrategy = Partial<Record<FeatureState, RenderedComponent>>;
// ***** Example: RenderingStrategy *****
// {
//     [FeatureState.ACTIVE]: {
//         component: <CoolFeatureModal/>, // Any JSX Node
//         primaryComponentType: 'modal'
//     }
//     [FeatureState.PASSIVE]: {
//         component: <CoolFeatureBanner/>, // Any JSX Node
//         primaryComponentType: 'banner'
//     }
// }

export const enum FeatureDiscoverabilityEventName {
    DELAY = 'FeatureDiscoveryDelayEvent',
    DE_ESCALATE = 'FeatureDiscoveryDeEscalateEvent',
    CTA_CLICKED = 'FeatureDiscoveryClickEvent',
}

export interface FeatureDiscoverabilityProps {
    config: MachineConfig;
    store?: FeatureDiscoverabilityStore;
    renderingStrategy: RenderingStrategy;
    udData: UDData;
}
@observer
export class InternalFeatureDiscoverability extends Component<FeatureDiscoverabilityProps> {
    constructor(props: FeatureDiscoverabilityProps) {
        super(props);
        this.store = new FeatureDiscoverabilityStore(
            props.config,
            this.props.renderingStrategy,
            props.udData.me as AuthenticatedUser,
        );
    }

    componentDidMount() {
        this.addEventListeners();
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    trackImpression = () => {
        this.store.featureImpressed();
    };

    addEventListeners = () => {
        document.addEventListener(
            FeatureDiscoverabilityEventName.CTA_CLICKED,
            this.store.featureClicked,
        );
        Object.keys(FeatureEvents).forEach((item) => {
            document.addEventListener(FeatureEvents[item], () => {
                this.store.dispatch({type: FeatureEvents[item]});
            });
        });
    };

    removeEventListeners = () => {
        document.removeEventListener(
            FeatureDiscoverabilityEventName.CTA_CLICKED,
            this.store.featureClicked,
        );
        Object.keys(FeatureEvents).forEach((item) => {
            document.removeEventListener(FeatureEvents[item], () =>
                this.store.dispatch({type: FeatureEvents[item]}),
            );
        });
    };

    readonly store: FeatureDiscoverabilityStore;

    render() {
        if (
            this.store.currentState === FeatureState.END ||
            this.store.currentState === FeatureState.PAUSED ||
            this.store.currentState === FeatureState.DORMANT
        ) {
            return null;
        }

        return (
            <div>
                <TrackImpression trackFunc={this.trackImpression}>
                    <div>{this.store.componentForState()?.component}</div>
                </TrackImpression>
            </div>
        );
    }
}

export const FeatureDiscoverability = withUDData(InternalFeatureDiscoverability);
