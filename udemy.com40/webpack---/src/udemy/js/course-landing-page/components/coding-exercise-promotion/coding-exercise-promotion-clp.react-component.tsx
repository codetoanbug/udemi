import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {UDDataRequest, useUDData, withUDData} from '@udemy/ud-data';
import React from 'react';

import {LearningProduct, LearningProductType} from 'browse/events';
import clpTokens from 'course-landing-page/tokens';

import desktopPreviewImg from './assets/coding-exercises-demo-preview-desktop.png';
import mobilePreviewImg from './assets/coding-exercises-demo-preview-mobile.png';
import {
    CodingExercisePromotionLayouts,
    CodingExercisePromotion,
} from './coding-exercise-promotion.react-component';

interface CodingExercisePromotionCLPProps {
    courseId: number;
    udDataRequest: UDDataRequest;
    courseTrackingId?: string;
    shouldEnablePopupVideo?: boolean;
}

const CodingExercisePromotionCLPInternal: React.FC<CodingExercisePromotionCLPProps> = ({
    courseId,
    courseTrackingId = '',
    shouldEnablePopupVideo = false,
}) => {
    const {gettext} = useI18n();
    const {request: udDataRequest} = useUDData();
    const isMobileMax = useMatchMedia('mobile-max');
    const isSmMax = useMatchMedia('sm-max');

    const playerOptions = {
        isDefaultPlaying: true,
        isDefaultCaptionOn: udDataRequest.language !== 'en',
    };
    const fullbleedSpacing = `${clpTokens['space-paid-clp-content-spacing']}`;

    const layout = isMobileMax
        ? CodingExercisePromotionLayouts.VERTICAL
        : CodingExercisePromotionLayouts.HORIZONTAL;

    const previewImage = isMobileMax ? mobilePreviewImg : desktopPreviewImg;
    const learningProduct: LearningProduct = {
        id: courseId,
        trackingId: courseTrackingId,
        type: LearningProductType.COURSE,
    };
    return (
        <CodingExercisePromotion
            layout={layout}
            learningProduct={learningProduct}
            shouldEnablePopupVideo={shouldEnablePopupVideo}
            shouldUseFullbleed={!!isSmMax && !!fullbleedSpacing}
            fullbleedAmount={fullbleedSpacing}
            assetTitle={gettext('Coding Exercises Demo')}
            assetId={48073474}
            imageSrc={previewImage}
            playerOptions={playerOptions}
        />
    );
};

export const CodingExercisePromotionCLP = withUDData(CodingExercisePromotionCLPInternal);
