import {TextSkeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React from 'react';

import styles from './review.less';

interface ReviewSkeletonProps {
    className?: string;
    isDesktopLayout?: boolean;
    inlineLayout?: boolean;
}

const MOBILE_MAX_LINES_IN_REVIEW = 8;
const DESKTOP_MAX_LINES_IN_REVIEW = 5;
export const ReviewSkeleton = ({
    className,
    isDesktopLayout = false,
    inlineLayout = false,
}: ReviewSkeletonProps) => {
    return (
        <div
            className={classNames(styles['review-container'], className ?? null, {
                [styles['review-desktop-container']]: isDesktopLayout,
                [styles['review-desktop-inline']]: isDesktopLayout && inlineLayout,
            })}
        >
            <TextSkeleton
                withTitle={true}
                lineCountPerParagraph={
                    isDesktopLayout ? DESKTOP_MAX_LINES_IN_REVIEW : MOBILE_MAX_LINES_IN_REVIEW
                }
            />
        </div>
    );
};
