import {Link} from '@udemy/react-core-components';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {Helmet} from 'react-helmet';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';

import {CertificationExplore} from '../certification-explore.react-component';
import {CertificationsDetailBanner} from '../certifications-detail-banner.react-component';
import styles from '../certifications-page.less';
import {MainPageProps} from '../common/types';
import {isBadgingCertPrepEnabled} from '../common/utils/utils';
import {CERTIFICATION_DETAIL_PAGE_TABS, routes} from '../constants';
import {CertificationLearningInProgress} from '../learning-in-progress/certification-learning-in-progress.react-component';

interface RouteParams {
    id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
@(withRouter as any) // Hack:https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24077#issuecomment-429631128
// Alternative to this(working btw) is to remove this annotation and add `export const BusinessDomainDetailsView = withRouter(BusinessDomainDetailsViewComponent);
// People from other teams use withRouter(SomeComponent) but they use it for functional components
@inject('certificationStore')
@observer
class CertificationDetailPageUnwrapped extends React.Component<
    MainPageProps & RouteComponentProps<RouteParams> & WithUDDataProps
> {
    constructor(props: MainPageProps & RouteComponentProps<RouteParams> & WithUDDataProps) {
        super(props);
    }

    async componentDidMount() {
        await this.fetchCertificate();
    }

    private async fetchCertificate() {
        const {match, certificationStore} = this.props;
        certificationStore.unsetCertification();

        const {id: certificateId} = match.params;
        if (certificateId !== undefined) {
            await certificationStore.getCertification(certificateId);
        }
    }

    render() {
        const {
            certificationStore,
            activeTabId = CERTIFICATION_DETAIL_PAGE_TABS.EXPLORE,
            udData,
        } = this.props;
        const {certification} = certificationStore;
        if (!certification) {
            return <div className={styles['banner-container']} />;
        }
        const isCertPrepEnabled = isBadgingCertPrepEnabled();
        return (
            <>
                {certification?.name && (
                    <Helmet key={certification?.id}>
                        <title>
                            {interpolate(
                                gettext('Prepare %(certificationName)s | %(suffix)s'),
                                {
                                    certificationName: certification?.name,
                                    suffix: udData.Config.brand.product_name,
                                },
                                true,
                            )}
                        </title>
                    </Helmet>
                )}
                <CertificationsDetailBanner
                    certification={certification}
                    onUpdate={() => this.fetchCertificate()}
                />
                <div
                    className={classNames(
                        'ud-container',
                        styles['certifications-directory-container'],
                    )}
                >
                    {isCertPrepEnabled ? (
                        <Tabs activeTabId={activeTabId} size="large">
                            <Tabs.Tab
                                id={CERTIFICATION_DETAIL_PAGE_TABS.EXPLORE}
                                key={CERTIFICATION_DETAIL_PAGE_TABS.EXPLORE}
                                title={gettext('Explore')}
                                renderTabButton={(button) => (
                                    <h2>
                                        {React.cloneElement(button, {
                                            componentClass: Link,
                                            to: `${routes.certificationDetailPath(
                                                certification?.id,
                                            )}${this.props.location.search}`,
                                        })}
                                    </h2>
                                )}
                            >
                                <CertificationExplore
                                    certification={certification}
                                    isCertPrepEnabled={isCertPrepEnabled}
                                />
                            </Tabs.Tab>

                            <Tabs.Tab
                                id={CERTIFICATION_DETAIL_PAGE_TABS.LEARNING_IN_PROGRESS}
                                key={CERTIFICATION_DETAIL_PAGE_TABS.LEARNING_IN_PROGRESS}
                                title={gettext('Learning in progress')}
                                renderTabButton={(button) => (
                                    <h2>
                                        {React.cloneElement(button, {
                                            componentClass: Link,
                                            to: `${routes.learningInProgressPath(
                                                certification?.id,
                                            )}/${this.props.location.search}`,
                                        })}
                                    </h2>
                                )}
                            >
                                <CertificationLearningInProgress />
                            </Tabs.Tab>
                        </Tabs>
                    ) : (
                        <CertificationExplore certification={certification} />
                    )}
                </div>
            </>
        );
    }
}

export const CertificationDetailPage = withUDData(CertificationDetailPageUnwrapped);
