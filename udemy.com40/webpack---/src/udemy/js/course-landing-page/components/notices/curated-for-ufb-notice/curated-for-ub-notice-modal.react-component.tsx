import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {toBusinessUdemy} from '@udemy/organization';
import {Image, Button} from '@udemy/react-core-components';
import {Modal, ModalProps} from '@udemy/react-dialog-components';
import React from 'react';

import TopCompaniesNotice from 'browse/components/notices/top-companies-notice.react-component';
import {UFBNoticeClickEvent, UFBNoticeImpressionEvent} from 'browse/events';
import getRequestData from 'utils/get-request-data';
import {ubLogoUrl} from 'utils/udemy-logo-urls';

import badge from './badge.svg';
import styles from './curated-for-ub-notice-modal.less';
import teach from './teach.jpg';

interface CuratedForUBNoticeModalProps extends ModalProps {
    ubLinkParams: {
        ref: string;
        mx_pg: string;
    };
}

export const CuratedForUBNoticeModal = ({
    ubLinkParams,
    ...modalProps
}: CuratedForUBNoticeModalProps) => {
    const ubUrlForEventTracking = toBusinessUdemy('request-demo').split('?')[0];
    const trackImpression = () => {
        Tracker.publishEvent(
            new UFBNoticeImpressionEvent({
                locale: getRequestData().locale,
                placement: 'UBNoticeModal',
                url: ubUrlForEventTracking,
            }),
        );
    };
    const handleOnClick = () => {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                placement: 'UBNoticeModal',
                url: ubUrlForEventTracking,
            }),
        );
    };
    return (
        <Modal
            {...modalProps}
            styleName="modal"
            title="Udemy Business Collection"
            renderTitle={() => ['curated-for-ufb-notice-modal-title', null]}
        >
            <div styleName="top-section">
                <Image src={badge} alt="" height={39} width={32} />
                <h1 className="ud-heading-serif-xxl">{gettext('Learn from our very best')}</h1>
                <div className="ud-text-lg">
                    {gettext(
                        'Our Udemy Business collection is a curation of top-rated courses for individuals and organizations to upskill and reach their goals.',
                    )}
                </div>
                <Image styleName="teach-image" src={teach} alt="" height={151} width={151} />
                <h2 className="ud-heading-lg">{gettext('Always fresh')}</h2>
                <div>
                    {gettext(
                        'We add to the collection based on market trends and feedback from learners and their organizations.',
                    )}
                </div>
                <h2 className="ud-heading-lg">{gettext('Data driven')}</h2>
                <div>
                    {gettext(
                        'We curate the collection based on unique data points to identify new and emerging skills.',
                    )}
                </div>
                <h2 className="ud-heading-lg">{gettext('Better every day')}</h2>
                <div>
                    {gettext(
                        'We continuously refine the collection to help learners and businesses stay one step ahead.',
                    )}
                </div>
            </div>
            <hr />
            <TrackImpression trackFunc={trackImpression}>
                <div styleName="bottom-section">
                    <Image
                        src={ubLogoUrl}
                        alt="Udemy Business"
                        width={130}
                        height={22}
                        data-purpose="udemy-for-business-logo"
                    />
                    <h3 className="ud-heading-md">
                        {gettext('Trusted by organizations of all sizes')}
                    </h3>
                    <div styleName="top-companies-logos-container">
                        {TopCompaniesNotice.renderLogos({
                            className: styles['top-companies-logos'],
                            imageHeight: 44,
                        })}
                    </div>
                    <Button
                        componentClass="a"
                        href={toBusinessUdemy('request-demo', ubLinkParams)}
                        target="_blank"
                        rel="noopener noreferrer"
                        udStyle="brand"
                        size="large"
                        styleName="learn-more"
                        onClick={handleOnClick}
                        data-purpose="learn-more"
                    >
                        {gettext('Try Udemy Business')}
                    </Button>
                </div>
            </TrackImpression>
        </Modal>
    );
};
