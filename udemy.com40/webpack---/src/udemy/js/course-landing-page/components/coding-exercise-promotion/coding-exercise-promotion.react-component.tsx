import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {LearningProduct} from 'browse/events';
import {
    CodingExercisePromotionImpressionEvent,
    CodingExercisePromotionImageClickEvent,
} from 'course-landing-page/components/coding-exercise-promotion/events';

import {
    CodingExerciseModalContainer as CodingExerciseModal,
    CodingExerciseModalContainerProps,
} from './coding-exercise-promotion-modal.react-component';
import styles from './coding-exercise-promotion.less';

export const enum CodingExercisePromotionLayouts {
    VERTICAL = 'VERTICAL',
    HORIZONTAL = 'HORIZONTAL',
}

interface CodingExerciseContainerProps {
    layout: CodingExercisePromotionLayouts;
    learningProduct: LearningProduct;
    imageSrc: string;
    shouldEnablePopupVideo?: boolean;
    shouldUseFullbleed?: boolean;
    fullbleedAmount?: string;
    shouldUseFullPageModal?: boolean;
}

export type CodingExercisePromotionProps = CodingExerciseContainerProps &
    Omit<CodingExerciseModalContainerProps, 'shouldUseFullPageModal'>;

export const CodingExercisePromotion = ({
    layout,
    learningProduct,
    imageSrc,
    shouldEnablePopupVideo = false,
    shouldUseFullbleed = false,
    shouldUseFullPageModal: shouldUseFpm = undefined,
    fullbleedAmount = undefined,
    ...restOfProps
}: CodingExercisePromotionProps) => {
    const {gettext} = useI18n();
    const isMobileMax = useMatchMedia('mobile-max');
    const fullbleedStyles =
        shouldUseFullbleed && !!fullbleedAmount ? {margin: `0 -${fullbleedAmount}`} : {};

    const containerProps = {
        className: classNames(styles['coding-exercise-container'], {
            [styles['coding-exercise-container-horizontal']]:
                layout === CodingExercisePromotionLayouts.HORIZONTAL,
        }),
        style: fullbleedStyles,
    };

    let shouldUseFullPageModal = true;
    if (shouldUseFpm === undefined && isMobileMax !== null) {
        shouldUseFullPageModal = isMobileMax;
    }

    const trackCodingExerciseImpression = () => {
        Tracker.publishEvent(new CodingExercisePromotionImpressionEvent(learningProduct));
    };

    const trackCodingExerciseImageInterestClick = () => {
        Tracker.publishEvent(new CodingExercisePromotionImageClickEvent(learningProduct));
    };

    return (
        <TrackImpression trackFunc={() => trackCodingExerciseImpression()}>
            <div {...containerProps}>
                <div className={styles['coding-exercise-content']}>
                    <h2 className="ud-heading-xl">{gettext('Coding Exercises')}</h2>
                    <p className={classNames('ud-text-sm', styles['coding-exercise-description'])}>
                        {gettext(
                            'This course includes our updated coding exercises so you can practice your skills as you learn.',
                        )}
                    </p>
                    {shouldEnablePopupVideo && (
                        <CodingExerciseModal
                            {...restOfProps}
                            learningProduct={learningProduct}
                            shouldUseFullPageModal={shouldUseFullPageModal}
                        />
                    )}
                </div>
                <div className={styles['coding-exercise-image-container']}>
                    <Image
                        role="button"
                        aria-label={gettext(
                            'This image is also treated as a button to track image enlargement interest',
                        )}
                        alt={gettext('Image of coding exercise example')}
                        src={imageSrc}
                        lazy={true}
                        onClick={() => {
                            trackCodingExerciseImageInterestClick();
                        }}
                    />
                </div>
            </div>
        </TrackImpression>
    );
};
