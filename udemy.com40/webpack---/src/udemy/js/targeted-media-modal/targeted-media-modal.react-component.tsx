import {TrackImpression} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {Button, Image} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {UDData, withUDData} from '@udemy/ud-data';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import loadCommonAppContext from '../common/load-common-app-context';
import serverOrClient from '../utils/server-or-client';
import {ModalVideoPlayer} from './modal-video-player.react-component';
import styles from './targeted-media-modal.less';
import {ApiClass, createTargetedMediaModalStore} from './targeted-media-modal.mobx-store';

export interface TargetedMediaModalProps {
    page: string;
    features: {[key: string]: boolean};
    udData: UDData;
}

const TargetedMediaModalComponent = observer((props: TargetedMediaModalProps) => {
    const udData = props.udData;
    const [mediaModalStore, setMediaModalStore] = useState<ApiClass | undefined>();
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const isMobile = useMatchMedia('mobile-max');

    useEffect(() => {
        loadCommonAppContext().then((response) => {
            if (!udData.isGlobalMeContextLoading && !mediaModalStore) {
                runInAction(() => {
                    const isPersonalPlanSubscriber =
                        ('consumer_subscription_active' in response.data.header.user &&
                            response.data.header.user.consumer_subscription_active) ??
                        false;
                    const store = createTargetedMediaModalStore({
                        isPersonalPlanSubscriber,
                        page: props.page,
                        features: props.features,
                        udConfig: udData.Config,
                        udMe: udData.me,
                        udRequest: udData.request,
                        userAgnosticTrackingParams: udData.userAgnosticTrackingParams,
                    });
                    setMediaModalStore(store);
                });
            }
        });
    }, [
        mediaModalStore,
        props.features,
        props.page,
        udData.Config,
        udData.isGlobalMeContextLoading,
        udData.me,
        udData.request,
        udData.userAgnosticTrackingParams,
    ]);

    if (
        !mediaModalStore?.isLoaded ||
        mediaModalStore?.data === undefined ||
        mediaModalStore.isHidden
    ) {
        return null;
    }

    const onClose = (sendHideEvent = true) => {
        setModalIsOpen(false);
        mediaModalStore.hide();
        if (sendHideEvent) {
            mediaModalStore.sendHideEvent();
        }
    };

    const onClick = () => {
        const url = mediaModalStore?.data?.cta_url;
        mediaModalStore.sendClickEvent();
        if (url) {
            mediaModalStore.hide().then(() => {
                serverOrClient.global.location.href = url;
            });
        } else {
            onClose(false);
        }
    };

    const playerOptions = {
        isDefaultPlaying: false,
    };

    let title = mediaModalStore.data.title;
    let subtitle = mediaModalStore.data.subtitle;
    let image = mediaModalStore.data.image;

    if (isMobile) {
        title = mediaModalStore.data.title_responsive;
        subtitle = mediaModalStore.data.subtitle_responsive;
        image = mediaModalStore.data.image_responsive;
    }
    return (
        <TrackImpression
            trackFunc={() => {
                mediaModalStore.sendImpressionsEvent();
            }}
        >
            <Modal
                isOpen={modalIsOpen}
                onClose={onClose}
                title={title}
                className={styles['targeted-media-modal']}
            >
                <div className={styles.subtitle}>{subtitle}</div>
                {mediaModalStore.data.video && (
                    <div className={styles['video-container']}>
                        <ModalVideoPlayer
                            id={parseInt(mediaModalStore.data.video, 10)}
                            playerOptions={playerOptions}
                            mediaModalStore={mediaModalStore}
                        />
                    </div>
                )}
                {!mediaModalStore.data.video && image && (
                    <div className={styles['img-container']}>
                        <Image
                            role="button"
                            src={image}
                            alt={interpolate(gettext('Image of %(title)s'), {title}, true)}
                        />
                    </div>
                )}
                <Button
                    onClick={onClick}
                    className={styles['cta-button']}
                    data-purpose="targeted-media-modal-cta"
                >
                    {mediaModalStore.data.cta_label}
                </Button>
            </Modal>
        </TrackImpression>
    );
});

export const TargetedMediaModal = withUDData(TargetedMediaModalComponent);
