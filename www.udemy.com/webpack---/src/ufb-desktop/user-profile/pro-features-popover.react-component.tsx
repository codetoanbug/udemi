import {observer} from 'mobx-react';
import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {BlockList} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {useUDLink} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {
    OrganizationUserProFeatureLabSelectEvent,
    OrganizationUserProFeatureAssessmentSelectEvent,
    OrganizationUserProFeatureUdemyPathSelectEvent,
    OrganizationUserProFeatureWorkspaceSelectEvent,
} from './events';
import styles from './pro-features-popover.module.less';

export const ProFeaturesPopover = observer(() => {
    const headerStore = useHeaderStore();
    const udLink = useUDLink();
    const {gettext} = useI18n();

    const {urls} = headerStore;
    const uiRegion = 'user_dropdown_menu';

    return (
        <Popover
            placement="left"
            shouldCloseOtherPoppers={false}
            canToggleOnHover={true}
            withArrow={false}
            withPadding={false}
            trigger={
                <BlockList.Item
                    color="neutral"
                    href={urls.PRO_ONBOARDING}
                    icon={<NextIcon label={gettext('Next')} />}
                    data-testid="pro-features-item"
                >
                    {gettext('Pro features')}
                </BlockList.Item>
            }
            className={styles['pro-feature-popover']}
        >
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                <BlockList.Item
                    color="neutral"
                    href={urls.PRO_PATHS}
                    data-testid="udemy-paths-item"
                    onClick={() =>
                        Tracker.publishEvent(
                            new OrganizationUserProFeatureUdemyPathSelectEvent({uiRegion}),
                        )
                    }
                >
                    {gettext('Udemy paths')}
                </BlockList.Item>
            </BlockList>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                <BlockList.Item
                    color="neutral"
                    href={urls.ASSESSMENTS}
                    data-testid="assessments-item"
                    onClick={() =>
                        Tracker.publishEvent(
                            new OrganizationUserProFeatureAssessmentSelectEvent({uiRegion}),
                        )
                    }
                >
                    {gettext('Assessments')}
                </BlockList.Item>
            </BlockList>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                <BlockList.Item
                    color="neutral"
                    href={urls.LABS}
                    data-testid="labs-item"
                    onClick={() =>
                        Tracker.publishEvent(
                            new OrganizationUserProFeatureLabSelectEvent({uiRegion}),
                        )
                    }
                >
                    {gettext('Labs')}
                </BlockList.Item>
            </BlockList>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                <BlockList.Item
                    color="neutral"
                    href={udLink.toSupportLink('how_to_access_courses_with_workspaces', true)}
                    target="_blank"
                    data-testid="workspaces-item"
                    onClick={() =>
                        Tracker.publishEvent(
                            new OrganizationUserProFeatureWorkspaceSelectEvent({uiRegion}),
                        )
                    }
                >
                    {gettext('Workspaces')}
                </BlockList.Item>
            </BlockList>
        </Popover>
    );
});
