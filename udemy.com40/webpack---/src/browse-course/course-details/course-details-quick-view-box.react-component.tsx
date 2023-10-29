import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {useRef, useState} from 'react';

import {BrowseCourse} from '@udemy/browse-course';
import {AsyncCourseStaticPriceText} from '@udemy/browse-course';
import {getCourseBadgeFromType} from '@udemy/browse-course';
import {PriceStoreCourse} from '@udemy/browse-course';
import {BUYABLE_TYPES} from '@udemy/cart-temp-migration';
import {getUniqueId, findFocusables, ForcedTabOrder} from '@udemy/design-system-utils';
import {trackGenericCourseClick, Tracker} from '@udemy/event-tracking';
import {FunnelLogContextStore, useFunnelLogContextStore} from '@udemy/funnel-tracking';
import {useI18n} from '@udemy/i18n';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Button} from '@udemy/react-core-components';
import {
    Popover,
    PopoverProps,
    Popper,
    PopperGetTabOrderElementSelectors,
    RenderContentFunction,
} from '@udemy/react-popup-components';
import {Buyable, CourseBuyable, Wishlist, WishlistStore} from '@udemy/shopping';
import {SaveToListButton, PURCHASE_PRICE_TYPES} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

import {AddToCart} from '../../add-to-cart/add-to-cart.react-component';
import {QuickViewBoxOpenEvent, EnrollNowEvent, TrackableBuyable} from '../../external/events';
import {UI_REGION} from '../../external/ui-regions';
import {CourseObjectivesList} from '../course-objectives/course-objectives-quick-view-box.react-component';
import styles from './course-details-quick-view-box.module.less';

export interface CourseDetailsQuickViewBoxContentProps {
    assessmentRecommendation?: boolean;
    className?: string;
    course: BrowseCourse;
    onCourseTitleClickCallbackFunc?: () => void;
    onEnrollNowClickCallbackFunc?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resourceContextMenu?: any;
    showPrice?: boolean;
    learningPathId?: number;
}

