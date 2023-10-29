import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {DiscoveryUnit, DiscoveryUnitItem} from '@udemy/discovery-api';
import {TrackImpression} from '@udemy/event-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {Accordion} from '@udemy/react-reveal-components';
import {Tabs, TabsProps} from '@udemy/react-structure-components';
import {noop} from '@udemy/shared-utils';

import {AlternateHeadline} from '../alternate-headline/alternate-headline.react-component';
import {CourseUnit, CourseUnitProps} from '../course-unit/course-unit.react-component';
import {UnitTitle} from '../unit-title/unit-title.react-component';
import {SkillsHubBanner, SkillsHubBannerProps} from './skills-hub-banner.react-component';
import {
    SkillsHubAvailableFiltersSubUnit,
    SkillsHubLoadingUnit,
    SkillsHubUnitStore,
} from './skills-hub-unit.mobx-store';
import styles from './skills-hub-unit.module.less';

export interface SkillsHubUnitProps<T extends DiscoveryUnitItem> {
    /**
     *
     * Props to pass to the AlternateHeadline child component.
     *
     * @remarks
     * The AlternateHeadine will be rendered only if showTitle is also false.
     */
    alternateHeadline?: {
        title: string;
        secondaryText?: string;
    };
    /** A custom classname, if any. */
    className?: string;
    /** The discovery unit to display. May also be a dummy loading unit.*/
    unit: SkillsHubLoadingUnit<T> | DiscoveryUnit<T>;
    /**
     *
     * Whether or not to show a UnitTitle child component.
     *
     * @remarks
     * If this is false and alternateHeadline above is defined, show an AlternateHeadline instead.
     * */
    showTitle?: boolean;
    /** The size of tabs to use on the desktop layout.*/
    tabSize?: TabsProps['size'];
    /** An optional render prop for a CTA.*/
    renderUnitCta?: (unit: SkillsHubAvailableFiltersSubUnit<T>) => React.ReactNode;
    /**
     *
     * An optional render prop for the main content of each tab.
     *
     * @remarks
     * This will pass the subunit for that tab into the given render prop, so the tab content can differ on a per-tab basis.
     **/
    renderContent?: (
        unit: SkillsHubAvailableFiltersSubUnit<T>,
        isMobileMax?: boolean,
    ) => React.ReactNode;
    /** Data to be passed into an optionally rendered chid SkillsHubBanner.*/
    bannerData?: {
        topics?: {[key: string]: Omit<SkillsHubBannerProps, 'onCtaClick'>};
        onCtaClick?: SkillsHubBannerProps['onCtaClick'];
    };
    /** Whether or not to use a compact layout. Stops showing the CTA on mobile, among other style changes.*/
    compact?: boolean;
    /** Whether or not the viewport is under the mobile max limit.*/
    isMobileMax?: boolean;
    onLoad?: () => void;
    courseCardProps?: CourseUnitProps['courseCardProps'];
    showQuickViewBox: boolean;

    /**
     * Track tab actions such as tab selection, tabs impression and carousel pager events
     *
     * @remarks
     * Note that carousel tracking is only available on desktop since we're not rendering buttons in mobile
     */
    tabTrackingContext?: {
        uiRegion?: string;
        onCarouselPagerButtonClick?: () => void;
        onTabSelect?: (subUnit: SkillsHubAvailableFiltersSubUnit<T>, index: number) => void;
        onTabImpression?: (subUnit: SkillsHubAvailableFiltersSubUnit<T>, index: number) => void;
    };
}

/**
 *
 * The SkillsHubUnit component.
 *
 * @remarks
 * This is a component that's meant to organize a discovery unit into tabs based on their items.
 * It is the responsibility of the parent component to:
 * - Manage the loading/fetching of the DiscoveryUnit to display
 * - Render a CTA show in the mobile Accordion view
 * - Render the content for each Tab/Accordion, given a subnit of a Discovery Unit.
 */
@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
export class SkillsHubUnit<T extends DiscoveryUnitItem> extends React.Component<
    SkillsHubUnitProps<T>
