import {MainContentLoader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {CertificationCard} from './certification-card.react-component';
import {CertificationStore} from './certification.mobx-store';
import styles from './certifications-page.less';
import {FilterPanelProps} from './common/types';
import {NoResultsFound} from './no-results-found.react-component';

@inject('certificationStore')
@observer
export class CertificationsList extends React.Component<FilterPanelProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    async componentDidMount() {
        if (!this.props.certificationStore.isCertificationListLoaded) {
            await this.props.certificationStore.performSearch();
        }
    }

    render() {
        const {
            certificationsList,
            isLoading,
            isCertificationListLoaded,
            loadedCertificationCount,
        } = this.props.certificationStore;
        const loader = (
            <div className={classNames(styles['loading-overlay'])}>
                <MainContentLoader size="xxlarge" />
            </div>
        );
        const certificationTiles = certificationsList?.map((certification) => (
            <CertificationCard certification={certification} key={certification.id} />
        ));

        if (isCertificationListLoaded && !loadedCertificationCount) {
            return <NoResultsFound />;
        }

        return (
            <div
                className={styles['certification-tiles-container']}
                data-purpose={'certification-tiles-container'}
            >
                {isLoading && loader}
                {certificationTiles}
            </div>
        );
    }
}
