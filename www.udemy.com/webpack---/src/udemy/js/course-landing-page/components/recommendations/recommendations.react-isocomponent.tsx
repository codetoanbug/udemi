import {ClientSideRender} from '@udemy/design-system-utils';
import React from 'react';

import RecommendationsSkeleton from 'browse/components/recommendations/recommendations-skeleton.react-isocomponent';
import {
    RecommendationsComponent,
    RecommendationsComponentProps,
} from 'browse/components/recommendations/recommendations.react-component';
import {DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {RecommendationsData} from 'browse/types/recommendations';
import {UI_REGION} from 'browse/ui-regions';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {isomorphic} from 'utils/isomorphic-rendering';

interface GetRecommendationsResponse {
    recommendations?: RecommendationsData;
}

interface RecommendationsProps extends Omit<RecommendationsComponentProps, 'options'> {
    clcStore?: CourseLandingComponentsStore;
}

const Recommendations = ({
    clcStore,
    deviceType,
    showTitle = true,
    ...rest
}: RecommendationsProps) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState<RecommendationsData>();

    React.useEffect(() => {
        let isMounted = true;
        clcStore
            ?.getOrPopulate<GetRecommendationsResponse>(['recommendations'])
            .then((response) => {
                if (isMounted) {
                    setData(response.recommendations);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [clcStore]);

    const skeletonLayout = deviceType === DEVICE_TYPE_MOBILE ? 'multirow' : 'singlerow';

    return (
        <div className="component-margin">
            <ClientSideRender
                uiRegion={UI_REGION.RECOMMENDATIONS}
                placeholder={<RecommendationsSkeleton layout={skeletonLayout} />}
            >
                <>
                    {isLoading && <RecommendationsSkeleton layout={skeletonLayout} />}
                    {!isLoading && data && (
                        <RecommendationsComponent
                            deviceType={deviceType}
                            showTitle={showTitle}
                            {...data}
                            {...rest}
                        />
                    )}
                </>
            </ClientSideRender>
        </div>
    );
};

export default isomorphic(Recommendations);
