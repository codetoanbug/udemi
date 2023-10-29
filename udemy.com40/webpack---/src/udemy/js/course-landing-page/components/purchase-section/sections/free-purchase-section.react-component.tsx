import {observer} from 'mobx-react';
import React from 'react';

import {BuyBox} from 'course-landing-page/components/buy-box/buy-box.react-component';

import PurchaseSectionSocialShare from '../components/purchase-section-social-share.react-component';

import './generic-purchase-section.less';

interface FreePurchaseSectionProps {
    componentProps: {
        purchaseInfo: {
            isValidStudent: boolean;
            purchaseDate: string | null;
        };
    };
    course: {
        id: number;
        url: string;
    };
}

export const FreePurchaseSection = observer(
    ({course, ...passthroughProps}: FreePurchaseSectionProps) => {
        return (
            <div styleName="main-cta-container free-course" data-purpose="purchase-section">
                <div styleName="buy-box-main">
                    <BuyBox {...passthroughProps} />
                </div>
                <PurchaseSectionSocialShare course={course} styleName="cta cta-share" />
            </div>
        );
    },
);