const InternalCourseDetailsQuickViewBoxContent = (props: CourseDetailsQuickViewBoxContentProps) => {
    const {
        assessmentRecommendation,
        className,
        course,
        onCourseTitleClickCallbackFunc,
        onEnrollNowClickCallbackFunc,
        resourceContextMenu,
        learningPathId,
    } = props;
    const {Config, me, request} = useUDData();
    const {gettext} = useI18n();
    const [wishlistStore] = useState(new WishlistStore(course as CourseBuyable, me));
    const funnelLogContextStore: FunnelLogContextStore = useFunnelLogContextStore();

    /**
     * Publishes a `EnrollNowEvent` and executes `onEnrollNowClickCallbackFunc()` if it exists.
     */
    function trackEnrollNowClick() {
        const buyable = {
            id: course.id,
            type: BUYABLE_TYPES.COURSE,
            trackingId: course.frontendTrackingId || course.tracking_id,
        } as TrackableBuyable;
        Tracker.publishEvent(new EnrollNowEvent({buyable}));
        if (onEnrollNowClickCallbackFunc) {
            onEnrollNowClickCallbackFunc();
        }
    }

    /**
     * Publishes a `Generic Course Click` and executes `onCourseTitleClickCallbackFunc()` if it exists.
     */
    function trackCourseTitleClick() {
        trackGenericCourseClick({
            courseId: course.id,
            courseTrackingId: (course.frontendTrackingId || course.tracking_id) as string,
            componentName: 'quickViewBox',
        });
        if (onCourseTitleClickCallbackFunc) {
            onCourseTitleClickCallbackFunc();
        }
    }

    const isUserEnrolled = course.is_user_subscribed || course.is_in_user_subscription;
    const CourseBadgeComponent =
        course.badges && course.badges.length && !course.is_in_user_subscription
            ? getCourseBadgeFromType(course.badges[0].badge_family)
            : null;

    const userLocale = request.locale.replace('_', '-') || 'en-US';
    const courseDate = course.last_update_date
        ? {
              type: gettext('Updated'),
              date: new Date(course.last_update_date).toLocaleDateString(userLocale, {
                  month: 'long',
                  year: 'numeric',
              }),
          }
        : {
              type: gettext('Published'),
              date: new Date(course.published_time).toLocaleDateString(userLocale, {
                  month: 'long',
                  year: 'numeric',
              }),
          };

    const captionsList = [];
    if (course.has_closed_caption) {
        captionsList.push(gettext('Subtitles'));
    }

    if (course.has_508_closed_captions) {
        captionsList.push(gettext('CC'));
    }

    const statsLine = (
        <div className={classNames('ud-text-xs', styles.stats)}>
            <span>{course.content_info}</span>
            <span>{course.instructional_level}</span>
            {captionsList && <span>{captionsList.join(', ')}</span>}
        </div>
    );

    const isLimitedConsumptionTrial =
        Config.brand.has_organization && Config.brand.organization.is_limited_consumption_trial;

    let courseUrl = isUserEnrolled ? course.learn_url : course.url;

    if (learningPathId) {
        courseUrl = `${courseUrl}?learning_path_id=${learningPathId}`;
    }

    let cta;
    if (isLimitedConsumptionTrial) {
        const [url, queryString] = course.url.split('?');
        const searchParams = new URLSearchParams(queryString);
        searchParams.set('from_quick_view', '1');
        cta = (
            <Button
                componentClass="a"
                data-testid="watch-videos"
                href={`${url}?${searchParams.toString()}`}
                udStyle="brand"
            >
                <PlayIcon label={false} />
                {gettext('Watch videos')}
            </Button>
        );
    } else if (assessmentRecommendation || isUserEnrolled) {
        // TODO: href should update after the backend ready
        // assessmentRecommendation: In the new assessment project, we recommend courses.
        // We don't know if the user is enrolled or not in the course
        // We use a generic copy, 'View course' instead of 'Enroll now.'
        cta = (
            <Button componentClass="a" data-testid="view-course" href={courseUrl} udStyle="brand">
                {gettext('View course')}
            </Button>
        );
    } else if (course.free_course_subscribe_url) {
        cta = (
            <Button
                componentClass="a"
                data-testid="enroll-now-button"
                href={course.free_course_subscribe_url}
                udStyle={Config.brand.has_organization ? 'brand' : 'primary'}
                onClick={trackEnrollNowClick}
            >
                {gettext('Enroll now')}
            </Button>
        );
    } else {
        cta = <AddToCart buyables={[course] as Buyable[]} />;
    }

    const courseContextMenu = resourceContextMenu?.getQuickViewBoxContextMenu
        ? resourceContextMenu.getQuickViewBoxContextMenu({...course, isPublished: true})
        : null;

    const uiRegion = funnelLogContextStore?.subcontext
        ? `${funnelLogContextStore?.subcontext.replace(/ +/g, '_')}.${UI_REGION.QUICK_PREVIEW}`
        : UI_REGION.QUICK_PREVIEW;

    return (
        <div className={className}>
            <a
                className={classNames('ud-heading-lg', styles.title)}
                href={courseUrl}
                data-testid="quick-view-box-title"
                onClick={trackCourseTitleClick}
                onContextMenu={trackCourseTitleClick}
            >
                {course.title}
            </a>
            <div data-testid="badge-container" className={styles['badge-container']}>
                {CourseBadgeComponent && <CourseBadgeComponent className={styles.badge} />}
                <span className={classNames('ud-text-xs', styles.updated)}>
                    {courseDate.type}
                    <span className="ud-heading-xs"> {courseDate.date}</span>
                </span>
            </div>
            {statsLine}

            {courseContextMenu && <div className={styles['context-menu']}>{courseContextMenu}</div>}
            <div
                className={classNames('ud-text-sm', styles.headline)}
                data-testid="quick-view-box-headline"
            >
                {course.headline}
            </div>
            <div className={classNames('ud-text-sm', styles.objectives)}>
                {course.objectives_summary?.length ? (
                    <CourseObjectivesList objectives={course.objectives_summary} />
                ) : (
                    gettext('No course details available')
                )}
            </div>
            {props.showPrice && (
                <AsyncCourseStaticPriceText
                    courses={[course] as PriceStoreCourse[]}
                    trackingEventContext={{
                        buyableId: course.id,
                        priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                        buyableType: 'course',
                        buyableTrackingId: course.tracking_id,
                    }}
                />
            )}
            <div className={styles.cta}>
                <div className={styles['add-to-cart']}>{cta}</div>
                {course.is_paid && !isUserEnrolled && (
                    <div className={styles['cta-button']}>
                        <Wishlist
                            wishlistStore={wishlistStore}
                            round={true}
                            size="large"
                            uiRegion={uiRegion}
                        />
                    </div>
                )}
                {course.is_in_user_subscription && (
                    <div className={styles['cta-button']}>
                        <SaveToListButton
                            course={course}
                            round={true}
                            size="large"
                            uiRegion={uiRegion}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const CourseDetailsQuickViewBoxContent = Object.assign(
    inject(({resourceContextMenu}) => ({
        resourceContextMenu,
    }))(({resourceContextMenu, ...rest}) => {
        return (
            <InternalCourseDetailsQuickViewBoxContent
                {...rest}
                resourceContextMenu={resourceContextMenu}
            />
        );
    }),
    {
        displayName: 'CourseDetailsQuickViewBoxContent',
    },
);

/**
 * Props for the `CourseDetailsQuickViewBox` component
 */
export interface CourseDetailsQuickViewBoxProps {
    /**
     * Course to show details for
     */
    course: BrowseCourse;
    /**
     * Element that the popover should attach to
     */
    courseCard: React.ReactElement;
    /**
     * Optional className to be applied to the popover content
     */
    className?: string;
    /**
     * If true, will show the course price
     */
    showPrice?: boolean;
    /**
     * Placement of the popover
     *
     * @default 'right'
     */
    placement?: PopoverProps['placement'];
    /**
     * Called when the "Enroll now" button is clicked
     */
    onEnrollNowClickCallbackFunc?(): void;
    /**
     * Called when the course title is clicked
     */
    onCourseTitleClickCallbackFunc?(): void;
}

/**
 * Renders the course details in a popover that is triggered on hover and attached to the given
 * `courseCard` component
 */
export const CourseDetailsQuickViewBox = Object.assign(
    observer((props: CourseDetailsQuickViewBoxProps) => {
        const {
            className,
            course,
            courseCard,
            onCourseTitleClickCallbackFunc,
            onEnrollNowClickCallbackFunc,
        } = props;
        const {gettext} = useI18n();
        const funnelLogContextStore: FunnelLogContextStore = useFunnelLogContextStore();
        const popoverRef = useRef<Popper>(null);
        const [triggerButtonId] = useState(getUniqueId('trigger-button'));

        const showPrice = !!props.showPrice;
        const placement = props.placement ?? 'right';

        function onCloseButtonClick() {
            const Popper = popoverRef.current;
            const BasicPopper = Popper?.ref?.current;
            BasicPopper?.onClose();
            document.getElementById(triggerButtonId)?.focus();
        }

        function onTriggerButtonClick(event: React.MouseEvent) {
            const Popper = popoverRef.current;
            const BasicPopper = Popper?.ref?.current;
            BasicPopper?.onFocusOpen(event.currentTarget);
        }

        //(selectors: PopperGetTabOrderElementSelectors) => ForcedTabOrder[]
        function getTabOrder(selectors: PopperGetTabOrderElementSelectors): ForcedTabOrder[] {
            const {findTriggerNode, findFirstFocusableInContent, findLastFocusableInContent} =
                selectors;
            const triggerButton = document.getElementById(triggerButtonId);
            const findTriggerButton = () => {
                // We only want to re-order the tab flow when entering the popover content from outside; if we shift-tab when
                // on the first element, we want to let the popover's tab order handle it, rather than
                // returning to the trigger button. So, only return the trigger button if we're
                // trying to tab off of the trigger button.
                return document.activeElement === triggerButton ? triggerButton : null;
            };

            const findNextFocusableOutsideTriggerNode = () => {
                if (popoverRef.current?.ref.current?.isOpen) {
                    const focusablesInTriggerNode = findFocusables(
                        findTriggerNode() as HTMLElement,
                    );
                    const lastFocusableInTriggerNode =
                        focusablesInTriggerNode[focusablesInTriggerNode.length - 1];
                    const allFocusableElements = findFocusables(document.documentElement);
                    const lastFocusableIndex = allFocusableElements.findIndex(
                        (e) => e === lastFocusableInTriggerNode,
                    );
                    if (lastFocusableIndex === -1) {
                        return null;
                    }
                    if (lastFocusableIndex === allFocusableElements.length - 1) {
                        return allFocusableElements[0];
                    }
                    return allFocusableElements[lastFocusableIndex + 1];
                }
            };
            return [
                [findTriggerNode, findFirstFocusableInContent],
                [findTriggerButton, findFirstFocusableInContent],
                [findLastFocusableInContent, findNextFocusableOutsideTriggerNode],
            ];
        }

        function logQuickViewPreview() {
            funnelLogContextStore.logAction('quick-view-previewed', [{id: course.id}]);

            Tracker.publishEvent(
                new QuickViewBoxOpenEvent({id: course.id, trackingId: course.frontendTrackingId}),
            );
        }

        const renderContent: RenderContentFunction = ({className, ...props}, ...rest) => {
            const args = [
                {
                    className: classNames(className, styles['popover-wrapper']),
                    ...props,
                },
                ...rest,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ] as [any, any, any];
            return Popover.defaultProps.renderContent?.(...args);
        };

        const popoverContent = (
            <div data-testid="course-details-content">
                <CourseDetailsQuickViewBoxContent
                    course={course}
                    className={className}
                    showPrice={showPrice}
                    funnelLogContextStore={funnelLogContextStore}
                    onEnrollNowClickCallbackFunc={onEnrollNowClickCallbackFunc}
                    onCourseTitleClickCallbackFunc={onCourseTitleClickCallbackFunc}
                />
                <Button
                    className={classNames('ud-link-underline', styles['popover-interaction-btn'])}
                    data-testid="close-course-details-popover"
                    udStyle="ghost"
                    size="xsmall"
                    onClick={onCloseButtonClick}
                >
                    <span>{gettext('Close dialog')}</span>
                </Button>
            </div>
        );

        const popoverTrigger = (
            <div data-testid="course-details-popover-trigger" className={styles['full-height']}>
                {courseCard}
                <Button
                    className={classNames('ud-link-underline', styles['popover-interaction-btn'])}
                    data-testid="open-course-details-popover"
                    udStyle="ghost"
                    size="xsmall"
                    id={triggerButtonId}
                    onClick={onTriggerButtonClick}
                >
                    <span>{gettext('Show course details')}</span>
                </Button>
            </div>
        );

        return (
            <Popover
                placement={placement}
                trigger={popoverTrigger}
                canToggleOnHover={true}
                canOnlyToggleOnHover={true}
                detachFromTarget={true}
                toggleStrategy="add-remove"
                onFirstOpen={logQuickViewPreview}
                renderContent={renderContent}
                ref={popoverRef}
                getTabOrder={getTabOrder}
                className={styles['full-height']}
            >
                {popoverContent}
            </Popover>
        );
    }),
    {
        displayName: 'CourseDetailsQuickViewBox',
    },
);
