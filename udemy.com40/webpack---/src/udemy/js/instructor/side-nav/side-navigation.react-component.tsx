import {Tracker} from '@udemy/event-tracking';
import {getLinkPaths} from '@udemy/instructor';
import {Accordion} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import qs from 'utils/query-params';

import './side-navigation.less';
import {PracticeInsightsPresented} from '../../teaching-courses/instructor-analytics/events';
import {PerformanceSideNavigationItem} from './performance-side-navigation-item.react-component';

export const SideNavigation = observer(() => {
    const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const paths = getLinkPaths(queryParams);

    const currentLocation = useLocation();

    // locationChangeDetector just used to rerender component based on location change.
    const [, locationChangeDetector] = useState(0);

    useEffect(() => {
        locationChangeDetector((c) => c + 1);
    }, [currentLocation]);

    function getPerformanceSideNavigationItem(
        translatedText: string,
        path: string,
        isAccordion = false,
        isLastItem = false,
        badgeColorClass = '',
        badgeColorText = '',
        onClick?: () => void,
    ) {
        return (
            <PerformanceSideNavigationItem
                text={translatedText}
                path={path}
                isAccordion={isAccordion}
                isLastItem={isLastItem}
                badgeColorClass={badgeColorClass}
                badgeColorText={badgeColorText}
                onClick={onClick}
            />
        );
    }

    function handlePracticeInsightsOnClick() {
        const uiRegion = 'instructor_performance_left_sidenav';
        Tracker.publishEvent(new PracticeInsightsPresented(uiRegion));
    }

    function getPerformanceEngagementMenuSideNavigationItem() {
        const badgeColorClass = 'badgeColorClass';
        const badgeColorText = gettext('New');
        return (
            <Accordion size={'medium'}>
                <Accordion.Panel
                    title={gettext('Engagement')}
                    styleName="panel-style"
                    defaultExpanded={true}
                >
                    <div>
                        {getPerformanceSideNavigationItem(
                            gettext('Course engagement'),
                            paths.engagementPath,
                            true,
                        )}
                    </div>
                    <div>
                        {getPerformanceSideNavigationItem(
                            gettext('Practice insights'),
                            paths.practiceInsightsPath,
                            true,
                            false,
                            badgeColorClass,
                            badgeColorText,
                            handlePracticeInsightsOnClick,
                        )}
                    </div>
                </Accordion.Panel>
            </Accordion>
        );
    }

    return (
        <div data-purpose="side-navigation-component">
            <ul className="ud-unstyled-list" styleName="menu">
                <li>
                    <span styleName="title">{gettext('Performance')}</span>
                </li>
                {getPerformanceSideNavigationItem(gettext('Overview'), paths.overviewPath)}
                {getPerformanceSideNavigationItem(gettext('Students'), paths.studentsPath)}
                {getPerformanceSideNavigationItem(gettext('Reviews'), paths.reviewsPath)}
                {getPerformanceEngagementMenuSideNavigationItem()}
                {getPerformanceSideNavigationItem(
                    gettext('Traffic & conversion'),
                    paths.conversionPath,
                    false,
                    true,
                )}
            </ul>
        </div>
    );
});
