import classNames from 'classnames';
import React from 'react';

import {BackendSourceOptions, discoveryTracker} from '@udemy/browse-event-tracking';
import {ClickEvent, Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';

import {
    SkillsHubUnit,
    SkillsHubUnitProps,
} from '../skills-hub-unit/skills-hub-unit.react-component';
import {professionalSkillsShowcaseData} from './data/professional-skills-showcase';
import styles from './professional-skills-unit.module.less';
import {
    SubcategoryContentPanel,
    SubcategoryUnitItem,
} from './subcategory-content-panel.react-component';

/**
 * Props for the `ProfessionalSkillsUnit` component
 */
export interface ProfessionalSkillsUnitProps {
    /**
     * Optional class name applied to the outer `div` of the unit
     */
    className?: string;
    /**
     * Optional class name applied to the `div` wrapping the content panel, where content
     * panel is either a tab content panel or accordion panel depending on screen size.
     */
    contentPanelClassName?: string;
    /**
     * Optional object containing the data for this unit. Primarily used for
     * testing purposes
     *
     * @default `professionalSkillsShowcaseData`
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unitData?: any;
}

/**
 * Discovery unit that renders an expanded version of the `SkillsHubUnit` with a topic
 * pill carousel at the top and a different course carousel layout using `BorderedCourseCard`
 */
export const ProfessionalSkillsUnit = ({
    className,
    contentPanelClassName,
    unitData = professionalSkillsShowcaseData,
}: ProfessionalSkillsUnitProps) => {
    const {gettext} = useI18n();

    const onCarouselPagerButtonClick = () =>
        Tracker.publishEvent(new ClickEvent({componentName: 'carousel'}));

    const getTabTrackingContext =
        (): SkillsHubUnitProps<SubcategoryUnitItem>['tabTrackingContext'] => {
            return {
                onTabImpression: (subUnit, index) =>
                    trackTabAction(
                        discoveryTracker.trackDiscoveryImpression,
                        subUnit as SubcategoryUnitItem,
                        index,
                    ),
                onTabSelect: (subUnit, index) =>
                    trackTabAction(
                        discoveryTracker.trackDiscoveryItemClickEvent,
                        subUnit as SubcategoryUnitItem,
                        index,
                    ),
                onCarouselPagerButtonClick,
            };
        };

    const trackTabAction = (
        trackFunc:
            | typeof discoveryTracker.trackDiscoveryImpression
            | typeof discoveryTracker.trackDiscoveryItemClickEvent,
        unit: SubcategoryUnitItem,
        index: number,
    ) => {
        const {item, trackingContext} = {
            item: {
                id: unit.id,
                title: unit.title,
                type: 'course_subcategory',
                frontendTrackingId: unit.frontendTrackingId,
            },

            trackingContext: {
                backendSource: BackendSourceOptions.DISCOVERY,
                index: index,
                uiRegion: 'all_skills',
            },
        };
        trackFunc({item}, trackingContext);
    };

    const trackShowAllCtaClick = (unit: SubcategoryUnitItem) =>
        Tracker.publishEvent(
            new ClickEvent({
                componentName: 'browseMoreCourses',
                relatedObjectType: 'course_subcategory',
                relatedObjectId: unit.id,
            }),
        );

    const renderContent: SkillsHubUnitProps<SubcategoryUnitItem>['renderContent'] =
        React.useCallback(
            (unit) => {
                return (
                    <SubcategoryContentPanel
                        className={contentPanelClassName}
                        unit={unit}
                        onShowAllClick={() => trackShowAllCtaClick(unit)}
                        onCarouselPagerButtonClick={onCarouselPagerButtonClick}
                    />
                );
            },
            [contentPanelClassName],
        );

    return (
        <div className={className} data-testid="professional-skills-unit">
            <div className="professional-skills-unit-header">
                <h2 className={classNames('ud-heading-serif-xxxl', 'ud-text-responsive')}>
                    {gettext('All the skills you need in one place')}
                </h2>
                <div className={classNames('ud-text-lg', 'ud-text-responsive', styles.subtitle)}>
                    {gettext(
                        'Covering critical workplace skills to technical topics, including prep content for over 200 industry-recognized certifications, our catalog supports well-rounded professional development and spans multiple languages.',
                    )}
                </div>
            </div>
            <SkillsHubUnit
                className={styles['skills-hub-unit']}
                unit={unitData}
                renderContent={renderContent}
                tabTrackingContext={getTabTrackingContext()}
            />
        </div>
    );
};
