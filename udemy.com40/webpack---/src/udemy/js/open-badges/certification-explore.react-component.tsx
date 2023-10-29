import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';

import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import ResourceContextMenuProvider from 'organization-common/resource-context-menu/resource-context-menu-provider.react-component';
import {SubscriptionPlanProvider} from 'subscription-browse/subscription-plan-provider.react-component';

import {CertificationDiscoveryCourseList} from './certification-discovery-list.react-component';
import {CertificationModel} from './certification.mobx-model';
import style from './detail-page.less';
import {CertificationPathCard} from './udemy-path-card/certification-path-card.react-component';

interface CourseListItemProps {
    certification: CertificationModel;
    isCertPrepEnabled?: boolean;
}

const CertificationExploreComponent: React.FC<CourseListItemProps> = (props) => {
    const queryClient = new QueryClient();

    const {certification, isCertPrepEnabled} = props;

    const resourceContextMenuProps = {context: CONTEXT_TYPES.SEARCH};

    return (
        <>
            {isCertPrepEnabled && <CertificationPathCard certification={certification} />}
            <div className={classNames('ud-heading-serif-xl', style['topic-discovery-header'])}>
                {interpolate(
                    gettext('Explore all %(certificationName)s courses'),
                    {certificationName: certification.name},
                    true,
                )}
            </div>
            <ResourceContextMenuProvider resourceContextMenuProps={resourceContextMenuProps}>
                <QueryClientProvider client={queryClient}>
                    <SubscriptionPlanProvider>
                        <CertificationDiscoveryCourseList certification={certification} />
                    </SubscriptionPlanProvider>
                </QueryClientProvider>
            </ResourceContextMenuProvider>
        </>
    );
};

export const CertificationExplore = observer(CertificationExploreComponent);
