import {getCourseBadgeFromType} from '@udemy/browse-course';
import {useFormatNumber, useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import PURCHASE_PRICE_TYPES from 'base-components/price-text/constants';
import {StaticPriceText} from 'base-components/price-text/static-price-text.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {
    CourseCardDetails,
    getDefaultCourseCardMetadata,
} from './course-card-details.react-component';
import styles from './course-card.less';

const courseImageSizes = {
    small: {width: 64, height: 64},
    medium: {width: 240, height: 135},
    large: {width: 260, height: 145},
};

export const CourseImage = ({course, size, ...props}) => {
    const src = size === 'small' ? course.image_50x50 : course.image_240x135;
    const src2x = size === 'small' ? course.image_100x100 : course.image_480x270;
    const imageSize = courseImageSizes[size];
    return <Image src={src} srcSet={`${src} 1x, ${src2x} 2x`} alt="" {...imageSize} {...props} />;
};

CourseImage.propTypes = {
    course: PropTypes.object.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
};

export function getPriceInfo(course) {
    const {discount, price_detail: priceDetail} = course;
    const listPrice = priceDetail ? parseFloat(priceDetail.amount) : 0;
    const listPriceString = priceDetail ? priceDetail.price_string : undefined;
    const discountPrice = discount ? parseFloat(discount.price.amount) : listPrice;
    const discountPriceString = discount ? discount.price.price_string : listPriceString;
    return {discountPrice, discountPriceString, listPrice, listPriceString};
}

const CoursePrice = ({course, ...props}) => {
    const {discountPrice, discountPriceString, listPrice, listPriceString} = getPriceInfo(course);
    return (
        <StaticPriceText
            discountPrice={discountPrice}
            discountPriceString={discountPriceString}
            listPrice={listPrice}
            listPriceString={listPriceString}
            {...props}
        />
    );
};

CoursePrice.propTypes = {
    course: PropTypes.object.isRequired,
};

const CourseInstructors = ({instructors}) => {
    const {ngettext} = useI18n();

    return !instructors.length ? null : (
        <div className="ud-text-xs">
            <span className="ud-sr-only">
                {ngettext('Instructor:', 'Instructors:', instructors.length)}
            </span>
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'course-card:visible-instructors',
                    html: instructors.map((instructor) => instructor.display_name).join(', '),
                })}
                className={styles['instructor-list']}
            />
        </div>
    );
};

CourseInstructors.propTypes = {
    instructors: mobxTypes.arrayOrObservableArray.isRequired,
};

export function getNumReviewsAriaLabel(numReviews, {ninterpolate}) {
    return ninterpolate('%(count)s review', '%(count)s reviews', numReviews, {
        count: numReviews,
    });
}

const CourseRatings = ({course, numReviewsText, children}) => {
    const {ninterpolate} = useI18n();
    const {formatNumber} = useFormatNumber();

    if (!course.rating && !children) {
        return null;
    }

    const numReviewsTextFinal = numReviewsText || formatNumber(course.num_reviews);
    return (
        <div className={styles.row}>
            {!!course.rating && (
                <>
                    <StarRating showNumber={true} rating={course.rating} />
                    <span
                        aria-label={getNumReviewsAriaLabel(course.num_reviews, {ninterpolate})}
                        className={classNames('ud-text-xs', styles['reviews-text'])}
                    >{`(${numReviewsTextFinal})`}</span>
                </>
            )}
            {children}
        </div>
    );
};

CourseRatings.propTypes = {
    course: PropTypes.object.isRequired,
    numReviewsText: PropTypes.string,
    children: PropTypes.node,
};

CourseRatings.defaultProps = {
    numReviewsText: undefined,
    children: null,
};

export function getNumLecturesText(numLectures, {ninterpolate}) {
    return ninterpolate('%s lecture', '%s lectures', numLectures);
}

const CourseCardBadges = ({course, children}) => {
    const badgeData = course.badges && course.badges.length > 0 && course.badges[0];
    const CourseBadgeComponent = badgeData && getCourseBadgeFromType(badgeData.badge_family);
    return CourseBadgeComponent || children ? (
        <div className={styles['course-badges']}>
            {CourseBadgeComponent && <CourseBadgeComponent />}
            {children}
        </div>
    ) : null;
};

CourseCardBadges.propTypes = {
    course: PropTypes.object.isRequired,
    children: PropTypes.node,
};

CourseCardBadges.defaultProps = {
    children: null,
};

