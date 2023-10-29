import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorPerformanceNav = observer(() => {
    const headerStore = useHeaderStore();
    const udData = useUDData();
    const udConfig = udData.Config;
    const {basePath, paths} = headerStore.getInstructorPerformancePaths();
    const {gettext} = useI18n();

    function linkSection(text: string, path: string | null, cssToggleId?: string) {
        if (cssToggleId) {
            return (
                <MobileNavItem cssToggleId={cssToggleId}>
                    <span>{text}</span>
                </MobileNavItem>
            );
        }
        return <MobileNavItem href={`${basePath}${path}`}>{text}</MobileNavItem>;
    }

    function renderPracticeInsightsMenuItem() {
        return linkSection(
            gettext('Engagement'),
            null,
            'header-toggle-side-nav-instructor-performance-engagement',
        );
    }

    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-performance">
            <MobileNavSection>
                {!udConfig.brand.has_organization &&
                    linkSection(gettext('Overview'), paths.overviewPath)}
                {!udConfig.brand.has_organization &&
                    linkSection(gettext('Students'), paths.studentsPath)}
                {udConfig.brand.is_add_reviews_enabled &&
                    linkSection(gettext('Reviews'), paths.reviewsPath)}
                {headerStore.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                    ? renderPracticeInsightsMenuItem()
                    : linkSection(gettext('Course engagement'), paths.engagementPath)}
                {!udConfig.brand.has_organization &&
                    linkSection(gettext('Traffic & conversion'), paths.conversionPath)}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
