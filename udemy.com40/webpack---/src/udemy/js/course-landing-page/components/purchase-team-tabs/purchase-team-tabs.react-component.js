import {Tracker, TrackImpression} from '@udemy/event-tracking';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {BlockList, Image} from '@udemy/react-core-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {useMatchMedia} from 'base-components/responsive/match-media.react-component';
import Tabs from 'base-components/tabs/tabs.react-component';
import {UFBNoticeImpressionEvent} from 'browse/events';
import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {getOrgNumericSiteStat} from 'utils/site-stats';
import {ubLogoUrl, ubLogoInvertedUrl} from 'utils/udemy-logo-urls';

import {TABS} from './constants';
import PrimaryHookButton from './primary-hook-button.react-component';

import './purchase-team-tabs.less';

export function UdemyForBusinessTabContent({primaryLink, buttonText}) {
    // See .less file, on tablet we have a dark background and thus need to invert the logo
    // @media (min-width: @breakpoint-md-min) and (max-width: @breakpoint-paid-clp-md-max) {
    const hasDarkBackground = useMatchMedia('(min-width: 701px) and (max-width: 1079px)');

    const trackImpression = () => {
        Tracker.publishEvent(
            new UFBNoticeImpressionEvent({
                placement: 'PurchaseSection',
                url: primaryLink.split('?')[0],
            }),
        );
    };

    return (
        <div styleName="ufb-tab">
            <Image
                isAboveTheFold={true}
                src={hasDarkBackground ? ubLogoInvertedUrl : ubLogoUrl}
                alt="Udemy Business"
                width={141}
                height={24}
                styleName="logo"
            />
            <p className="ud-text-sm dark-bg-text">
                {/* note 'top‑rated' uses a non-breaking hyphen '‑' and not a regular hyphen '-' */}
                {interpolate(
                    gettext(
                        'Subscribe to this course and %(courseCount)s+ top‑rated Udemy courses for your organization.',
                    ),
                    {courseCount: getOrgNumericSiteStat('num_courses').toLocaleString()},
                    true,
                )}
            </p>
            <TrackImpression trackFunc={trackImpression}>
                <div styleName="button-container">
                    <PrimaryHookButton
                        link={primaryLink}
                        placement="PurchaseSection"
                        buttonText={buttonText}
                    />
                </div>
            </TrackImpression>

            <BlockList size="small" iconAlignment="left">
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {gettext('For teams of 5 or more users')}
                </BlockList.Item>
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {interpolate(
                        gettext('%(courseCount)s+ fresh & in-demand courses'),
                        {courseCount: getOrgNumericSiteStat('num_courses').toLocaleString()},
                        true,
                    )}
                </BlockList.Item>
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {gettext('Learning Engagement tools')}
                </BlockList.Item>
                <BlockList.Item icon={<TickIcon label={false} />}>
                    {gettext('SSO and LMS Integrations')}
                </BlockList.Item>
            </BlockList>
        </div>
    );
}

UdemyForBusinessTabContent.propTypes = {
    primaryLink: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
};

function PurchaseTeamTabs({primaryLink, selectedTab, onChange, buttonText, children}) {
    const deviceType = getDeviceType();
    return (
        <div
            styleName={classNames('purchase-team-tabs', {
                'purchase-team-tabs-desktop': deviceType !== DEVICE_TYPE_MOBILE,
            })}
        >
            <Tabs fullWidth={true} onSelect={onChange} activeTabId={selectedTab}>
                <Tabs.Tab id={TABS.PERSONAL} title={gettext('Personal')}>
                    {children}
                </Tabs.Tab>
                <Tabs.Tab id={TABS.TEAMS} title={gettext('Teams')}>
                    <UdemyForBusinessTabContent primaryLink={primaryLink} buttonText={buttonText} />
                </Tabs.Tab>
            </Tabs>
        </div>
    );
}

PurchaseTeamTabs.propTypes = {
    primaryLink: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    selectedTab: PropTypes.oneOf([TABS.PERSONAL, TABS.TEAMS]),
    buttonText: PropTypes.string,
};

PurchaseTeamTabs.defaultProps = {
    onChange: () => null,
    selectedTab: TABS.PERSONAL,
    buttonText: '',
};

export default PurchaseTeamTabs;
