import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import {LabIcon} from '../card-components/lab-icon.react-component';
import {LabInstanceApiResponse, LabsLearningBannerProps} from '../types/labs';
import {LAB_RESUME_BANNER_REDIRECT_QUERY_PARAM} from './constants';
import {
    sendLabsResumeBannerContinueClickEvent,
    sendLabsResumeBannerDismissClickEvent,
    sendReviewLabsBannerDismissedEvent,
} from './events';
import styles from './labs-learning-banner.module.less';
import {LabsLearningDismissModal} from './labs-learning-dismiss-modal.react-component';

const SingleLabsLearningBannerComponent = function (props: LabsLearningBannerProps) {
    const {gettext, interpolate} = useI18n();
    const {store} = props;
    const redirectUrl = `${store.continueLabPageUrl}?${LAB_RESUME_BANNER_REDIRECT_QUERY_PARAM}`;

    async function onDismiss() {
        await store.setDismissed();
        sendReviewLabsBannerDismissedEvent(false);
        store.showDismissModal();
        sendLabsResumeBannerDismissClickEvent(store.firstRunningLab as LabInstanceApiResponse);
    }

    async function onContinue() {
        sendLabsResumeBannerContinueClickEvent(store.firstRunningLab as LabInstanceApiResponse);
    }

    return (
        <>
            {!store.isDismissed && (
                <section aria-labelledby="labs-learning-banner" data-testid="labs-learning-banner">
                    <div className={styles['container']}>
                        <LabIcon />
                        <div className={styles['text-container']}>
                            <div className="ud-heading-md">
                                <h2 id="labs-learning-banner">
                                    {gettext(
                                        'There’s still time for you to continue your lab from where you left off.',
                                    )}
                                </h2>
                            </div>

                            <div className="ud-text-md">
                                {interpolate(
                                    gettext('%(labTitle)s is still in-progress.'),
                                    {labTitle: store.firstRunningLab?.lab.title},
                                    true,
                                )}
                            </div>
                        </div>
                        <div className={styles['action-buttons']}>
                            <Button
                                data-purpose="lab-banner-dismiss"
                                onClick={onDismiss}
                                size="medium"
                                udStyle="ghost"
                                className={classNames('ud-link-neutral', styles['button'])}
                            >
                                {gettext('Dismiss')}
                            </Button>
                            <Button
                                data-purpose="lab-banner-continue"
                                onClick={onContinue}
                                udStyle="primary"
                                size="medium"
                                componentClass="a"
                                href={redirectUrl}
                            >
                                {gettext('Continue lab')}
                            </Button>
                        </div>
                    </div>
                </section>
            )}
            <LabsLearningDismissModal
                isOpen={store.isDismissModalActive}
                labsLearningBannerStore={store}
            />
        </>
    );
};

SingleLabsLearningBannerComponent.displayName = 'SingleLabsLearningBanner';
export const SingleLabsLearningBanner = observer(SingleLabsLearningBannerComponent);
