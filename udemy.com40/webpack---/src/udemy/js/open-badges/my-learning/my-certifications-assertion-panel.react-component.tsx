import {LocalizedHtml} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {DEVICE_TYPE_MOBILE, getDeviceType} from 'browse/lib/device-type';
import udMe from 'utils/ud-me';

import {CertificationAssertionStore} from '../certification-assertion.mobx-store';
import styles from '../certification-preparation/certifications-preparation.less';
import detailStyles from '../detail-page.less';
import {CertificationAssertionCard} from '../upload-badge/certification-assertion-card.react-component';
import {ImportBadgeModal} from '../upload-badge/import-badge-modal.react-component';
import {UploadBadgeStore} from '../upload-badge/upload-badge.mobx-store';
import {EmptyAssertionState} from './empty-assertion-state';
import assertionStyle from './my-certification-style.less';

interface AssertionPanelProps {
    assertionStore: CertificationAssertionStore;
    badgeUploadStore: UploadBadgeStore;
}

@observer
export class MyCertificationsAssertionPanel extends React.Component<AssertionPanelProps> {
    static defaultProps = {
        assertionStore: new CertificationAssertionStore(),
        badgeUploadStore: new UploadBadgeStore(),
    };

    async componentDidMount() {
        await this.fetchAssertions();
    }

    private async fetchAssertions() {
        await this.props.assertionStore.fetchUserAssertion();
    }

    openUploadBadgeModal = () => {
        this.props.badgeUploadStore.setUploadBadgeModalOpen(true);
    };

    render() {
        const {isUserAssertionsLoaded, assertionList} = this.props.assertionStore;
        const isMobile = getDeviceType() === DEVICE_TYPE_MOBILE;

        const assertionCards = assertionList?.map((assertion) => (
            <div
                className={classNames(assertionStyle['certification-assertion-card'])}
                key={assertion.id}
            >
                <CertificationAssertionCard assertion={assertion} userUrl={udMe.url} />
            </div>
        ));

        const renderAssertions = () => {
            if (!isUserAssertionsLoaded || !assertionList) {
                return <MainContentLoader />;
            }

            if (assertionList.length === 0) {
                return <EmptyAssertionState onClick={this.openUploadBadgeModal} />;
            }

            return (
                <div
                    className={classNames(
                        styles['certification-tiles-container'],
                        assertionStyle['certification-assertion-tiles-container'],
                    )}
                    data-purpose="certification-assertion-tiles-container"
                >
                    {assertionCards}
                </div>
            );
        };

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
                            "This is the list of badges that you have uploaded to your profile. To upload a new badge, click on 'Import new badge'.",
                        )}
                    </p>
                </div>
            </Popover>
        );

        const myBadgesInfoDiv = () => {
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
                                    'You have earned and uploaded <span class="bold">%(assertionCount)s badge</span>',
                                    'You have earned and uploaded <span class="bold">%(assertionCount)s badges</span>',
                                    assertionList?.length ?? 0,
                                    {assertionCount: assertionList?.length ?? 0},
                                )}
                                interpolate={{
                                    bold: <span className="ud-text-bold" />,
                                }}
                            />
                        </div>
                        {!isMobile && popoverContent}
                    </div>
                    <Button
                        size="large"
                        udStyle="brand"
                        onClick={this.openUploadBadgeModal}
                        data-purpose="import-badge-button"
                    >
                        {gettext('Import new badge')}
                    </Button>
                </div>
            );
        };

        return (
            <>
                {myBadgesInfoDiv()}
                {renderAssertions()}
                <ImportBadgeModal
                    store={this.props.badgeUploadStore}
                    onClose={() => this.fetchAssertions()}
                />
            </>
        );
    }
}
