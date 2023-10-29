import {Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';

import {CertificationListPage} from './certification-list-page.react-component';
import {CertificationsPreparation} from './certification-preparation/certifications-preparation.react-component';
import {CertificationsPageBanner} from './certifications-page-banner.react-component';
import styles from './certifications-page.less';
import {MainPageProps} from './common/types';
import {isBadgingCertPrepEnabled} from './common/utils/utils';
import {
    CERTIFICATION_LANDING_PAGE_TABS,
    MY_CERTIFICATION_PREPARATION_PATH,
    OPEN_BADGES_BASE_PATH,
} from './constants';

export const CertificationLandingPage = withRouter(
    inject('certificationStore')(
        observer((props: MainPageProps & RouteComponentProps) => {
            const isCertPrepEnabled = isBadgingCertPrepEnabled();
            const {activeTabId = CERTIFICATION_LANDING_PAGE_TABS.CERTIFICATION_FINDER} = props;

            return (
                <>
                    <CertificationsPageBanner />
                    <div
                        className={classNames(
                            'ud-container',
                            styles['certifications-directory-container'],
                        )}
                    >
                        {isCertPrepEnabled ? (
                            <Tabs size="large" activeTabId={activeTabId}>
                                <Tabs.Tab
                                    id={CERTIFICATION_LANDING_PAGE_TABS.CERTIFICATION_FINDER}
                                    key={CERTIFICATION_LANDING_PAGE_TABS.CERTIFICATION_FINDER}
                                    title={gettext('Certification finder')}
                                    renderTabButton={(button) => (
                                        <h2>
                                            {React.cloneElement(button, {
                                                componentClass: Link,
                                                to: OPEN_BADGES_BASE_PATH + props.location.search,
                                            })}
                                        </h2>
                                    )}
                                >
                                    <CertificationListPage />
                                </Tabs.Tab>

                                <Tabs.Tab
                                    id={
                                        CERTIFICATION_LANDING_PAGE_TABS.MY_CERTIFICATION_PREPARATION
                                    }
                                    key={
                                        CERTIFICATION_LANDING_PAGE_TABS.MY_CERTIFICATION_PREPARATION
                                    }
                                    title={`${gettext('My certification preparation')} (${
                                        props.certificationStore.preparationCertificationCount
                                    })`}
                                    renderTabButton={(button) => (
                                        <h2>
                                            {React.cloneElement(button, {
                                                componentClass: Link,
                                                to:
                                                    MY_CERTIFICATION_PREPARATION_PATH +
                                                    props.location.search,
                                            })}
                                        </h2>
                                    )}
                                >
                                    <CertificationsPreparation {...props} />
                                </Tabs.Tab>
                            </Tabs>
                        ) : (
                            <CertificationListPage />
                        )}
                    </div>
                </>
            );
        }),
    ),
);
