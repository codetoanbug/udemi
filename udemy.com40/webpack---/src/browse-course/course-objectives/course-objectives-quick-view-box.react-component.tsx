import classNames from 'classnames';
import {IObservableArray} from 'mobx';
import React, {useState} from 'react';

import {BrowseCourse} from '@udemy/browse-course';
import {BUYABLE_TYPES, CartBuyable} from '@udemy/cart-temp-migration';
import {trackGenericCourseClick, Tracker} from '@udemy/event-tracking';
import {useFunnelLogContextStore} from '@udemy/funnel-tracking';
import {useI18n} from '@udemy/i18n';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';
import {BasicPopperProps, Popover} from '@udemy/react-popup-components';
import {toLocaleDateString} from '@udemy/shared-utils';
import {CourseBuyable, Wishlist, WishlistStore} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

import {AddToCart} from '../../add-to-cart/add-to-cart.react-component';
import {QuickViewBoxOpenEvent, EnrollNowEvent, TrackableBuyable} from '../../external/events';
import {UI_REGION} from '../../external/ui-regions';
import styles from './course-objectives-quick-view-box.module.less';

export interface CourseObjectivesListProps {
    objectives: IObservableArray<string> | string[];
}

export const CourseObjectivesList = ({objectives}: CourseObjectivesListProps) => (
    <BlockList size="small" padding="tight">
        {objectives.map((objective, i) => (
            <BlockList.Item
                key={i}
                icon={<TickIcon label={false} color="neutral" />}
                data-testid="quick-view-box-objective"
            >
                {objective}
            </BlockList.Item>
        ))}
    </BlockList>
);

interface PreviousPurchaseInfo {
    previousPurchaseDate: Date;
}

