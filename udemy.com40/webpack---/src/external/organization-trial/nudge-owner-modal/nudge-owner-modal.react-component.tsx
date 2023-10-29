import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextArea, Radio} from '@udemy/react-form-components';
import {AlertBannerProps, ToasterStore} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';

import {NudgeOwnerModalStore} from './nudge-owner-modal.mobx-store';
import styles from './nudge-owner-modal.module.less';

interface NudgeOwnerModalProps {
    isOpen: boolean;
    ownerName: string;
    onClose(): void;
}

export const NudgeOwnerModal = observer(({isOpen, ownerName, onClose}: NudgeOwnerModalProps) => {
    const {gettext, interpolate} = useI18n();
    const [store] = React.useState(new NudgeOwnerModalStore(ownerName, gettext));

    const onFeedbackOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        store.setUserRating(Number(event.target.value));
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        store.sendNudgeOwnerMessage(handleClose).then(() => {
            if (store.isNotificationVisible) {
                const alertBannerProps: AlertBannerProps = {
                    udStyle: store.notificationType,
                    title: store.notificationText,
                    showCta: false,
                };
                ToasterStore.addAlertBannerToast(alertBannerProps, {
                    autoDismiss: true,
                    autoDismissTimeout: 5000,
                    onDismiss: store.hideNotification,
                });
            }
        });
    };

    const handleClose = () => {
        store.setDefaultMessage();
        onClose();
    };

    const renderFeedbackOptions = () => {
        const stepTitles = [
            {value: 4, text: gettext('Excellent')},
            {value: 3, text: gettext('Very good')},
            {value: 2, text: gettext('Good')},
            {value: 1, text: gettext('Fair')},
            {value: 0, text: gettext('Poor')},
        ];
        return (
            <div data-testid="radio-group" className={styles['radio-group']}>
                {stepTitles.map((step) => {
                    return (
                        <Radio
                            name="rating"
                            key={step.value}
                            onChange={onFeedbackOptionChange}
                            value={step.value}
                            defaultChecked={store.userRating === step.value}
                        >
                            {step.text}
                        </Radio>
                    );
                })}
            </div>
        );
    };

    return (
        <Modal
            className="udlite-in-udheavy"
            isOpen={isOpen}
            onClose={handleClose}
            title={gettext('Send feedback')}
        >
            <form onSubmit={onSubmit}>
                <h3 className={classNames('ud-heading-lg', styles['feedback-title'])}>
                    {gettext('How was your experience with Udemy Business?')}
                </h3>
                {renderFeedbackOptions()}
                <h3 className={classNames('ud-heading-lg', styles['feedback-title'])}>
                    {gettext('Write a message')}
                </h3>
                <FormGroup
                    label={interpolate(
                        gettext('Let %(ownerName)s know how your experience was'),
                        {ownerName},
                        true,
                    )}
                >
                    <TextArea
                        onChange={store.onMessageChanged}
                        value={store.message}
                        className={styles['message-input']}
                    />
                </FormGroup>
                <FooterButtons>
                    <Button udStyle="ghost" onClick={onClose}>
                        {gettext('Close')}
                    </Button>
                    <Button type="submit" disabled={!store.message}>
                        {gettext('Send')}
                    </Button>
                </FooterButtons>
            </form>
        </Modal>
    );
});
