import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {ComponentType} from 'react';

import {
    AsyncPriceCourseCard,
    BrowseCourseCard,
    BrowseCourseCardProps,
    BrowseCourseCardContext,
    BrowseCourse,
} from '@udemy/browse-course';
import {discoveryTracker} from '@udemy/browse-event-tracking';
import {DiscoveryUnit} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {FunnelLogContextStore} from '@udemy/funnel-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {withCourseCardUBGuard} from '@udemy/react-card-components';
import {CourseCardSkeleton} from '@udemy/react-reveal-components';
import {Carousel, CarouselProps} from '@udemy/react-structure-components';
import {BorderedCourseCard} from '@udemy/shared-one-udemy-components';
import {noop} from '@udemy/shared-utils';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';

import {CourseDetailsQuickViewBoxLazy} from '../browse-course/course-details/course-details-quick-view-box-lazy.react-component';
import {UnitTitle} from '../unit-title/unit-title.react-component';
import stylesExperimental from './course-unit-experimental.module.less';
import {CourseUnitSkeleton} from './course-unit-skeleton.react-component';
import {CourseUnitStore} from './course-unit.mobx-store';
import styles from './course-unit.module.less';

/**
 * Experimental Course Card
 *
 * @internal
 *
 * @privateRemarks
 *
 * Exported for reference in specs. Otherwise not for consumption outside of this module.
 */
export const ExperimentalBorderedCourseCard = withCourseCardUBGuard(BorderedCourseCard);

export interface CourseUnitProps extends WithI18nProps, WithUDDataProps {
    className?: string;
    discoveryUnitsStore: {pageType: string; units: DiscoveryUnit[]};
    funnelLogContextStore: FunnelLogContextStore;
    unit: DiscoveryUnit;
    layout?: 'multirow' | 'singlerow';
    showTitle?: boolean;
    titleTypography?: string;
    showPager?: boolean;
    fullWidth?: boolean;
    courseCardProps?: BrowseCourseCardProps;
    showQuickViewBox?: boolean;
    hasHover?: boolean;
    hasCoarsePointer?: boolean;
    /**
     * Additional carousel props to pass to the underlying carousel component.
     *
     * @remarks
     * Focuses mainly on handling the eventing for the underlying carousel for now
     */
    carouselProps?: Pick<CarouselProps, 'allowScroll' | 'onNextClick' | 'onPreviousClick'>;
    /**
     * Flag to render the experimental BorderedCourseCard and carousel layout
     *
     * @defaultValue `false` in `CourseUnit`
     */
    renderExperimentalCourseCards?: boolean;
    /**
     * Callback that is forwarded to the `onLoad` prop of the `Image` component
     */
    onLoad?: () => void;
    /**
     * defines the css class to control number of columns in the css grid
     */
    gridCols?: number;
}

@withMatchMedia({hasHover: '(hover: hover)', hasCoarsePointer: '(any-pointer: coarse)'})
@inject('discoveryUnitsStore', 'funnelLogContextStore')
@observer
export class CourseUnitInternal extends React.Component<CourseUnitProps> {
    id: string;
    store: CourseUnitStore;

    constructor(props: CourseUnitProps) {
        super(props);
        const {discoveryUnitsStore, funnelLogContextStore, unit, udData} = props;
        const {pageType} = discoveryUnitsStore;
        this.store = new CourseUnitStore(pageType, unit, udData);
        // only use alphanumeric characters for html id
        this.id = `course-unit-container-${this.store.unit.title?.replace(/[^a-z0-9]/gi, '')}`;
        funnelLogContextStore.updateContext({
            context2: 'featured',
            subcontext: unit.title,
            subcontext2: unit?.id as unknown as string,
        });
    }

    static defaultProps = {
        className: undefined,
        layout: 'multirow',
        showTitle: false,
        titleTypography: 'ud-heading-xl',
        showPager: false,
        hasHover: null,
        hasCoarsePointer: null,
        fullWidth: true,
        courseCardProps: {},
        showQuickViewBox: true,
        renderExperimentalCourseCards: false,
        onLoad: noop,
        gridCols: undefined,
    };

    componentDidMount() {
        if (!this.store.unit.items.length) {
            this.fetchUnit();
        }
    }