const PreviousPurchaseInfo = ({previousPurchaseDate}: PreviousPurchaseInfo) => {
    const {gettext, interpolate} = useI18n();
    const purchaseDateString = toLocaleDateString(previousPurchaseDate, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    return (
        <div className={styles['purchase-info']}>
            <InfoIcon label={false} size="medium" color="info" />
            <b>
                {interpolate(
                    gettext('You enrolled in this course on %(purchaseDate)s'),
                    {purchaseDate: purchaseDateString},
                    true,
                )}
            </b>
        </div>
    );
};

/**
 * Props for the `CourseObjectivesQuickViewBox` component
 */
export interface CourseObjectivesQuickViewBoxProps {
    /**
     * Course to show objectives for
     */
    course: BrowseCourse;
    /**
     * Element that the popover should attach to
     */
    courseCard: React.ReactElement;
    /**
     * Optional className applied to the popover content
     */
    className?: string;
    /**
     * If true, will show the proper CTA button for the current user
     * in the popover
     */
    showCta?: boolean;
    /**
     * Should be true if the user is currently enrolled in this course. If this
     * is true, you should also provide the `enrollmentDate`
     */
    isUserEnrolled?: boolean;
    /**
     * The date that the user enrolled in the course. Should be provided if the
     * `isUserEnrolled` prop is true
     */
    enrollmentDate?: Date;
    /**
     * Placement of the popover in relation to the course card
     *
     * @default 'right'
     */
    placement?: BasicPopperProps['placement'];
}

/**
 * Renders the course objectives in a popover that is triggered on hover and attached to the given
 * `courseCard` component
 */
export const CourseObjectivesQuickViewBox = (props: CourseObjectivesQuickViewBoxProps) => {
    const udData = useUDData();
    const gettext = useI18n().gettext;
    const funnelLogContextStore = useFunnelLogContextStore();
    const [wishlistStore] = useState(new WishlistStore(props.course as CourseBuyable, udData.me));

    const placement = props.placement || 'top';

    /**
     * Logs a `quick-view-previewed` funnel event and publishes a `QuickViewBoxOpenEvent` event
     */
    function logQuickViewPreview() {
        const {course} = props;

        funnelLogContextStore.logAction(
            'quick-view-previewed',
            [{id: course.id}],
            funnelLogContextStore,
        );

        Tracker.publishEvent(
            new QuickViewBoxOpenEvent({
                id: course.id,
                trackingId: course.frontendTrackingId || course.tracking_id,
            }),
        );
    }

    /**
     * Publishes a `EnrollNowEvent` event
     */
    function trackEnrollNowClick() {
        const buyable = {
            id: props.course.id,
            type: BUYABLE_TYPES.COURSE,
            trackingId: props.course.frontendTrackingId || props.course.tracking_id,
        } as TrackableBuyable;
        Tracker.publishEvent(new EnrollNowEvent({buyable}));
    }

    /**
     * Publishes a generic course click event
     */
    function trackGoToCourseClick() {
        trackGenericCourseClick({
            courseId: props.course.id,
            courseTrackingId: (props.course.frontendTrackingId ||
                props.course.tracking_id) as string,
            componentName: 'srpCourseLearnCTAButton',
        });
    }

    /**
     * Renders popover content using a Popover function
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function renderContent({className, ...props}: any, ...rest: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const args: [any, any, any] = [
            {
                className: classNames(className, styles['popover-wrapper']),
                ...props,
            },
            ...rest,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as [any, any, any];
        return Popover.defaultProps.renderContent?.(...args);
    }

    function renderCallToAction() {
        const {course, showCta, isUserEnrolled} = props;
        if (showCta && !course.is_in_user_subscription && !udData.Config.brand.has_organization) {
            let content;
            if (isUserEnrolled) {
                content = (
                    <Button
                        componentClass="a"
                        className={styles['cta-button']}
                        data-testid="go-to-course-button"
                        href={course.learn_url}
                        udStyle={udData.Config.brand.has_organization ? 'brand' : 'primary'}
                        onClick={trackGoToCourseClick}
                    >
                        {gettext('Go to course')}
                    </Button>
                );
            } else if (course.free_course_subscribe_url) {
                content = (
                    <Button
                        componentClass="a"
                        className={styles['cta-button']}
                        data-testid="enroll-now-button"
                        href={course.free_course_subscribe_url}
                        udStyle={udData.Config.brand.has_organization ? 'brand' : 'primary'}
                        onClick={trackEnrollNowClick}
                    >
                        {gettext('Enroll now')}
                    </Button>
                );
            } else {
                content = (
                    <>
                        <div className={styles['cta-button']} data-testid="add-to-cart">
                            <AddToCart buyables={[course] as CartBuyable[]} />
                        </div>
                        <div className={styles.wishlist}>
                            <Wishlist
                                wishlistStore={wishlistStore}
                                round={true}
                                size="large"
                                uiRegion={UI_REGION.COURSE_OBJECTIVES}
                            />
                        </div>
                    </>
                );
            }
            return (
                <div
                    data-testid="course-objectives-quickviewbox-popover-content"
                    className={styles['cta-container']}
                >
                    {content}
                </div>
            );
        }
        return null;
    }

    const {className, course, courseCard} = props;

    if (!course.objectives_summary?.length) {
        return null;
    }

    return (
        <Popover
            placement={placement}
            trigger={courseCard}
            canToggleOnHover={true}
            detachFromTarget={true}
            toggleStrategy="add-remove"
            onFirstOpen={logQuickViewPreview}
            withPadding={false}
            renderContent={renderContent}
        >
            <div className={className} data-testid="course-objectives-quick-view-box-content">
                {props.isUserEnrolled && props.enrollmentDate && props.showCta ? (
                    <PreviousPurchaseInfo previousPurchaseDate={props.enrollmentDate} />
                ) : (
                    <>
                        <h2 className={classNames('ud-heading-md', styles['content-header'])}>
                            {gettext('What you’ll learn')}
                        </h2>
                        <CourseObjectivesList objectives={course.objectives_summary} />
                    </>
                )}
                {renderCallToAction()}
            </div>
        </Popover>
    );
};
