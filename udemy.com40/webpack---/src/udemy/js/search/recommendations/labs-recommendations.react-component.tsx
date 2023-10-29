import {Tracker} from '@udemy/event-tracking';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import LabsIcon from '@udemy/icons/dist/labs.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {LabCardContainer} from 'browse/components/lab-card/lab-card.react-component';
import {LabDetailsQuickViewBox} from 'browse/components/lab-card/lab-details-quick-view-box.react-component';
import {Keys, LabCardData} from 'browse/components/lab-card/types';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {LabsInfoModalLaunchEvent, ExploreLabsClickEvent} from 'browse/lab-events';
import {DEVICE_TYPE_MOBILE, getDeviceType} from 'browse/lib/device-type';
import {DeviceTypeProps} from 'browse/lib/device-type-props';
import {Lab} from 'gql-codegen/api-platform-graphql';
import {ModalLabsSteps} from 'labs-landing/modal-labs-steps.react-component';
import {SEARCH_PAGE} from 'labs/constants';
import serverOrClient from 'utils/server-or-client';

import './labs-recommendations.less';

interface LabsRecommendationProps extends DeviceTypeProps {
    labs?: Partial<Lab>[];
    error?: string;
    searchResultSetTrackingId?: string;
    uiRegion: typeof LABS_DISCOVER_COMPONENTS[Keys];
    onReload?: () => void;
    labsInProSearchEnabled?: boolean;
}

@observer
export class LabSearchRecommendations extends Component<LabsRecommendationProps> {
    constructor(props: LabsRecommendationProps) {
        super(props);
    }

    get window() {
        return serverOrClient.global;
    }

    @autobind
    @action
    onLabInfoClick() {
        Tracker.publishEvent(new LabsInfoModalLaunchEvent());
    }

    @autobind
    onViewMoreClick() {
        Tracker.publishEvent(new ExploreLabsClickEvent());
        this.window.location.href = '/labs/listing/';
    }

    @autobind
    reloadLabs() {
        if (this.props.onReload) {
            this.props.onReload();
        }
    }

    renderErrorState() {
        return (
            <AlertBanner
                title={gettext('There was a problem loading lab recommendations')}
                body={gettext('Please refresh this section to resolve this issue')}
                ctaText={gettext('Refresh this section')}
                onAction={this.reloadLabs}
                udStyle="warning"
                dismissButtonProps={false}
                styleName="alert-banner"
            />
        );
    }

    renderLabsCarousel(isMobile: boolean) {
        return (
            <Carousel
                id="search-lab-carousel"
                showPager={!isMobile}
                fullViewport={isMobile}
                styleName="grid"
            >
                {this.props.labs?.map((lab) => (
                    <LabDetailsQuickViewBox
                        key={`lab-list-item-${lab.id}`}
                        lab={lab as LabCardData}
                        showQuickViewBox={!isMobile}
                        labCard={
                            <LabCardContainer
                                lab={lab as LabCardData}
                                styleName="lab"
                                searchResultSetTrackingId={this.props.searchResultSetTrackingId}
                                uiRegion={this.props.uiRegion}
                                fromPage={SEARCH_PAGE}
                            />
                        }
                    />
                ))}
            </Carousel>
        );
    }

    render() {
        if (!this.props.error && (!this.props.labs || this.props.labs.length === 0)) {
            return null;
        }
        const deviceType = getDeviceType();
        const isMobile = deviceType === DEVICE_TYPE_MOBILE;
        return (
            <>
                <div styleName="header">
                    <LabsIcon label={false} styleName="lab-icon" />
                    <div styleName="title-wrapper">
                        <div styleName="title-container">
                            <h2
                                className={isMobile ? 'ud-heading-lg' : 'ud-heading-xl'}
                                styleName="title"
                            >
                                <span>{gettext('Labs interactive practice')}</span>
                                {this.props.labsInProSearchEnabled && <ProBadge />}
                            </h2>
                            <ModalTrigger
                                trigger={
                                    <Button
                                        udStyle="link-underline"
                                        size="medium"
                                        typography="ud-text-xs"
                                        styleName="btn-lab-info"
                                        data-purpose="lab-info-modal-trigger"
                                        onClick={this.onLabInfoClick}
                                    >
                                        <InfoOutlineIcon label={false} styleName="info-icon" />
                                        {!isMobile ? gettext('How Labs work') : ''}
                                    </Button>
                                }
                                renderModal={(props: {isOpen: boolean; onClose: () => void}) => (
                                    <ModalLabsSteps
                                        isOpen={props.isOpen}
                                        onClose={props.onClose}
                                        fromPage={SEARCH_PAGE}
                                    />
                                )}
                            />
                        </div>
                        <p className="ud-text-sm">
                            {gettext(
                                'Sharpen your technical skills with real-world projects. No set-up required.',
                            )}
                        </p>
                    </div>
                    <Button
                        udStyle="link-underline"
                        size="medium"
                        typography="ud-text-sm"
                        onClick={this.onViewMoreClick}
                        styleName="labs-page-link"
                        componentClass="button"
                        data-purpose="view-more-labs-link"
                    >
                        {gettext('View all labs')}
                    </Button>
                </div>
                {this.props.error ? this.renderErrorState() : this.renderLabsCarousel(isMobile)}
            </>
        );
    }
}
