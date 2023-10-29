import {ClientSideRender} from '@udemy/design-system-utils';
import {observer} from 'mobx-react';
import React from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {EnableCouponInputModeButton} from 'cart/components/redeem-coupon/redeem-coupon.react-component';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import {_GiftThisCourse as GiftThisCourse} from 'course-landing-page/components/gift-this-course/gift-this-course.react-component';
import {CouponStore} from 'course-landing-page/components/redeem-coupon/coupon.mobx-store';
import {RedeemCoupon} from 'course-landing-page/components/redeem-coupon/redeem-coupon.react-component';
import {useFeature} from 'course-landing-page/feature-context';

import PurchaseSectionSocialShare from '../components/purchase-section-social-share.react-component';
import styles from './generic-purchase-section.less';
import {SecondaryCallToActionSectionSkeleton} from './secondary-call-to-action-section-skeleton.react-component';

export interface SecondaryCallToActionSectionProps {
    couponStore: CouponStore;
    course: {
        id: number;
        url: string;
    };
    giftCourseStore: GiftCourseStore;
    giftThisCourse: {
        gift_this_course_link: string;
    };
    isPaid: boolean;
    uiRegion: string;
}

export const SecondaryCallToActionSection = observer(
    ({
        couponStore,
        course,
        giftCourseStore,
        giftThisCourse,
        isPaid,
        uiRegion,
    }: SecondaryCallToActionSectionProps) => {
        const showShareLinkCta = useFeature('showShareLinkCta')?.enabled ?? false;
        return (
            <ClientSideRender
                placeholder={<SecondaryCallToActionSectionSkeleton />}
                uiRegion={UI_REGION.COURSE_ACTIONS}
            >
                <div className={styles.cta}>
                    <div className={styles['cta-multiple']}>
                        {showShareLinkCta && (
                            <PurchaseSectionSocialShare
                                course={course}
                                buttonStyle="ghost"
                                className="ud-link-underline ud-link-neutral"
                                isIconVisible={false}
                                fullWidth={false}
                            />
                        )}
                        {Boolean(giftThisCourse) && (
                            <GiftThisCourse
                                componentContext={giftThisCourse}
                                giftCourseStore={giftCourseStore}
                                buttonProps={{
                                    udStyle: 'ghost',
                                    className: 'ud-link-underline ud-link-neutral',
                                }}
                                uiRegion={`${uiRegion}.${UI_REGION.COURSE_ACTIONS}`}
                            />
                        )}
                        {couponStore && (
                            <EnableCouponInputModeButton
                                onClick={couponStore.enterInputMode}
                                buttonProps={{
                                    udStyle: 'ghost',
                                    className: 'ud-link-underline ud-link-neutral',
                                }}
                            />
                        )}
                    </div>
                    {couponStore && (
                        <RedeemCoupon
                            couponStore={couponStore}
                            is_paid={isPaid}
                            enableCouponInputModeButtonProps={{
                                udStyle: 'ghost',
                                className: 'ud-link-underline ud-link-neutral',
                            }}
                            showCouponInputModeButton={false}
                            showTitle={false}
                            showStackableCoupons={false}
                        />
                    )}
                </div>
            </ClientSideRender>
        );
    },
);
