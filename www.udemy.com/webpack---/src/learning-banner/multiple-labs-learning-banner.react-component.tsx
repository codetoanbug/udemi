import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import {LabIcon} from '../card-components/lab-icon.react-component';
import {LAB_LANDING_PAGE_URL} from '../constants';
import {LabsLearningBannerProps} from '../types/labs';
import {sendReviewLabsBannerSelectedEvent, sendReviewLabsBannerDismissedEvent} from './events';
import styles from './labs-learning-banner.module.less';

const MultipleLabsLearningBannerComponent = function (props: LabsLearningBannerProps) {
    const {gettext} = useI18n();
    const {store} = props;
    const redirectUrl =
        window.location.pathname === LAB_LANDING_PAGE_URL ? undefined : LAB_LANDING_PAGE_URL;

    async function onDismiss() {
        await store.setDismissed();
    }

    return (
        <section aria-labelledby="labs-learning-banner" data-testid="multiple-labs-learning-banner">
            <div className={styles['container']}>
                <LabIcon />
                <div className={styles['text-container']}>
                    <div className="ud-heading-md">
                        <h2 id="multiple-labs-learning-banner">
                            {gettext('You still have time to pick up where you left off.')}
                        </h2>
                    </div>

                    <div className="ud-text-md">
                        {gettext(
                            "Take a moment to review and keep making progress on the labs you've started.",
                        )}
                    </div>
                </div>
                <div className={styles['action-buttons']}>
                    <Button
                        data-purpose="multiple-lab-banner-dismiss"
                        onClick={async () => {
                            await onDismiss();
                            sendReviewLabsBannerDismissedEvent(true);
                        }}
                        size="medium"
                        udStyle="ghost"
                        className={classNames('ud-link-neutral', styles['button'])}
                    >
                        {gettext('Dismiss')}
                    </Button>
                    <Button
                        data-purpose="multiple-lab-banner-continue"
                        onClick={() => {
                            sendReviewLabsBannerSelectedEvent();
                            onDismiss();
                        }}
                        udStyle="primary"
                        size="medium"
                        componentClass="a"
                        href={redirectUrl}
                    >
                        {gettext('Review labs')}
                    </Button>
                </div>
            </div>
        </section>
    );
};

MultipleLabsLearningBannerComponent.displayName = 'MultipleLabsLearningBanner';
export const MultipleLabsLearningBanner = observer(MultipleLabsLearningBannerComponent);
