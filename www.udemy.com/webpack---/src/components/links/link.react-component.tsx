import React from 'react';

import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';

import {UFBNoticeClickEvent, UFBNoticeImpressionEvent} from '../ufb-notice/events';

export interface LinkProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    text_us_mx?: any;
    href?: string;
    text: string;
    feature_flag?: string;
    is_disabled?: boolean;
    open_in_new_tab?: boolean;
    data_purpose?: string;
    style?: React.CSSProperties;
}

export const Link = ({
    href,
    text,
    feature_flag,
    open_in_new_tab,
    data_purpose,
    style,
}: LinkProps) => {
    if (feature_flag === 'footer.links.business') {
        return <BusinessLink href={href} text={text} data_purpose={data_purpose} />;
    }

    let htmlProps = {};
    if (open_in_new_tab) {
        htmlProps = {
            target: '_blank',
            rel: 'noopener noreferrer',
        };
    }
    if (style) {
        htmlProps = {
            ...htmlProps,
            style,
        };
    }
    if (data_purpose) {
        htmlProps = {
            ...htmlProps,
            'data-purpose': data_purpose,
        };
    }

    return (
        <a className="link white-link ud-text-sm" href={href} {...htmlProps}>
            {text}
        </a>
    );
};

const BusinessLink = ({href, text, data_purpose}: LinkProps) => {
    const {locale} = useI18n();

    function trackImpression() {
        Tracker.publishEvent(
            new UFBNoticeImpressionEvent({
                locale,
                placement: 'footer',
                url: href,
            }),
        );
    }

    function handleClick() {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale,
                placement: 'footer',
            }),
        );
    }

    return (
        /* eslint-disable react/jsx-no-target-blank */
        /* this.props.href is always a business.udemy.com link.
         * We allow referrer for tracking purposes. */
        <TrackImpression trackFunc={trackImpression}>
            <a
                href={href}
                className="link white-link ud-text-sm"
                target="_blank"
                rel="noopener"
                data-purpose={data_purpose}
                onClick={handleClick}
            >
                {text}
            </a>
        </TrackImpression>
    );
};
