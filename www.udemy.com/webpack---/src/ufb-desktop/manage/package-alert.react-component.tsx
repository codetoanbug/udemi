import {observer} from 'mobx-react';
import React from 'react';

import {LocalizedHtml, useI18n} from '@udemy/i18n';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button} from '@udemy/react-core-components';
import {escapeHtml} from '@udemy/shared-utils';
import {useUDData} from '@udemy/ud-data';

import {
    HeaderButton,
    HeaderDropdown,
    HeaderMenu,
} from '../../desktop/header-dropdown.react-component';
import menuStyles from '../../desktop/panel-menu.module.less';
import {useHeaderStore} from '../../hooks/use-header-store';
import styles from './package-alert.module.less';

export const PackageAlert = observer(() => {
    const headerStore = useHeaderStore();
    const {gettext, ngettext, interpolate, locale} = useI18n();
    const {Config} = useUDData();

    const {organizationState} = headerStore.userSpecificContext;
    const packageAlert = organizationState?.package_alert || {};

    let ctaProps: Record<string, string> = {};
    let headline, packageMessage, cta;
    if (packageAlert.is_suspended) {
        ctaProps = {
            href: 'mailto:success@udemy.com',
            target: '_blank',
            rel: 'noopener noreferrer',
        };
        if (packageAlert.is_subscription) {
            packageMessage = gettext('Your subscription ended on <b>%(endDate)s</b>.');
        } else if (packageAlert.is_free_trial) {
            packageMessage = gettext('Your free trial ended on <b>%(endDate)s</b>.');
        }
        if (packageMessage) {
            const product = Config.brand.product_name;
            headline = interpolate(gettext('Your %(product)s account expired.'), {product}, true);
            const ctaText = `${packageMessage} ${gettext(
                'You need to subscribe to a paid plan to continue. ' +
                    'Please contact the %(product)s Customer Success team at ' +
                    '<a class="link">success@udemy.com</a>.',
            )}`;
            const userLocale = locale.replace('_', '-') || 'en-US';
            const endDate = new Date(packageAlert.end_date as string).toLocaleDateString(
                userLocale,
            );
            cta = (
                <LocalizedHtml
                    className="ud-text-md"
                    html={interpolate(
                        ctaText,
                        {endDate: escapeHtml(endDate), product: escapeHtml(product)},
                        true,
                    )}
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    interpolate={{link: <a {...ctaProps} />}}
                />
            );
        }
    } else if (packageAlert.is_almost_suspended) {
        if (packageAlert.is_subscription) {
            packageMessage = ngettext(
                'You have only %(count)s day left in your subscription.',
                'You have only %(count)s days left in your subscription.',
                packageAlert.days_left as number,
            );
        } else if (packageAlert.is_free_trial) {
            packageMessage = ngettext(
                'You have only %(count)s day left in your free trial.',
                'You have only %(count)s days left in your free trial.',
                packageAlert.days_left as number,
            );
        }
        if (packageMessage) {
            headline = interpolate(packageMessage, {count: packageAlert.days_left}, true);
            if (packageAlert.is_team_plan) {
                ctaProps = {href: '/organization-manage/settings/billing/'};
                cta = (
                    <Button
                        {...ctaProps}
                        to={ctaProps.href}
                        componentClass="a"
                        className={menuStyles['cta']}
                    >
                        {gettext('Set up auto-renewal')}
                    </Button>
                );
            }
        }
    }

    if (!headline) {
        return null;
    }

    return (
        <HeaderDropdown
            a11yRole="description"
            className={styles['package-alert']}
            trigger={
                <HeaderButton
                    {...ctaProps}
                    componentClass={ctaProps.href ? 'a' : 'button'}
                    udStyle="icon"
                    data-testid="header-button"
                >
                    <WarningIcon color="warning" label={gettext('Warning')} />
                </HeaderButton>
            }
        >
            <HeaderMenu>
                <div className={`${menuStyles['panel']} ${styles['panel']}`}>
                    <div className={`ud-heading-lg ${cta ? menuStyles['gap-bottom'] : ''}`}>
                        {headline}
                    </div>
                    {cta}
                </div>
            </HeaderMenu>
        </HeaderDropdown>
    );
});
