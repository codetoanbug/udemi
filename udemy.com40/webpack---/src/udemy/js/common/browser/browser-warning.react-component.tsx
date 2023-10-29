// This file must work on legacy browsers.
// Be careful about invoking code, especially from other files, that e.g. relies on URLSearchParams.
import {AlertBannerContent} from '@udemy/react-messaging-components';
import React from 'react';
import ReactDOM from 'react-dom';

import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import isModernBrowser from './is-modern-browser';
import './browser-warning.global.less';

export function BrowserWarning() {
    const udConfig = getConfigData();
    return (
        <AlertBannerContent
            udStyle="warning"
            title={gettext('It looks like you are using an outdated browser')}
            body={gettext(
                'Udemy no longer supports this browser. This website may not work as intended.',
            )}
            dismissButtonProps={false}
            ctaText={gettext('System requirements')}
            actionButtonProps={{
                componentClass: 'a',
                href: udLink.toSupportLink('system_requirements', udConfig.brand.has_organization),
                target: '_blank',
                rel: 'noopener noreferrer',
            }}
        />
    );
}

export function checkModernBrowser() {
    if (!isModernBrowser()) {
        const containerClassName = 'ud-component--browser-warning--browser-warning';
        const pageContainer = document.querySelector('.ud-main-content-wrapper');
        if (pageContainer && !pageContainer.querySelector(`.${containerClassName}`)) {
            const container = document.createElement('div');
            container.className = `udlite-in-udheavy ${containerClassName}`;
            pageContainer.insertBefore(container, pageContainer.childNodes[0]);
            ReactDOM.render(React.createElement(BrowserWarning, {}), container);
        }
    }
}
