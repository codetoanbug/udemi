import {Skeleton, Block} from '@udemy/react-reveal-components';
import React from 'react';

import './secondary-call-to-action-section-skeleton.less';

export const SecondaryCallToActionSectionSkeleton = () => {
    return (
        <div styleName="wrapper">
            <Skeleton styleName="cta">
                <Block />
            </Skeleton>
            <Skeleton styleName="cta">
                <Block />
            </Skeleton>
        </div>
    );
};
