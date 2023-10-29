import {Skeleton, TextSkeleton, Block} from '@udemy/react-reveal-components';
import React from 'react';

import './purchase-section-container-skeleton.less';

interface PurchaseSectionContainerSkeletonProps {
    hasIncentives?: boolean;
    className?: string;
}

export const PriceSkeleton = () => {
    return (
        <Skeleton styleName="price skeleton">
            <TextSkeleton lineCountPerParagraph={2} />
        </Skeleton>
    );
};

export const PurchaseSectionContainerSkeleton = ({
    hasIncentives = true,
    className = undefined,
}: PurchaseSectionContainerSkeletonProps) => {
    return (
        <div className={className}>
            <PriceSkeleton />
            <Skeleton styleName="cta skeleton">
                <Block />
            </Skeleton>
            <Skeleton styleName="money-back skeleton">
                <Block />
            </Skeleton>
            {hasIncentives && (
                <Skeleton styleName="incentives">
                    <TextSkeleton withTitle={true} lineCountPerParagraph={7} />
                </Skeleton>
            )}
        </div>
    );
};
