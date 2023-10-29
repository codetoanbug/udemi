import {action, observable} from 'mobx';

import {IncentivesData} from 'course-landing-page/components/incentives/incentives.react-component';
import {
    AddToCartContext,
    CurriculumContext,
    DealBadgeContext,
    BasePurchaseSectionContext,
    DiscountExpirationContext,
    GiftThisCourseContext,
    PriceTextContext,
    PurchaseTabsContext,
    RedeemCouponContext,
    LifetimeAccessContext,
    PurchaseInfoContext,
    PurchaseSectionContext,
} from 'course-landing-page/types/clc-contexts';

export class CourseLandingPageStore {
    @observable incentivesData?: IncentivesData;
    @observable curriculum?: CurriculumContext;
    @observable addToCartData?: AddToCartContext;
    @observable purchaseBodyComponentProps?: {
        addToCart?: AddToCartContext;
        basePurchaseSection?: BasePurchaseSectionContext;
        dealBadge?: DealBadgeContext;
        discountExpiration?: DiscountExpirationContext;
        giftThisCourse?: GiftThisCourseContext;
        lifetimeAccessContext?: LifetimeAccessContext;
        priceText?: PriceTextContext;
        purchaseTabsContext?: PurchaseTabsContext;
        purchaseInfo?: PurchaseInfoContext;
        purchaseSection?: PurchaseSectionContext;
        redeemCoupon?: RedeemCouponContext;
        incentives?: IncentivesData;
    };

    @observable isLoading = true;

    @action
    setIncentivesData(incentivesData?: IncentivesData) {
        this.incentivesData = incentivesData;
    }

    @action
    setCurriculum(curriculum?: CurriculumContext) {
        this.curriculum = curriculum;
    }

    @action
    setAddToCartData(addToCartData?: AddToCartContext) {
        this.addToCartData = addToCartData;
    }

    @action
    setPurchaseBodyComponentProps(componentProps?: typeof this.purchaseBodyComponentProps) {
        this.purchaseBodyComponentProps = componentProps;
    }

    @action
    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
