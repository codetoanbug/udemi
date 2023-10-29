import {Image, Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';

import {CertificationCardMenuMobxStore} from '../card-option/certification-card-menu.mobx-store';
import {CertificationCardOption} from '../card-option/certification-card-menu.react-component';
import {CertificationCardProps, CertificationStoreProp} from '../common/types';
import {sendEnrolledCertificationSelectedEvent} from '../common/utils/event-helpers';
import {routes} from '../constants';
import styles from './certifications-preparation.less';

interface CertificationPreparationCardProps {
    withRouter: boolean;
}

export const CertificationCard = (
    props: CertificationCardProps & CertificationPreparationCardProps & CertificationStoreProp,
) => {
    const {certification} = props;

    const certificationOptionStore = new CertificationCardMenuMobxStore(certification);

    const onClick = () => {
        sendEnrolledCertificationSelectedEvent(certification.name);
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
        </>
    );
    const certificationUrl = `${routes.learningInProgressPath(certification.id)}/${
        window.location.search
    }`;
    const certificationContent = (
        <>
            <span className={styles['certification-image']}>{certificationImage}</span>
            <span className={styles['certification-details']}>{certificationDetails}</span>
        </>
    );

    return (
        <div className={styles['certification-tile']}>
            <Link
                to={certificationUrl}
                className={styles['certification-tile-container']}
                onClick={onClick}
                disableRouter={!props.withRouter}
            >
                {certificationContent}
            </Link>
            <div className={classNames(styles['options-menu'])}>
                <CertificationCardOption
                    cardOptionStore={certificationOptionStore}
                    certification={certification}
                    certificationStore={props.certificationStore}
                    handleOnConfirm={props.handleOnOptionConfirm}
                />
            </div>
        </div>
    );
};

// Extending CertificationPreparationCardInternal from CertificationCard
export const CertificationPreparationCardInternal = (
    props: CertificationCardProps &
        RouteComponentProps &
        CertificationPreparationCardProps &
        CertificationStoreProp,
) => {
    return <CertificationCard {...props} />;
};

export const CertificationPreparationCard = withRouter(CertificationPreparationCardInternal);
