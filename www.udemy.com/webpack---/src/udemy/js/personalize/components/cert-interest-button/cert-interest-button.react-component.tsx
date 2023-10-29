import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import PlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AlertBannerProps, ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';

import {
    CertificationInterestsSavedEvent,
    ViewCertificationInterestsSelected,
} from 'personalize/events';
import serverOrClient from 'utils/server-or-client';

import styles from './cert-interest-button.less';
import {CertInterestButtonStore} from './cert-interest-button.mobx-store';

interface CertInterestButtonProps {
    courseTopicId?: number;
}

export const CertInterestButton = observer((props: CertInterestButtonProps) => {
    const {courseTopicId} = props;
    const {gettext} = useI18n();
    const isMounted = useRef(true);
    const [certInterestButtonStore] = React.useState(() => new CertInterestButtonStore());
    const [hasCertInterest, setHasCertInterest] = useState(false);

    const trackSelectionAndRedirect = () => {
        Tracker.publishEvent(new ViewCertificationInterestsSelected());

        const window = serverOrClient.global as Window;
        window.location.href = '/personalize/certifications';
    };

    const showSuccessToast = () => {
        const bannerProps: AlertBannerProps = {
            udStyle: 'success',
            title: hasCertInterest
                ? gettext('Removed from your interests')
                : gettext('Added to your interests'),
            showCta: true,
            ctaText: gettext('View certification interests'),
            dismissButtonProps: false,
            onAction: () => {
                trackSelectionAndRedirect();
            },
        };

        toasterStore.addAlertBannerToast(bannerProps, {
            autoDismiss: true,
        });
    };

    const showErrorToast = () => {
        const bannerProps: AlertBannerProps = {
            udStyle: 'error',
            title: hasCertInterest
                ? gettext('Unable to remove from interests')
                : gettext('Unable to add to interests'),
            showCta: false,
            dismissButtonProps: false,
        };

        toasterStore.addAlertBannerToast(bannerProps, {
            autoDismiss: true,
        });
    };

    const handleInterestButtonClick = async () => {
        await certInterestButtonStore.updateUserCertificationInterest(!hasCertInterest, [
            String(courseTopicId),
        ]);

        const updateErrored = certInterestButtonStore.userCertificationInterestsMutationHasErrored;

        updateErrored ? showErrorToast() : showSuccessToast();

        if (!updateErrored && isMounted.current) {
            setHasCertInterest(!hasCertInterest);

            if (courseTopicId && !hasCertInterest) {
                Tracker.publishEvent(
                    new CertificationInterestsSavedEvent({
                        isOnboarding: false,
                        topicIds: [courseTopicId],
                    }),
                );
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const fetchCertificationInterestData = async () => {
            await certInterestButtonStore.getUserCertificationInterests();

            const certInterests = certInterestButtonStore.userCertificationInterests;

            if (certInterests && certInterests.length > 0 && isMounted.current) {
                setHasCertInterest(
                    certInterests.some((certInterest) => certInterest.id === String(courseTopicId)),
                );
            }
        };

        fetchCertificationInterestData();

        return () => {
            isMounted.current = false; // Set to false when the component unmounts
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        userCertificationInterestsIsFetching,
        userCertificationInterestsIsMutating,
        userCertificationInterestsFetchHasErrored,
    } = certInterestButtonStore;

    if (userCertificationInterestsFetchHasErrored) {
        return null;
    }

    return userCertificationInterestsIsFetching ? (
        <div className={styles['loader-wrapper']}>
            <Loader block={true} />
        </div>
    ) : (
        <Button
            data-purpose="cert-interest-button"
            className={classNames(styles['cert-interest-button'], {
                [styles['has-cert-interest']]: hasCertInterest,
            })}
            udStyle="secondary"
            onClick={handleInterestButtonClick}
            componentClass="a"
            disabled={userCertificationInterestsIsMutating}
        >
            {userCertificationInterestsIsMutating && <Loader overlay={true} />}
            <span data-purpose="icon-text-wrapper" className={styles['cert-interest-button-span']}>
                {hasCertInterest ? (
                    <>
                        <TickIcon label={false} size="xsmall" />
                        {gettext('Interested')}
                    </>
                ) : (
                    <>
                        <PlusIcon label={false} size="xsmall" />
                        {gettext('Add to interests')}
                    </>
                )}
            </span>
        </Button>
    );
});
