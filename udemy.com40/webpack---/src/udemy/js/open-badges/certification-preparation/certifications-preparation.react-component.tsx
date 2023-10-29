import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';

import {CertificationModel} from '../certification.mobx-model';
import {CertificationStore} from '../certification.mobx-store';
import {PreparationProps} from '../common/types';
import {isBadgingAssertionsEnabled} from '../common/utils/utils';
import {CertificationPreparationCard} from './certification-preparation-card.react-component';
import styles from './certifications-preparation.less';
import {EmptyState} from './empty-state.react-component';

@inject('certificationStore')
@observer
export class CertificationsPreparation extends Component<PreparationProps & RouteComponentProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    async componentDidMount() {
        await this.props.certificationStore.fetchPreparationCertifications();
    }

    private manageMyBadgesHref() {
        if (isBadgingAssertionsEnabled()) {
            return '/home/my-courses/certifications/';
        }
        return '/home/my-courses/certification-preparation/';
    }

    private messageComponent(preparationCertificationsList: CertificationModel[] | undefined) {
        if (preparationCertificationsList?.length) {
            return (
                <>
                    <h2 className={classNames('ud-heading-lg', styles['preparation-title'])}>
                        {gettext('My certification preparation')}
                    </h2>
                    <p className={classNames('ud-text-md', styles['preparation-description'])}>
                        {gettext(
                            'You have enrolled in learning content specifically designed to help you prepare for certain certifications. Here is the list of certifications that you are working towards:',
                        )}
                    </p>
                    <div className={styles['button-right']}>
                        <Button
                            udStyle="secondary"
                            size="large"
                            componentClass={'a'}
                            href={this.manageMyBadgesHref()}
                            className={classNames(styles['button-mobile'])}
                            data-purpose={'Manage-badge'}
                        >
                            {gettext('Manage my badges')}
                        </Button>
                    </div>
                </>
            );
        }
        return <EmptyState />;
    }

    render() {
        const {
            preparationCertificationsList,
            isPreparationCertsLoaded,
        } = this.props.certificationStore;
        if (!isPreparationCertsLoaded) {
            return <div />;
        }

        const certificationTiles = preparationCertificationsList?.map((certification) => (
            <CertificationPreparationCard
                certification={certification}
                key={certification.id}
                withRouter={true}
                certificationStore={this.props.certificationStore}
            />
        ));
        return (
            <div>
                {this.messageComponent(preparationCertificationsList)}
                <div
                    className={styles['certification-tiles-container']}
                    data-purpose={'certification-tiles-container'}
                >
                    {certificationTiles}
                </div>
            </div>
        );
    }
}
