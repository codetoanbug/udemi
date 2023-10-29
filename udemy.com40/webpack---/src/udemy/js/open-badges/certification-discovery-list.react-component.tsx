import {PAGE_TYPE_TOPIC} from '@udemy/discovery-api';
import classNames from 'classnames';
import React, {useContext} from 'react';

import DiscoveryListContainer from 'browse/components/discovery-list-container/discovery-list-container.react-component';
import {AGGREGATION_TYPE_SUBS_FILTER} from 'browse/lib/constants';
import {ReactSubscriptionContext} from 'subscription-browse/subscription-plan-provider.react-component';
import {BrowseSubscriptionPlan} from 'subscription-browse/use-subscription-plans-by-product-type';

import {CertificationModel} from './certification.mobx-model';
import detailStyles from './detail-page.less';

export const CertificationDiscoveryCourseList = (props: {certification: CertificationModel}) => {
    const context = useContext(ReactSubscriptionContext) as BrowseSubscriptionPlan;
    const {isLoading, isPersonalPlanSubscriber, contentCollectionIds} =
        context ?? ({isLoading: true} as BrowseSubscriptionPlan);

    const {certification} = props;

    const presetFilters = () => {
        return isPersonalPlanSubscriber ? {[AGGREGATION_TYPE_SUBS_FILTER]: ['subs_only']} : {};
    };

    return (
        <div className={classNames(detailStyles['topic-discovery-header'])}>
            {!isLoading && (
                <DiscoveryListContainer
                    pageType={PAGE_TYPE_TOPIC}
                    pageSize={16}
                    pageObjectId={parseInt(certification.topic.id, 10)}
                    query={certification.id.toString()}
                    presetFilters={presetFilters()}
                    subsCollectionIds={contentCollectionIds.join('|')}
                />
            )}
        </div>
    );
};
