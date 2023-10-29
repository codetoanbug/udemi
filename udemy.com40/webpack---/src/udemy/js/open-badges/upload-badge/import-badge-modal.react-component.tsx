import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {AlertBanner, Confetti} from '@udemy/react-messaging-components';
import {Tabs} from '@udemy/react-structure-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {CertificationAssertionCard} from './certification-assertion-card.react-component';
import {ImageUploader} from './image-uploader.react-component';
import {UploadBadgeStore} from './upload-badge.mobx-store';
import styles from './uploader.less';

interface ImportBadgeModalProps {
    store: UploadBadgeStore;
    onClose?: () => void;
}

const UploadedBadgeSuccessModal: React.FC<ImportBadgeModalProps> = (props) => {
    const {gettext} = useI18n();
    const {store, onClose} = props;
    const assertion = store.assertion;
    if (!assertion) {
        return null;
    }

    const onModalClose = () => {
        store.setUploadedBadgeSuccessModalOpen(false);
        onClose?.();
    };

    const modalBody = (
        <>
            <div className={classNames(styles['uploaded-badge-success-modal-body'])}>
                <div className={classNames(styles['confetti-container'])}>
                    <Confetti />
                </div>
                <div>
                    {/* TODO: Display badge name in the text after discussion with design*/}
                    <div className={'ud-text-md'}>
                        <span className={'ud-heading-md'}>{gettext('Congratulations!')}</span>{' '}
                        {gettext(
                            'Your badge has been successfully uploaded to the website.' +
                                ' Your dedication and hard work have paid off, and we are thrilled to see your success. ' +
                                'This achievement reflects your expertise and commitment to excellence in the field.',
                        )}
                    </div>
                    <div className={'ud-heading-md'}>
                        {gettext(
                            'You can now proudly share your accomplishment with your manager and team.' +
                                ' Keep up the fantastic work and continue to shine brightly in your journey!',
                        )}
                    </div>
                </div>

                <CertificationAssertionCard assertion={assertion} />
                <div
                    className={classNames(
                        styles['upload-badge-success-modal-close-button-container'],
                    )}
                >
                    <Button onClick={onModalClose} data-purpose="close-uploaded-successful-modal">
                        {gettext('Close')}
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <Modal
            isOpen={store.isUploadedBadgeSuccessModalOpen}
            onClose={onModalClose}
            className={classNames(styles['uploaded-badge-success-modal'])}
            title={gettext('Badge uploaded')}
        >
            {modalBody}
        </Modal>
    );
};

const UploadedBadgeNoMatchModal: React.FC<ImportBadgeModalProps> = (props) => {
    const {gettext} = useI18n();
    const {store, onClose} = props;
    const assertion = store.assertion;
    if (!assertion) {
        return null;
    }

    const onModalClose = () => {
        store.setUploadedBadgeNoMatchModalOpen(false);
        onClose?.();
    };

    const uploadADifferentBadge = () => {
        store.setUploadedBadgeNoMatchModalOpen(false);
        store.setUploadBadgeModalOpen(true);
    };

    const keepUploadedBadge = () => {
        store.setUploadedBadgeNoMatchModalOpen(false);
        store.setUploadedBadgeSuccessModalOpen(true);
    };

    const modalBody = (
        <div className={classNames(styles['upload-badge-modal-body-image-tab'])}>
            <AlertBanner
                udStyle="warning"
                title={gettext(
                    "It appears that you have uploaded a badge that doesn't match the intended credential. Would you like to proceed with this badge or upload a new one?",
                )}
                dismissButtonProps={false}
                actionButtonProps={false}
            />
            <CertificationAssertionCard assertion={assertion} />
            <div className={classNames(styles['upload-badge-modal-buttons'])}>
                <Button
                    data-purpose="upload-different-badge-button"
                    onClick={uploadADifferentBadge}
                    udStyle={'ghost'}
                    className={classNames('ud-link-neutral')}
                >
                    {gettext('Upload a different badge')}
                </Button>
                <Button data-purpose="keep-uploaded-badge-button" onClick={keepUploadedBadge}>
                    {gettext('Keep the uploaded badge')}
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={store.isUploadedBadgeNoMatchModalOpen}
            onClose={onModalClose}
            title={gettext('Badge uploaded')}
        >
            {modalBody}
        </Modal>
    );
};

const UploadError: React.FC<{errorMessage: string}> = (props) => {
    const {errorMessage} = props;
    return (
        <div className={classNames(styles['upload-error-banner-style'])}>
            <AlertBanner
                udStyle="error"
                title={errorMessage}
                dismissButtonProps={false}
                actionButtonProps={false}
            />
        </div>
    );
};

const UploadBadgeModal: React.FC<{store: UploadBadgeStore}> = observer((props) => {
    const {gettext} = useI18n();
    const {store} = props;

    const onModalClose = () => {
        store.setUploadBadgeModalOpen(false);
        store.setErrorMessage(undefined);
    };

    const modalBody = (
        <Tabs>
            <Tabs.Tab title={gettext('Image')}>
                {store.errorMessage && <UploadError errorMessage={store.errorMessage} />}
                <div className={classNames(styles['upload-badge-modal-body-image-tab'])}>
                    {gettext(
                        "Please save a copy of the image of a third party badge you've received and upload it here. " +
                            'This way, you can share your success with your manager and team.',
                    )}
                    <ImageUploader store={store} />
                </div>
            </Tabs.Tab>
        </Tabs>
    );

    return (
        <Modal
            isOpen={store.isUploadBadgeModalOpen}
            onClose={onModalClose}
            title={gettext('Badge import')}
        >
            {modalBody}
        </Modal>
    );
});

export const ImportBadgeModal: React.FC<ImportBadgeModalProps> = observer((props) => {
    const {store, onClose} = props;

    return (
        <>
            {store.isUploadBadgeModalOpen && <UploadBadgeModal store={store} />}
            {store.isUploadedBadgeNoMatchModalOpen && (
                <UploadedBadgeNoMatchModal store={store} onClose={onClose} />
            )}
            {store.isUploadedBadgeSuccessModalOpen && (
                <UploadedBadgeSuccessModal store={store} onClose={onClose} />
            )}
        </>
    );
});
