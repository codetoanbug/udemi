import {ClientEvent, Tracker, TrackImpression} from '@udemy/event-tracking';
import {Skeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React, {ReactNode} from 'react';

import styles from './cta-container.less';

export interface CTAContainerProps {
    children?: ReactNode;
    subtitle?: ReactNode;
    impressionEvent?: () => ClientEvent;
    className?: string;
    subtitleClassName?: string;
    showSubtitle?: boolean;
    skeletonChildren?: ReactNode;
    isLoading?: boolean;
}

interface CTAContainerSkeletonProps {
    children?: ReactNode;
    className?: string;
}

export const CTAContainerSkeleton = ({className, children}: CTAContainerSkeletonProps) => {
    return (
        <Skeleton className={classNames(styles.container, className)} data-testid="skeleton">
            {children}
        </Skeleton>
    );
};

export const CTAContainer = ({
    children,
    subtitle,
    impressionEvent,
    className,
    subtitleClassName,
    showSubtitle = true,
    skeletonChildren,
    isLoading,
}: CTAContainerProps) => {
    if (isLoading) {
        return (
            <CTAContainerSkeleton className={className}>{skeletonChildren}</CTAContainerSkeleton>
        );
    }

    const main = (
        <div className={classNames(styles.container, className)}>
            {children}
            {showSubtitle && (
                <div className={classNames(styles.subtitle, subtitleClassName)}>{subtitle}</div>
            )}
        </div>
    );

    if (impressionEvent) {
        return (
            <TrackImpression
                onlyOnce={true}
                trackFunc={() => Tracker.publishEvent(impressionEvent())}
            >
                {main}
            </TrackImpression>
        );
    }

    return main;
};
