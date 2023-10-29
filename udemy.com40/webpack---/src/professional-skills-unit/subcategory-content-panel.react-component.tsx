import classNames from 'classnames';
import {observer, MobXProviderContext} from 'mobx-react';
import React from 'react';

import {AvailableFiltersUnit} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import {CourseUnit} from '../course-unit/course-unit.react-component';
import {SkillFilters} from '../skill-filters/skill-filters.react-component';
import {SkillsHubAvailableFiltersSubUnit} from '../skills-hub-unit/skills-hub-unit.mobx-store';
import styles from './subcategory-content-panel.module.less';
import {SubcategoryUnitStore} from './subcategory-unit.mobx-store';

export interface SubcategoryUnitItem extends AvailableFiltersUnit {
    id: number;
}

interface SubcategoryContentPanelProps {
    className?: string;
    unit: SkillsHubAvailableFiltersSubUnit<SubcategoryUnitItem>;
    onShowAllClick?: () => void;
    onCarouselPagerButtonClick?: () => void;
}

export const SubcategoryContentPanel = observer(
    ({
        className,
        unit,
        onShowAllClick,
        onCarouselPagerButtonClick,
    }: SubcategoryContentPanelProps) => {
        const {gettext, interpolate} = useI18n();
        const {pageType} = React.useContext(MobXProviderContext).discoveryUnitsStore as {
            pageType: string;
        };
        const [store] = React.useState(new SubcategoryUnitStore(unit, pageType));
        const isMobileMax = useMatchMedia('mobile-max');
        const showPagerButtons = !isMobileMax;
        const useAccordionLayout = isMobileMax ?? undefined;

        React.useEffect(() => {
            store.loadShowAllUrl();
            store.populateEnrollmentStats();
        }, [store]);

        const handleChange = React.useCallback(
            (url: string) => {
                store.setSelectedUnitUrl(url);
            },
            [store],
        );

        const renderCourseUnit = (unitData: AvailableFiltersUnit) => {
            return (
                <div
                    key={unitData.url}
                    className={classNames(styles['course-unit-container'], {
                        [styles['active']]: unitData.url === store.selectedUnitUrl,
                    })}
                >
                    <TrackingContextProvider
                        trackingContext={{
                            uiRegion: 'all_skills_courses',
                        }}
                    >
                        <CourseUnit
                            renderExperimentalCourseCards={!useAccordionLayout}
                            unit={{
                                remaining_item_count: 1,
                                items: [],
                                type: 'placeholder',
                                ...unitData,
                            }}
                            layout="singlerow"
                            showPager={showPagerButtons}
                            fullWidth={useAccordionLayout}
                            carouselProps={{
                                allowScroll: true,
                                onNextClick: () => onCarouselPagerButtonClick?.(),
                                onPreviousClick: () => onCarouselPagerButtonClick?.(),
                            }}
                        />
                    </TrackingContextProvider>
                </div>
            );
        };

        return (
            <div className={classNames(className, styles['content'])}>
                <SkillFilters
                    radioGroupName={`${store.unit.title} skill filters`}
                    filters={store.unit}
                    handleChange={handleChange}
                />
                {store.unit.available_filters?.units.map(renderCourseUnit)}
                <Button
                    componentClass="a"
                    udStyle="secondary"
                    disabled={!store.showAllUrl}
                    href={store.showAllUrl}
                    onClick={() => onShowAllClick?.()}
                >
                    {interpolate(
                        gettext('Show all %(label)s courses'),
                        {label: store.unit.title},
                        true,
                    )}
                </Button>
            </div>
        );
    },
);
