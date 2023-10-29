import {TrackingContextProvider} from '@udemy/event-tracking';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import {observer} from 'mobx-react';
import React from 'react';

import DiscoveryUnitsContainerStore from 'browse/components/discovery-units-container/discovery-units-container.mobx-store';
import DiscoveryUnitsContainer from 'browse/components/discovery-units-container/discovery-units-container.react-component';
import {DEVICE_TYPE_DESKTOP, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {RecommendationsData, RecommendationsFetchOptions} from 'browse/types/recommendations';

import RecommendationsSkeleton from './recommendations-skeleton.react-isocomponent';

interface AlternateTitle {
    title: string;
    secondaryText?: string;
}

interface CourseUnitProps {
    fullWidth: boolean;
    layout: string;
    showPager: boolean;
}

interface RelatedSource {
    relatedSourceId?: string;
    relatedSourceType?: string;
}

export interface RecommendationsComponentProps extends RecommendationsData, RelatedSource {
    alternateTitle?: AlternateTitle;
    showTitle?: boolean;
    unitPropsByType?: {
        // TODO: import props type from React component once it is migrated to TS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CourseUnit?: CourseUnitProps;
    };
    deviceType: typeof DEVICE_TYPE_DESKTOP | typeof DEVICE_TYPE_MOBILE;
    options: RecommendationsFetchOptions;
    itemCount?: number;
    discoveryUnitsContainerStore?: DiscoveryUnitsContainerStore;
}

@observer
export class RecommendationsComponent extends React.Component<RecommendationsComponentProps> {
    static defaultProps = {
        showTitle: true,
        unitPropsByType: {},
        options: {},
    };

    constructor(props: RecommendationsComponentProps) {
        super(props);
        const {
            pageType,
            pageObjectId,
            pageObject,
            units,
            discoveryUnitsContainerStore,
        } = this.props;
        this.discoveryUnitContainerStore =
            discoveryUnitsContainerStore ??
            new DiscoveryUnitsContainerStore({
                pageType,
                units,
                pageObjectId,
                pageObject,
            });
    }

    discoveryUnitContainerStore: DiscoveryUnitsContainerStore;

    render() {
        const {
            showTitle,
            unitPropsByType,
            alternateTitle,
            options,
            relatedSourceId,
            relatedSourceType,
            ...props
        } = this.props;
        const isMobile = this.props.deviceType === DEVICE_TYPE_MOBILE;
        const layout = isMobile ? 'multirow' : 'singlerow';

        if (this.discoveryUnitContainerStore.loading) {
            return <RecommendationsSkeleton layout={layout} />;
        }

        return (
            <>
                {!showTitle &&
                    alternateTitle &&
                    Boolean(this.discoveryUnitContainerStore.units.length) && (
                        <AlternateHeadline
                            titleTag="h2"
                            title={alternateTitle.title}
                            secondaryText={alternateTitle.secondaryText}
                        />
                    )}
                <TrackingContextProvider
                    trackingContext={{
                        backendSource: this.discoveryUnitContainerStore.backendSource,
                        relatedSourceId,
                        relatedSourceType,
                    }}
                >
                    <DiscoveryUnitsContainer
                        {...props}
                        unitPropsByType={unitPropsByType}
                        showTitle={showTitle}
                        store={this.discoveryUnitContainerStore}
                        units={this.discoveryUnitContainerStore.units}
                        skeletonComponent={RecommendationsSkeleton}
                        fetchOptions={options}
                    />
                </TrackingContextProvider>
            </>
        );
    }
}
