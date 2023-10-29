import {useI18n} from '@udemy/i18n';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AuthenticatedUser, useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import {routes} from '../constants';
import detailStyles from '../detail-page.less';

interface BadgeUploadedBannerProps {
    assertionId: string;
}

export const BadgeUploadedBanner: React.FC<BadgeUploadedBannerProps> = (props) => {
    const {gettext} = useI18n();
    const {me} = useUDData();
    const authenticatedUser = me as AuthenticatedUser;
    const userUrl = authenticatedUser.url;

    return (
        <div className={classNames(detailStyles['badge-detail-container'], 'ud-container')}>
            <div className={classNames(detailStyles['badge-detail-info-container'])}>
                <div className={classNames(detailStyles['badge-success-icon-container'])}>
                    <SuccessIcon
                        label={false}
                        size="xlarge"
                        className={classNames(detailStyles['badge-success-icon'])}
                    />
                </div>
                <div className={classNames('ud-heading-md')}>
                    {gettext('Congratulations! This badge has been added to your profile.')}
                </div>
            </div>
            <div className={classNames(detailStyles['uploaded-badge-actions'])}>
                <Button
                    udStyle={'secondary'}
                    size={'medium'}
                    componentClass="a"
                    href={routes.assertionDetailPath(props.assertionId, userUrl)}
                >
                    {gettext('View badge')}
                </Button>
            </div>
        </div>
    );
};
