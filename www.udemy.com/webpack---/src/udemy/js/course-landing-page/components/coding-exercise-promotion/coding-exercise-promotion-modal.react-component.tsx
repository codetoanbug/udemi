import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {ModalTrigger, Modal, ModalProps} from '@udemy/react-dialog-components';
import classNames from 'classnames';
import React from 'react';

import {LearningProduct} from 'browse/events';
import {
    CodingExercisePromotionSeeDemoLinkClickEvent,
    CodingExercisePromotionDemoVideoImpressionEvent,
} from 'course-landing-page/components/coding-exercise-promotion/events';

import styles from './coding-exercise-promotion.less';
import {CodingExerciseVideoPlayer} from './coding-exercise-video-player.react-component';

interface CodingExerciseModalContentContainerProps {
    learningProduct: LearningProduct;
    shouldUseFullPageModal: boolean;
    ctaText?: string;
}
export type CodingExerciseModalContainerProps = CodingExerciseModalContentContainerProps &
    Omit<CodingExerciseModalProps, 'isOpen'>;
export const CodingExerciseModalContainer = ({
    learningProduct,
    shouldUseFullPageModal,
    ctaText = gettext('See a demo'),
    ...restOfProps
}: CodingExerciseModalContainerProps) => {
    const trackCodingExerciseSeeDemoLinkClick = () => {
        Tracker.publishEvent(new CodingExercisePromotionSeeDemoLinkClickEvent(learningProduct));
    };

    return (
        <ModalTrigger
            trigger={
                <Button
                    componentClass="a"
                    udStyle="link-underline"
                    typography="ud-text-sm"
                    className={classNames(styles['coding-exercise-modal-trigger'])}
                    onClick={() => {
                        trackCodingExerciseSeeDemoLinkClick();
                    }}
                >
                    {ctaText}
                </Button>
            }
            renderModal={(modalProps) => (
                <CodingExerciseModal
                    {...modalProps}
                    {...restOfProps}
                    learningProduct={learningProduct}
                    fullPage={shouldUseFullPageModal}
                />
            )}
        />
    );
};

interface CodingExerciseModalContentProps {
    learningProduct: LearningProduct;
    assetTitle: string;
    assetId: number;
    className?: string;
    playerOptions?: Record<string, unknown>; // 2023-03-08 CP - video-player has not been migrated to typescript yet
}

export type CodingExerciseModalProps = CodingExerciseModalContentProps & Omit<ModalProps, 'title'>;

export const CodingExerciseModal = ({
    learningProduct,
    assetTitle = 'Video',
    assetId,
    className,
    playerOptions = {
        isDefaultPlaying: true,
    },
    ...restOfProps
}: CodingExerciseModalProps) => {
    const trackCodingExerciseDemoVideoImpression = () => {
        Tracker.publishEvent(new CodingExercisePromotionDemoVideoImpressionEvent(learningProduct));
    };

    return (
        <Modal
            title={assetTitle}
            {...restOfProps}
            className={classNames(styles['coding-exercise-modal-container'], className)}
        >
            <TrackImpression trackFunc={() => trackCodingExerciseDemoVideoImpression()}>
                <div className={styles['coding-exercise-video-container']}>
                    <CodingExerciseVideoPlayer id={assetId} playerOptions={playerOptions} />
                </div>
            </TrackImpression>
        </Modal>
    );
};
