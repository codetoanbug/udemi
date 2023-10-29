import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {ModalLanguageSelector, LanguageSelectorButton} from '@udemy/language-selector';
import {Button} from '@udemy/react-core-components';
import {serverOrClient} from '@udemy/shared-utils';
import {useUDData} from '@udemy/ud-data';

import {LimitedConsumptionTrial} from '../../external/organization-trial/limited-consumption-trial/limited-consumption-trial.react-component';
import {useIsFeatureEnabled} from '../../external/utils/use-is-feature-enabled';
import {Links} from '../links/links.react-component';
import {Logos} from '../logos/logos.react-component';
import {TeachOnUdemyBanner} from '../teach-on-udemy-banner/teach-on-udemy-banner.react-component';
import {UFBNotice} from '../ufb-notice/ufb-notice.react-component';
import {FooterContextProvider, useFooterContext} from './footer-context';
import {FooterClientData, FooterServerData} from './footer.mobx-store';

interface FooterImplementationProps {
    useLangPrefixedUrls?: boolean;
}

const FooterImplementation = observer(({useLangPrefixedUrls = true}: FooterImplementationProps) => {
    const {footerStore, limitedConsumptionTrial} = useFooterContext();
    const {Config} = useUDData();
    const isFeatureEnabled = useIsFeatureEnabled();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    const shouldShowTeachBanner =
        isMounted &&
        !Config.brand.has_organization &&
        !footerStore.isJpFooter &&
        !serverOrClient.global.location.pathname.startsWith('/teaching/') &&
        !!footerStore.user &&
        !footerStore.user.has_instructor_intent;

    const shouldShowUfbNotice =
        !Config.brand.has_organization &&
        !footerStore.isJpFooter &&
        isFeatureEnabled('ufb_notices_footer.top_com') &&
        footerStore.ufbNotice.link &&
        footerStore.ufbNotice.placement;

    const ubIsLimitedConsumptionTrial =
        Config.brand.has_organization && Config.brand.organization.is_limited_consumption_trial;

    return (
        <footer
            className={classNames('ud-footer', {
                'ud-footer-initially-hidden': !!footerStore.hideFooterUntilContentReady,
                'ud-ufb-trial-footer': ubIsLimitedConsumptionTrial,
            })}
            data-purpose="footer"
        >
            {shouldShowTeachBanner && <TeachOnUdemyBanner />}
            {shouldShowUfbNotice && (
                <UFBNotice
                    link={footerStore.ufbNotice.link}
                    placement={footerStore.ufbNotice.placement ?? 'footer'}
                    isOnsiteRequestDemo={footerStore.ufbNotice.isOnsiteRequestDemo}
                />
            )}
            <div className="footer-section footer-section-main">
                <div className="links-and-language-selector">
                    <div className="language-selector-container">
                        <ModalLanguageSelector
                            uiRegion="footer"
                            useLangPrefixedUrls={useLangPrefixedUrls}
                            trigger={
                                <LanguageSelectorButton data-testid="language-selector-button" />
                            }
                        />
                    </div>
                    <Links linkColumns={footerStore.linkColumns} />
                </div>
                <div className="logo-and-copyright">
                    <div className="logo-container" data-testid="logo-container">
                        <Logos isJpFooter={footerStore.isJpFooter} />
                    </div>
                    {!footerStore.isJpFooter && (
                        <div className="copyright-container ud-text-xs">
                            {`\u00A9 ${new Date().getFullYear()} Udemy, Inc.`}
                        </div>
                    )}
                </div>
                {Config.brand.has_organization && Config.brand.organization.is_enterprise_china && (
                    <div className="sanjieke ud-text-xs">
                        <Button
                            componentClass="a"
                            udStyle="link"
                            className="white-link"
                            typography="ud-text-xs"
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010102005771"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                        >
                            {'京公网安备 11010102005771号'}
                        </Button>
                        <span className="spacing">{'ICP证：京B2-20190453'}</span>
                        <Button
                            componentClass="a"
                            udStyle="link"
                            typography="ud-text-xs"
                            className="white-link"
                            href="http://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                        >
                            {'京ICP备16034860号'}
                        </Button>
                    </div>
                )}
            </div>

            {isMounted && Config.brand.has_organization && (
                <div className="ud-ufb-fixed-message-container">
                    {ubIsLimitedConsumptionTrial && limitedConsumptionTrial && (
                        <LimitedConsumptionTrial />
                    )}
                </div>
            )}
        </footer>
    );
});

export interface FooterProps {
    clientProps?: FooterClientData;
    serverProps: FooterServerData;
    /**
     * If true, will show the limited consumption trial UI
     * @default false
     */
    limitedConsumptionTrial?: boolean;
    /**
     * If true, will add the language prefix to language selector navigation URLs (e.g. /fr/topic/python)
     * @default true
     */
    useLangPrefixedUrls?: boolean;
}

export const Footer = ({
    clientProps,
    serverProps,
    limitedConsumptionTrial = false,
    useLangPrefixedUrls = true,
}: FooterProps) => {
    return (
        <FooterContextProvider
            clientProps={clientProps}
            serverProps={serverProps}
            limitedConsumptionTrial={limitedConsumptionTrial}
        >
            <FooterImplementation useLangPrefixedUrls={useLangPrefixedUrls} />
        </FooterContextProvider>
    );
};
