import {BrowseCourseCardProps} from '@udemy/browse-course';
import {DiscoveryUnit} from '@udemy/discovery-api';
import {ClickEvent, Tracker} from '@udemy/event-tracking';
import {
    SkillsHubUnit,
    SkillsHubUnitProps,
    SkillsHubAvailableFiltersSubUnit,
    CourseUnit,
} from '@udemy/react-discovery-units';
import {noop} from '@udemy/shared-utils';
import React from 'react';

import {BrowseCourse} from 'browse/types/course';

import styles from './skills-hub-course-unit.less';

interface SkillsHubCourseUnitProps extends SkillsHubUnitProps<BrowseCourse> {
    onLoad?: () => void;
    courseCardProps?: BrowseCourseCardProps;
    showQuickViewBox: boolean;
}

export class SkillsHubCourseUnit extends React.Component<SkillsHubCourseUnitProps> {
    static defaultProps = {
        onLoad: noop,
        courseCardProps: {},
        showQuickViewBox: true,
    };

    trackCarouselPagerButtonClickEvent = () => {
        Tracker.publishEvent(new ClickEvent({componentName: 'carousel'}));
    };

    renderContent = (
        unit: SkillsHubAvailableFiltersSubUnit<BrowseCourse>,
        isMobileMax?: boolean,
    ) => {
        if (isMobileMax) {
            // Since we're not showing the pager, we're not passing event tracking functions
            return (
                <>
                    <CourseUnit
                        unit={(unit as unknown) as DiscoveryUnit}
                        layout="singlerow"
                        onLoad={this.props.onLoad}
                        showPager={false}
                        fullWidth={true}
                        className={styles['mobile-course-unit']}
                        courseCardProps={this.props.courseCardProps}
                        showQuickViewBox={this.props.showQuickViewBox}
                    />
                </>
            );
        }
        return (
            <CourseUnit
                unit={(unit as unknown) as DiscoveryUnit}
                layout="singlerow"
                onLoad={this.props.onLoad}
                showPager={true}
                fullWidth={false}
                courseCardProps={this.props.courseCardProps}
                showQuickViewBox={this.props.showQuickViewBox}
                carouselProps={{
                    onNextClick: this.trackCarouselPagerButtonClickEvent,
                    onPreviousClick: this.trackCarouselPagerButtonClickEvent,
                }}
            />
        );
    };

    render() {
        return (
            <SkillsHubUnit
                alternateHeadline={this.props.alternateHeadline}
                className={this.props.className}
                unit={this.props.unit}
                showTitle={this.props.showTitle}
                renderUnitCta={this.props.renderUnitCta}
                renderContent={this.renderContent}
                bannerData={this.props.bannerData}
                compact={this.props.compact}
            />
        );
    }
}
