import hoistStatics from 'hoist-non-react-statics';
import {observer} from 'mobx-react';
import React from 'react';

import {PriceTextProps} from '@udemy/react-merchandising-components';
import {getDisplayName} from '@udemy/shared-utils';
import {PriceImpressionEventContext} from '@udemy/shopping';
import {withStores, WithStoresProps} from '@udemy/store-provider';

import {
    AsyncCoursePrice,
    CoursePriceStore,
    PriceStatus,
    PriceStoreCourse,
} from './course-price-store';
import {ErrorComponentProps, LoaderComponentProps} from './with-course-price-store';

export interface AsyncCoursesPriceTextProps {
    className?: string;
    courses: PriceStoreCourse[];
    loaderProps?: LoaderComponentProps;
}

// Props injected by the HOC into the wrapped component
type InjectedProps = Pick<PriceTextProps, 'listPrice' | 'discountPrice'>;

// Props to constrain those required of the wrapped component by the HOC
type LocalTrackingEventContext = Pick<PriceImpressionEventContext, 'priceServeTrackingId'>;

type LocalPriceTextProps<TTrackingEventContext extends LocalTrackingEventContext> = Pick<
    PriceTextProps,
    'discountPrice' | 'discountPriceString' | 'listPrice' | 'listPriceString'
> & {
    trackingEventContext?: TTrackingEventContext;
};

/**
 * Props for the WithCoursePriceStore higher-order component.
 *
 * @privateRemarks
 *
 * The HOC will inject the props in InjectedProps into the wrapped component, so
 * we mark them as optional for external consumers.
 */
export type WithCoursePriceStoreProps<TWrappedPriceTextProps> = Omit<
    AsyncCoursesPriceTextProps & TWrappedPriceTextProps,
    keyof InjectedProps
> &
    Partial<InjectedProps>;

export function withCoursePriceStoreBase(
    LoadingComponent: React.ComponentType<LoaderComponentProps>,
    ErrorComponent: React.ComponentType<ErrorComponentProps>,
) {
    return function withDeferredCoursePrice<
        TWrappedPriceTextProps extends LocalPriceTextProps<
            TWrappedPriceTextProps['trackingEventContext']
        >,
    >(WrappedPriceText: React.ComponentType<TWrappedPriceTextProps>) {
        type InternalAsyncPriceTextProps = AsyncCoursesPriceTextProps &
            TWrappedPriceTextProps &
            WithStoresProps;

        class InternalAsyncPriceText extends React.Component<InternalAsyncPriceTextProps> {
            static defaultProps = {
                courses: [],
                className: '',
                loaderProps: {},
            };

            static displayName = `WithCourse${getDisplayName(WrappedPriceText)}`;

            constructor(props: InternalAsyncPriceTextProps) {
                super(props);
                this.coursePriceStore = props.stores[0];
                props.courses.forEach((course) => this.registerCourse(course));
            }

            readonly coursePriceStore: CoursePriceStore;

            registerCourse(course: PriceStoreCourse) {
                if (course.price) {
                    this.coursePriceStore.registerCourse(course, {
                        price: course.price,
                        price_detail: course.price_detail,
                        discount: course.discount,
                        discount_price: course.discount_price,
                    });
                } else {
                    this.coursePriceStore.registerCourse(course);
                }
            }

            getPriceAmountsFromCoursePrice(coursePrice?: AsyncCoursePrice) {
                const courseListPrice = coursePrice?.price_detail
                    ? coursePrice.price_detail.amount
                    : 0;
                const courseDiscountPrice = coursePrice?.discount?.price
                    ? coursePrice.discount.price.amount
                    : 0;
                return {courseListPrice, courseDiscountPrice};
            }

            getPriceStringsFromCoursePrice(coursePrice?: AsyncCoursePrice) {
                const courseListPriceString = coursePrice?.price_detail
                    ? coursePrice.price_detail.price_string
                    : undefined;
                const courseDiscountPriceString = coursePrice?.discount?.price
                    ? coursePrice.discount.price.price_string
                    : undefined;
                return {courseListPriceString, courseDiscountPriceString};
            }

            render() {
                const {courses, loaderProps, ...restOfProps} = this.props;
                const hasError = courses.some((course) => {
                    return (
                        this.coursePriceStore.priceMap.get(course.id)?.status ===
                        PriceStatus.PRICE_STATUS_ERROR
                    );
                });

                if (hasError) {
                    return <ErrorComponent className={this.props.className} />;
                }

                const isLoading = courses.some((course) => {
                    return (
                        this.coursePriceStore.priceMap.get(course.id)?.status ===
                        PriceStatus.PRICE_STATUS_LOADING
                    );
                });

                if (isLoading) {
                    return <LoadingComponent {...loaderProps} className={this.props.className} />;
                }

                let listPrice = 0;
                let discountPrice = 0;
                courses.forEach((course) => {
                    // Cast to CoursePrice after checking for loading state
                    const currentCoursePrice = this.coursePriceStore.priceMap.get(
                        course.id,
                    ) as AsyncCoursePrice;
                    const {courseListPrice, courseDiscountPrice} =
                        this.getPriceAmountsFromCoursePrice(currentCoursePrice);
                    listPrice += courseListPrice ?? 0;
                    if (courseDiscountPrice) {
                        discountPrice += courseDiscountPrice;
                    } else {
                        discountPrice += courseListPrice ?? 0;
                    }
                });

                const priceTextProps: LocalPriceTextProps<LocalTrackingEventContext> = {
                    listPrice,
                    discountPrice,
                };
                if (courses.length === 1) {
                    const coursePrice = this.coursePriceStore.priceMap.get(courses[0].id);
                    const {courseListPriceString, courseDiscountPriceString} =
                        this.getPriceStringsFromCoursePrice(coursePrice);
                    priceTextProps.listPriceString = courseListPriceString;
                    priceTextProps.discountPriceString =
                        courseDiscountPriceString || courseListPriceString;
                    const loadedCoursePrice = coursePrice as AsyncCoursePrice;
                    priceTextProps.trackingEventContext = loadedCoursePrice?.price_serve_tracking_id
                        ? {
                              priceServeTrackingId: loadedCoursePrice?.price_serve_tracking_id,
                          }
                        : undefined;
                }

                return (
                    <WrappedPriceText
                        courses={courses}
                        {...priceTextProps}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        {...(restOfProps as any)}
                    />
                );
            }
        }

        const AsyncPriceText = withStores([CoursePriceStore], observer(InternalAsyncPriceText));

        return hoistStatics(AsyncPriceText, WrappedPriceText) as unknown as React.ComponentType<
            WithCoursePriceStoreProps<TWrappedPriceTextProps>
        >;
    };
}
