import {ClientSideRender} from '@udemy/design-system-utils';
import {LocalizedHtml} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import React from 'react';

import {useAsyncFeature, FeatureContext} from 'course-landing-page/feature-context';
import udLink from 'utils/ud-link';

import {AFFILIATES} from './constants';

import './affiliate-branding.less';

interface AffiliateBrandingProps {
    asyncFeatureContext: Promise<FeatureContext>;
}
export const AffiliateBranding = observer(({asyncFeatureContext}: AffiliateBrandingProps) => {
    const isEnabled = useAsyncFeature(asyncFeatureContext, 'affiliateBranding')?.enabled ?? false;
    const referrerHostname = document?.referrer && new URL(document?.referrer).hostname;
    const affiliate =
        referrerHostname && Object.values(AFFILIATES).find((a) => a.url === referrerHostname);
    return isEnabled && affiliate ? (
        <ClientSideRender placeholder={null}>
            <div className="component-margin">
                <div styleName="affiliate-branding" data-purpose="affiliate-branding">
                    <div styleName="affiliate-branding__logo">
                        <Image
                            src={udLink.toStorageStaticAsset(affiliate.logoPath)}
                            alt={affiliate.name}
                            width={64}
                            height={64}
                        />
                    </div>

                    <div styleName="affiliate-branding__title">
                        <LocalizedHtml
                            html={interpolate(
                                gettext('As recommended on <strong>%(name)s</strong>'),
                                {name: affiliate.name},
                                true,
                            )}
                            interpolate={{}}
                        />
                    </div>
                </div>
            </div>
        </ClientSideRender>
    ) : null;
});
