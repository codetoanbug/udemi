import {LocalizedHtml} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {DEVICE_TYPE_MOBILE, getDeviceType} from 'browse/lib/device-type';

import {CertificationCard} from '../certification-preparation/certification-preparation-card.react-component';
import styles from '../certification-preparation/certifications-preparation.less';
import {EmptyState} from '../certification-preparation/empty-state.react-component';
import {CertificationStore} from '../certification.mobx-store';
import {OPEN_BADGES_BASE_PATH} from '../constants';
import detailStyles from '../detail-page.less';
import assertionStyle from './my-certification-style.less';

interface CertificationPanelProps {
    certificationStore: CertificationStore;
}

@observer
export class MyCertificationPreparationPanel extends React.Component<CertificationPanelProps> {
    static defaultProps = {
        certificationStore: new CertificationStore(),
    };

    async componentDidMount() {
        await this.props.certificationStore.fetchPreparationCertifications();
    }

    render() {
        const {
            isPreparationCertsLoaded,
            preparationCertificationsList,
        } = this.props.certificationStore;

        const isMobile = getDeviceType() === DEVICE_TYPE_MOBILE;

        const popoverContent = (
            <Popover
                className={classNames(detailStyles['badge-info-tooltip-container'])}
                canToggleOnHover={true}
                placement={'bottom'}
                withPadding={true}
                trigger={
                    <InfoOutlineIcon
                        className={classNames(detailStyles['badge-info-icon'])}
                        label={false}
                        size="small"
                    />
                }
            >
                <div>
                    <p>
                        {gettext(
                            'This is the list of certifications you are preparing for. Explore the certification ' +
                                'preparation center to find content and learn more about your next certification.',
                        )}
                    </p>
                </div>
            </Popover>
        );

        const certificationTiles = preparationCertificationsList?.map((certification) => (
            <CertificationCard
                certification={certification}
                key={certification.id}
                withRouter={false}
                certificationStore={this.props.certificationStore}
                // We have to pass the store because there's no provider in case of my learning
                // Discuss with FE team to refactor this
                // and make the store available in the child functional components as well
            />
        ));

        const renderCertificationTiles = () => {
            if (!isPreparationCertsLoaded || !preparationCertificationsList) {
                return <MainContentLoader />;
            }

            if (preparationCertificationsList.length === 0) {
                return <EmptyState data-purpose="certification-empty-state" />;
            }

            return (
                <div
                    className={classNames(
                        styles['certification-tiles-container'],
                        assertionStyle['assertion-grid-item'],
                    )}
                    data-purpose={'certification-tiles-container'}
                >
                    {certificationTiles}
                </div>
            );
        };

        const panelInfo = () => {
            return (
                <div className={classNames(assertionStyle['panel-info-container'])}>
                    <div
                        className={classNames(
                            assertionStyle['certification-assertion-text-popover'],
                        )}
                    >
                        <div className={'ud-text-lg'}>
                            <LocalizedHtml
                                html={ninterpolate(
                                    'You are preparing for <span class="bold">%(certificationCount)s certification</span>',
                                    'You are preparing for <span class="bold">%(certificationCount)s certifications</strong>',
                                    preparationCertificationsList?.length ?? 0,
                                    {
                                        certificationCount:
                                            preparationCertificationsList?.length ?? 0,
                                    },
                                )}
                                interpolate={{
                                    bold: <span className="ud-text-bold" />,
                                }}
                            />
                        </div>
                        {!isMobile && popoverContent}
                    </div>
                    {!isMobile && (
                        <Button
                            size={'large'}
                            udStyle={'secondary'}
                            href={OPEN_BADGES_BASE_PATH}
                            componentClass={'a'}
                            data-purpose="explore-certification-preparation-button"
                        >
                            {gettext('Explore certification preparation')}
                        </Button>
                    )}
                </div>
            );
        };

        return (
            <>
                {panelInfo()}
                {renderCertificationTiles()}
            </>
        );
    }
}
