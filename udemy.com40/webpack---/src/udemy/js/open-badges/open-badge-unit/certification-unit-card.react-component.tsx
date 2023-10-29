import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {CertInterestButton} from 'personalize/components/cert-interest-button/cert-interest-button.react-component';

import {CertificationModel} from '../certification.mobx-model';
import {sendCertificateTopicPageSelectEvent} from '../common/utils/event-helpers';
import {OPEN_BADGES_BASE_PATH} from '../constants';
import styles from './certification-carousel.less';

interface CertificationCardProps {
    certification: CertificationModel;
    courseTopicId?: number;
    showUpdatedCertificationCard?: boolean;
}

export const CertificationUnitCard = (props: CertificationCardProps) => {
    const {certification, courseTopicId, showUpdatedCertificationCard} = props;
    const {gettext, interpolate} = useI18n();

    return (
        <div
            data-purpose="carousel-card-container"
            className={classNames(styles['carousel-card-container'], {
                [styles['is-updated-cert-card']]: showUpdatedCertificationCard,
            })}
        >
            <a
                href={`${OPEN_BADGES_BASE_PATH}/${certification.id}`}
                data-purpose="certification-card-link"
                className={styles['carousel-card-link']}
                onClick={() => sendCertificateTopicPageSelectEvent(certification.name)}
            >
                <Image
                    className={styles['carousel-certificate-image']}
                    alt={certification.name}
                    src={certification.image.id}
                />
                <div className={classNames(styles['carousel-info'])}>
                    <h4
                        className={classNames(
                            showUpdatedCertificationCard ? 'ud-heading-sm' : 'ud-heading-lg',
                            styles['certification-title'],
                        )}
                        data-purpose="certification-title"
                    >
                        {certification.name}
                    </h4>
                    <span
                        className={classNames('ud-text-xs', styles['carousel-issuer-name'])}
                        data-purpose="card-issuer-name"
                    >
                        {interpolate(
                            gettext('Issued by %(issuer)s'),
                            {issuer: certification.issuer.name},
                            true,
                        )}
                    </span>
                </div>
            </a>
            {showUpdatedCertificationCard && courseTopicId && (
                <CertInterestButton courseTopicId={courseTopicId} />
            )}
        </div>
    );
};
