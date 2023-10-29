import {useUDData} from '@udemy/ud-data';
import React, {ComponentType, forwardRef, PropsWithChildren} from 'react';

/**
 * Higher-order component that plucks out `CourseCard` props for slots that
 * we do not render when in a UB context.
 *
 * @param CourseCardComponent - card component to wrap
 * @returns a component that renders `CardComponent`
 *
 * @example
 * ```tsx
 * const MyCardComponent = withCourseCardUBGuard(CourseCard);
 *
 * <MyCourseCard title="..." image={...} badges={...} />
 * ```
 */
export const withCourseCardUBGuard = <
    CourseCardProps extends PropsWithChildren<
        Pick<CourseCardProps, 'badges' | 'badgesProps' | 'price' | 'priceProps'>
    >,
>(
    CourseCardComponent: ComponentType<CourseCardProps>,
) => {
    const displayName = CourseCardComponent.displayName ?? CourseCardComponent.name ?? 'Component';

    return Object.assign(
        forwardRef<HTMLDivElement, CourseCardProps>(
            (
                {children, badges, badgesProps, price, priceProps, ...props}: CourseCardProps,
                ref,
            ) => {
                // Pluck out badges and price from the card if in UB context
                const {Config: udConfig} = useUDData();
                const isUB = !!udConfig.brand.has_organization;
                const guardedProps = {
                    ...props,
                    ...(isUB ? {} : {badges, badgesProps, priceProps, price}),
                } as CourseCardProps;

                return (
                    <CourseCardComponent ref={ref} {...guardedProps}>
                        {children}
                    </CourseCardComponent>
                );
            },
        ),
        {displayName: `withCourseCardUBGuard(${displayName})`},
    );
};
