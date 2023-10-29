import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {useMatchMedia} from 'base-components/responsive/match-media.react-component';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import styles from './certifications-page.less';

export const CertificationsPageBanner = () => {
    const {gettext} = useI18n();
    const isLgMin = useMatchMedia('md-min');
    return (
        <div className={styles['banner-container']}>
            <div className={classNames('ud-container', styles.banner)}>
                <div className={styles['certifications-header']}>
                    <h1 className={classNames('ud-heading-serif-xxl', styles['banner-title'])}>
                        {gettext('Certification preparation')}
                    </h1>
                    <p className={classNames('ud-text-lg', styles['banner-text'])}>
                        {gettext(
                            'Preparing for a certification can be a challenging process. ' +
                                'Learn at your own pace and increase your chances of success. ' +
                                'Explore learning content to help you prepare for your certification, ' +
                                'before taking the exam from a trusted third party provider.',
                        )}
                    </p>
                    <a
                        className={classNames('ud-text-lg', styles['certification-links'])}
                        href={udLink.toSupportLink(
                            'certification_prep',
                            getConfigData().brand.has_organization,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('What is certification preparation?')}
                    </a>
                </div>
                {isLgMin && (
                    <Image
                        alt=""
                        className={styles.bannerImage}
                        src={udLink.toStorageStaticAsset('certification-prep/banner-desktop.png')}
                        srcSet={`${udLink.toStorageStaticAsset(
                            'certification-prep/banner-desktop.png',
                        )} 1x, ${udLink.toStorageStaticAsset(
                            'certification-prep/banner-desktop-2x.png',
                        )} 2x`}
                        height={220}
                        width={140}
                    />
                )}
            </div>
        </div>
    );
};