    /**
     * TODO: Once we figure out what we want to do for subtitles, use this and the get subtitleTemplate
     * property to pass subtitle to UnitTitle component
     */
    get subtitleTemplates() {
        const {gettext} = this.props;
        return [
            gettext('Explore our %(title)s courses from our top-rated instructors'),
            gettext('Browse our collection of %(title)s courses from our top-rated instructors'),
        ];
    }

    get subtitleTemplate() {
        const bestsellerUnits = this.props.discoveryUnitsStore.units.filter(
            (unit) => unit.type === 'bestseller' && unit.raw_title === 'Top {} courses in {}',
        );

        const thisIndex = bestsellerUnits.findIndex(
            (unit) => unit.tracking_id === this.props.unit.tracking_id,
        );

        return thisIndex > -1 && thisIndex < this.subtitleTemplates.length
            ? this.subtitleTemplates[thisIndex]
            : null;
    }

    fetchUnit = async () => {
        return await this.store.fetchUnit({skipPrice: true});
    };

    renderCourseImage = <TProps extends Pick<React.ComponentPropsWithoutRef<'img'>, 'onLoad'>>(
        CourseImageComponent: ComponentType<TProps>,
        props: TProps,
    ) => {
        return <CourseImageComponent {...props} onLoad={this.props.onLoad} />;
    };

    render() {
        if (!this.store.unit.items.length && this.store.loading) {
            return <CourseUnitSkeleton layout={this.props.layout} />;
        }
        const courseCardSize = this.props.layout === 'multirow' ? 'small' : 'medium';
        const showQuickViewBox = this.props.hasHover && this.props.showQuickViewBox;
        const unitItems = this.store.unit.items as BrowseCourse[];
        const courseCards = unitItems.map((course: BrowseCourse, i: number) => (
            <TrackingContextProvider
                key={course.id}
                trackingContext={{
                    trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                    index: i,
                    backendSource: this.store.backendSource,
                }}
            >
                <CourseDetailsQuickViewBoxLazy
                    course={course}
                    showQuickViewBox={showQuickViewBox}
                    courseCard={
                        <AsyncPriceCourseCard
                            course={course}
                            size={courseCardSize}
                            width={this.props.layout === 'multirow' ? 'fixed' : 'flexible'}
                            {...(i === 0 && {
                                renderCourseImage: this.renderCourseImage,
                            })}
                            showDetails={false}
                            className={styles['course-card']}
                            {...this.props.courseCardProps}
                        />
                    }
                />
            </TrackingContextProvider>
        ));

        if (this.store.hasMore && !this.props.showPager) {
            const numCards = this.props.layout === 'multirow' ? 3 : 1;
            for (let i = 0; i < numCards; i++) {
                courseCards.push(
                    <CourseCardSkeleton
                        size={this.props.layout === 'multirow' ? 'small' : 'medium'}
                        key={courseCards.length + i}
                    />,
                );
            }
        }

        const cardComponent = this.props.renderExperimentalCourseCards
            ? ExperimentalBorderedCourseCard
            : BrowseCourseCard.defaultCardComponent;

        const carouselClassName = classNames({
            [styles['multi-row-container']]: this.props.layout === 'multirow',
            [styles.grid]:
                this.props.layout !== 'multirow' && !this.props.renderExperimentalCourseCards,
            [styles[`col-${this.props.gridCols}`]]: !!this.props.gridCols,
            [stylesExperimental.grid]: this.props.renderExperimentalCourseCards,
        });

        return (
            <div className={this.props.className}>
                {this.props.showTitle && (
                    <UnitTitle unit={this.props.unit} typography={this.props.titleTypography} />
                )}
                <BrowseCourseCardContext.Provider value={{cardComponent}}>
                    <Carousel
                        className={carouselClassName}
                        data-testid="course-unit-carousel"
                        id={this.id}
                        onLoadMore={async () => {
                            this.fetchUnit;
                        }}
                        showPager={this.props.showPager}
                        allowScroll={!!this.props.hasCoarsePointer}
                        pagerButtonClassName={styles['pager-button']}
                        {...this.props.carouselProps}
                    >
                        {courseCards}
                    </Carousel>
                </BrowseCourseCardContext.Provider>
            </div>
        );
    }
}

const CourseUnitWithProviders = withUDData(withI18n(CourseUnitInternal));
export {CourseUnitWithProviders as CourseUnit};
