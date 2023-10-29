import {useMatchMedia} from '@udemy/hooks';
import React from 'react';

import {CarouselProps} from 'base-components/carousel/carousel.react-component';
import {
    Instructor,
    InstructorCardProps,
} from 'browse/components/instructor-card/instructor-card.react-component';

import PopularInstructorsUnitDesktop from './popular-instructors-unit-desktop.react-component';
import PopularInstructorsUnitMobile from './popular-instructors-unit-mobile.react-component';

interface PopularInstructorsUnitProps {
    titleId?: string;
    className?: string;
    onLoad?: () => void;
    unit: {
        title: string;
        items: Instructor[];
    };
    carouselProps?: CarouselProps;
    cardProps?: InstructorCardProps;
    showTitle?: boolean;
    alternateHeadline?: {
        title: string;
        secondaryText?: string;
    };
    componentName: string;
}

export const PopularInstructorsUnit = (props: PopularInstructorsUnitProps) => {
    const isMobileMax = useMatchMedia('mobile-max');

    if (isMobileMax === null || isMobileMax) {
        return <PopularInstructorsUnitMobile {...props} />;
    }
    return <PopularInstructorsUnitDesktop {...props} />;
};
