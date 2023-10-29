import {useI18n} from '@udemy/i18n';
import UploadIcon from '@udemy/icons/dist/upload.ud-icon';
import {Button, Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import detailStyles from '../detail-page.less';
import {UploadBadgeStore} from '../upload-badge/upload-badge.mobx-store';
import shieldIconSvg from './shield-icon.svg';

interface UploadBadgeBannerProps {
    store: UploadBadgeStore;
}

export const UploadBadgeBanner: React.FC<UploadBadgeBannerProps> = (props) => {
    const {gettext} = useI18n();
    const {store} = props;

    const openUploadBadgeModal = () => {
        store.setUploadBadgeModalOpen(true);
    };

    const uploadBadgeIcon = (
        <>
            <UploadIcon
                size="small"
                label={false}
                className={classNames(detailStyles['badge-link-icon'])}
            />
            <div className={classNames('ud-heading-md', detailStyles['badge-link-icon'])}>
                {gettext('Import badge')}
            </div>
        </>
    );

    return (
        <div className={classNames(detailStyles['badge-detail-container'], 'ud-container')}>
            <div className={classNames(detailStyles['badge-detail-info-container'])}>
                <div className={classNames(detailStyles['icon-container'])}>
                    <Image
                        alt=""
                        src={shieldIconSvg}
                        height="unset"
                        width="unset"
                        className={classNames(detailStyles['card-icon'], detailStyles.assessment)}
                    />
                </div>
                <div className={classNames('ud-heading-md')}>
                    {gettext(
                        'Did you pass your exam? Upload your badge and share your success with your team!',
                    )}
                </div>
            </div>
            {/* TODO: Update icon */}
            <Button onClick={openUploadBadgeModal} udStyle="ghost">
                {uploadBadgeIcon}
            </Button>
        </div>
    );
};
