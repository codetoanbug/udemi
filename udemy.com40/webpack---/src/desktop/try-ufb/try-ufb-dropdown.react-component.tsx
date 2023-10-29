import {observer} from 'mobx-react';
import React from 'react';

import {UFBNoticeClickEvent, UFBNoticeVariant} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {useSiteStats, useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {HeaderButton, HeaderDropdown, HeaderMenu} from '../header-dropdown.react-component';
import styles from '../panel-menu.module.less';

interface TryUFBDropdownProps {
    className: string;
}

// TODO: Add UFB check here, and on dropdown
export const TryUFBDropdown = observer(({className}: TryUFBDropdownProps) => {
    const headerStore = useHeaderStore();
    const {Config} = useUDData();
    const {gettext, interpolate, locale} = useI18n();
    const siteStats = useSiteStats();

    const handleClick = () => {
        if (headerStore.tryUFBPlacements) {
            Tracker.publishEvent(
                new UFBNoticeClickEvent({
                    locale,
                    placement: headerStore.tryUFBPlacements?.bar,
                    variant: headerStore.userSpecificContext.ufbHookVariant as UFBNoticeVariant,
                    url: headerStore.userSpecificContext.productLink.url,
                }),
            );
        }
    };

    const copyText = interpolate(
        gettext('Get your team access to over %(count)s top Udemy courses, anytime, anywhere.'),
        {
            count: siteStats.getOrgNumericSiteStat('num_courses'),
        },
        true,
    );

    const ctaText = interpolate(
        gettext('Try %(product)s'),
        {product: headerStore.userSpecificContext.productLink.text},
        true,
    );

    const {productLink} = headerStore.userSpecificContext;
    const hasOrganization = Config.brand.has_organization;

    return !hasOrganization ? (
        <HeaderDropdown
            className={className}
            a11yRole="description"
            trigger={
                <HeaderButton
                    componentClass="a"
                    data-purpose="try-ufb-dropdown-trigger"
                    href={productLink.url}
                    target={productLink.isOnsiteRequestDemo ? undefined : '_blank'}
                    rel={productLink.isOnsiteRequestDemo ? undefined : 'noopener'}
                    onClick={handleClick}
                >
                    {gettext('Udemy Business')}
                </HeaderButton>
            }
        >
            <HeaderMenu>
                <div className={styles['panel']}>
                    <div
                        className={`ud-heading-lg ${styles['gap-bottom']}`}
                        data-purpose="hook-text"
                    >
                        {copyText}
                    </div>
                    <Button
                        componentClass="a"
                        data-purpose="try-ufb-button"
                        href={productLink.url}
                        className={styles['cta']}
                        target={productLink.isOnsiteRequestDemo ? undefined : '_blank'}
                        rel={productLink.isOnsiteRequestDemo ? undefined : 'noopener'}
                        onClick={handleClick}
                    >
                        {ctaText}
                    </Button>
                </div>
            </HeaderMenu>
        </HeaderDropdown>
    ) : null;
});