> {
    static defaultProps = {
        alternateHeadline: undefined,
        bannerData: undefined,
        className: undefined,
        compact: false,
        isMobileMax: null,
        onLoad: noop,
        renderUnitCta: noop,
        showQuickViewBox: true,
        showTitle: false,
        tabSize: undefined,
    };
    private store: SkillsHubUnitStore<T>;

    constructor(props: SkillsHubUnitProps<T>) {
        super(props);
        this.store = new SkillsHubUnitStore<T>(this.props.unit);
    }

    renderBanner(key: string) {
        const {bannerData} = this.props;
        if (!bannerData?.topics?.[key]) {
            return null;
        }

        return <SkillsHubBanner {...bannerData.topics[key]} onCtaClick={bannerData?.onCtaClick} />;
    }

    withTabImpression = (
        node: React.ReactElement,
        subUnit: SkillsHubAvailableFiltersSubUnit<T>,
        index: number,
    ) => {
        return (
            <TrackImpression
                key={index}
                trackFunc={() => this.props.tabTrackingContext?.onTabImpression?.(subUnit, index)}
                visibilityThreshold={0.25}
            >
                {node}
            </TrackImpression>
        );
    };

    render() {
        const {subUnits} = this.store;
        const {
            alternateHeadline,
            className,
            compact,
            courseCardProps,
            isMobileMax,
            onLoad,
            showQuickViewBox,
            showTitle,
            tabSize,
        } = this.props;
        let content;
        const hasBanner = !isMobileMax && !!this.props.bannerData;
        if (isMobileMax) {
            content = (
                <>
                    <Accordion size={compact ? 'medium' : undefined}>
                        {subUnits.map((subUnit, i) =>
                            this.withTabImpression(
                                <Accordion.Panel
                                    key={i}
                                    title={subUnit.title}
                                    defaultExpanded={i === 0}
                                    toggleStrategy="add-remove"
                                    onToggle={() =>
                                        this.props.tabTrackingContext?.onTabSelect?.(subUnit, i)
                                    }
                                >
                                    {this.props.renderContent?.(subUnit, isMobileMax) || (
                                        <CourseUnit
                                            unit={subUnit as unknown as CourseUnitProps['unit']}
                                            layout="singlerow"
                                            onLoad={onLoad}
                                            showPager={false}
                                            /* allowScroll={true} */
                                            fullWidth={true}
                                            className={styles['mobile-course-unit']}
                                            courseCardProps={courseCardProps}
                                            showQuickViewBox={showQuickViewBox}
                                            carouselProps={{
                                                allowScroll: isMobileMax,
                                            }}
                                        />
                                    )}
                                    {this.props.renderUnitCta?.(subUnit)}
                                </Accordion.Panel>,
                                subUnit,
                                i,
                            ),
                        )}
                    </Accordion>
                </>
            );
        } else {
            content = (
                <Tabs
                    size={tabSize}
                    onSelect={(tabId) =>
                        this.props.tabTrackingContext?.onTabSelect?.(
                            subUnits[tabId as number],
                            tabId as number,
                        )
                    }
                >
                    {subUnits.map((subUnit, index) => {
                        // Note that, id must be same as unit's index in the subUnits array
                        return (
                            <Tabs.Tab
                                title={subUnit.title}
                                key={subUnit.title}
                                id={index}
                                renderTabButton={(tabButton) =>
                                    this.withTabImpression(tabButton, subUnit, index)
                                }
                            >
                                <div
                                    className={classNames({
                                        [styles['with-banner-container']]: hasBanner,
                                    })}
                                >
                                    {this.renderBanner(subUnit.title)}
                                    {this.props.renderContent?.(subUnit, isMobileMax) || (
                                        <CourseUnit
                                            unit={subUnit as unknown as CourseUnitProps['unit']}
                                            layout="singlerow"
                                            onLoad={onLoad}
                                            showPager={true}
                                            fullWidth={false}
                                            courseCardProps={courseCardProps}
                                            showQuickViewBox={showQuickViewBox}
                                            carouselProps={{
                                                onNextClick: () =>
                                                    this.props.tabTrackingContext?.onCarouselPagerButtonClick?.(),
                                                onPreviousClick: () =>
                                                    this.props.tabTrackingContext?.onCarouselPagerButtonClick?.(),
                                            }}
                                        />
                                    )}
                                </div>
                            </Tabs.Tab>
                        );
                    })}
                </Tabs>
            );
        }

        return (
            <div
                className={classNames(className, {[styles['with-banner-wrapper']]: hasBanner})}
                data-purpose="skills-hub-unit"
            >
                {!showTitle && alternateHeadline && (
                    <AlternateHeadline titleTag="h2" {...alternateHeadline} />
                )}
                {showTitle && (
                    <UnitTitle
                        typography={compact ? 'ud-heading-lg' : undefined}
                        unit={this.props.unit}
                    />
                )}
                {content}
            </div>
        );
    }
}
