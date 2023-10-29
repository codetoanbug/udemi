import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import {CertificationPreparationCard} from '../certification-preparation/certification-preparation-card.react-component';
import styles from '../certification-preparation/certifications-preparation.less';
import {EmptyState} from '../certification-preparation/empty-state.react-component';
import {CertificationStore} from '../certification.mobx-store';

@observer
export class MyCertificationPreparation extends React.Component {
    async componentDidMount() {
        await this.store.fetchPreparationCertifications();
    }

    store = new CertificationStore();

    render() {
        const {isPreparationCertsLoaded, preparationCertificationsList} = this.store;
        if (!isPreparationCertsLoaded) {
            return <MainContentLoader />;
        }
        if (!preparationCertificationsList?.length) {
            return <EmptyState />;
        }
        const certificationTiles = preparationCertificationsList?.map((certification) => (
            <CertificationPreparationCard
                certification={certification}
                key={certification.id}
                withRouter={false}
                certificationStore={this.store}
                // We have to pass the store because there's no provider in case of my learning
                // Discuss with FE team to refactor this
                // and make the store available in the child functional components as well
            />
        ));

        return (
            <div
                className={styles['certification-tiles-container']}
                data-purpose={'certification-tiles-container'}
            >
                {certificationTiles}
            </div>
        );
    }
}
