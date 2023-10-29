import {useI18n} from '@udemy/i18n';
import {Button, Image, Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import styles from './certifications-page.less';
import {CertificationCardProps} from './common/types';
import {sendCertificateListingPageSelectEvent} from './common/utils/event-helpers';
import {OPEN_BADGES_BASE_PATH} from './constants';

export const CertificationCard = (props: CertificationCardProps) => {
    const {certification} = props;
    const {gettext} = useI18n();

    const onClick = () => {
        sendCertificateListingPageSelectEvent(certification.name);
    };

    const certificationImage = <Image alt={certification.name} src={certification.image.id} />;
    const certificationDetails = (
        <>
            <h4
                className={classNames('ud-heading-md', styles['certification-title'])}
                data-purpose="certification-title"
            >
                {certification.name}
            </h4>
            <span
                className={classNames('ud-text-sm', styles['card-issuer-name'])}
                data-purpose="card-issuer-name"
            >
                {certification.issuer.name}
            </span>

            <span className={styles['badge-class-link']}>
                <Button udStyle="link">{gettext('Learn more')}</Button>
            </span>
        </>
    );

    return (
        <div className={styles['certification-tile']}>
            <Link
                to={`${OPEN_BADGES_BASE_PATH}/${certification.id}`}
                className={styles['certification-tile-container']}
                onClick={onClick}
            >
                <span className={styles['certification-image']}>{certificationImage}</span>
                <span className={styles['certification-details']}>{certificationDetails}</span>
            </Link>
        </div>
    );
};