class CourseCard extends React.Component {
    static propTypes = {
        /** See Django `CourseSerializer.DEFAULT_MERCHANDISING_FIELDS.` */
        course: PropTypes.object.isRequired,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        width: PropTypes.oneOf(['fixed', 'flexible']),
        className: PropTypes.string,
        titleClass: PropTypes.string,
        numReviewsText: PropTypes.string,
        priceProps: PropTypes.object,
        showBadges: PropTypes.bool,
        showDetails: PropTypes.bool,
        url: PropTypes.string,
        /** Customizes how the course image is rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderCourseImage: PropTypes.func,
        /** Customizes how the course instructors are rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderInstructorContent: PropTypes.func,
        /** Customizes how the course price is rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderPriceText: PropTypes.func,
        /** Customizes how the course title link is rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderCourseTitle: PropTypes.func,
        /** Customizes how the course ratings are rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderRatings: PropTypes.func,
        /** Customizes how the course details (aka metadata) are rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderDetails: PropTypes.func,
        /** Customizes how the course badges are rendered. E.g. `(Component, props) => <Component {...props} />`. */
        renderCourseBadges: PropTypes.func,
        /** Added by withUDData */
        // eslint-disable-next-line react/require-default-props
        udData: PropTypes.object,
        /** CourseCard is now wrapped in withUDData function. We need to forward ref for legacy usages. */
        forwardedRef: PropTypes.func,
        /**
         * Optional handler if user clicks on CourseCard.
         *
         * @remarks
         * This prop is added to satisfy a consumer of CourseCard in TypeScript.  It is not
         * recommended for use, as CourseCard is not an interactive element and does not have
         * the associated `role` or keyboard event handlers required for a11y.
         */
        onClick: PropTypes.func,
    };

    static defaultProps = {
        size: 'medium',
        width: 'flexible',
        className: undefined,
        titleClass: undefined,
        numReviewsText: undefined,
        priceProps: undefined,
        showBadges: true,
        showDetails: true,
        renderCourseImage: (Component, props) => <Component {...props} />,
        renderInstructorContent: (Component, props) => <Component {...props} />,
        renderPriceText: (Component, props) => <Component {...props} />,
        renderCourseTitle: (Component, props) => <Component {...props} />,
        renderRatings: (Component, props) => <Component {...props} />,
        renderDetails: (Component, props) => <Component {...props} />,
        renderCourseBadges: (Component, props) => <Component {...props} />,
        url: undefined,
        forwardedRef: undefined,
        onClick: undefined,
    };

    static nonHtmlProps = [
        'course',
        'size',
        'width',
        'className',
        'titleClass',
        'numReviewsText',
        'priceProps',
        'showBadges',
        'showDetails',
        'url',
        'renderCourseImage',
        'renderInstructorContent',
        'renderPriceText',
        'renderCourseTitle',
        'renderRatings',
        'renderDetails',
        'renderCourseBadges',
        'udData',
        'forwardedRef',
        'onClick',
    ];

    render() {
        const {
            course,
            size,
            width,
            url,
            numReviewsText,
            forwardedRef,
            onClick,
            udData,
        } = this.props;
        const htmlProps = {onClick};
        Object.entries(this.props).forEach(([k, v]) => {
            if (!CourseCard.nonHtmlProps.includes(k)) {
                htmlProps[k] = v;
            }
        });

        let courseBadges, priceText;
        if (!udData.Config.brand.has_organization) {
            courseBadges =
                this.props.showBadges &&
                this.props.renderCourseBadges(CourseCardBadges, {
                    course,
                });
            priceText = this.props.renderPriceText(CoursePrice, {
                course,
                className: styles['price-text-container'],
                listPriceClassName: styles['list-price'],
                discountPriceClassName: styles['discount-price'],
                trackingEventContext: {
                    buyableId: course.id,
                    priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                    buyableType: 'course',
                    buyableTrackingId: course.frontendTrackingId || course.tracking_id,
                },
                ...this.props.priceProps,
            });
        }

        return (
            <div
                {...htmlProps}
                className={classNames(
                    styles.container,
                    styles[size],
                    {[styles.fixed]: width === 'fixed'},
                    this.props.className,
                )}
                data-purpose="container"
                ref={forwardedRef}
            >
                <div className={styles['image-wrapper']}>
                    {this.props.renderCourseImage(CourseImage, {
                        course,
                        size,
                        className: styles['course-image'],
                    })}
                </div>
                <div
                    className={classNames(styles['main-content'], {
                        [styles['has-price-text']]: !!priceText,
                    })}
                >
                    <h3
                        data-purpose="course-title-url"
                        className={classNames(
                            this.props.titleClass,
                            size === 'small' ? 'ud-heading-sm' : 'ud-heading-md',
                            styles['course-title'],
                        )}
                    >
                        {this.props.renderCourseTitle(url ? 'a' : 'span', {
                            href: url,
                            children: course.title,
                        })}
                    </h3>
                    {this.props.showDetails && size === 'large' && course.headline && (
                        <p
                            className={classNames('ud-text-sm', styles['course-headline'])}
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'course-card:course-headline',
                                html: course.headline,
                            })}
                        />
                    )}
                    {this.props.renderInstructorContent(CourseInstructors, {
                        instructors: course.visible_instructors || [],
                        instructorName: course.instructor_name,
                    })}
                    {this.props.renderRatings(CourseRatings, {
                        course,
                        numReviewsText,
                    })}
                    {this.props.showDetails &&
                        this.props.renderDetails(CourseCardDetails, {
                            metadata: getDefaultCourseCardMetadata(course),
                        })}
                    {priceText}
                    {courseBadges}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const ExportedCourseCard = withUDData(CourseCard);

export default Object.assign(
    React.forwardRef((props, ref) => {
        return <ExportedCourseCard {...props} forwardedRef={ref} />;
    }),
    {
        propTypes: CourseCard.propTypes,
        defaultProps: CourseCard.defaultProps,
    },
);
