import {observer} from 'mobx-react';
import React from 'react';

import {OneTrustFooterLink} from '@udemy/onetrust';
import {useUDData} from '@udemy/ud-data';

import {useIsFeatureEnabled} from '../../external/utils/use-is-feature-enabled';
import {Link, LinkProps} from './link.react-component';

export interface LinksProps {
    linkColumns: LinkProps[][];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ImprintContactItem = observer(({style, ...props}: LinkProps) => {
    const {me, Config} = useUDData();

    // This happens to work because `UD.Config.marketplace_country` and `UD.me` are updated at
    // the same time by `loadGlobalMeContext`. We should probably move all user-specific data
    // from `UD.Config` to `UD.request`, and set up the latter to be a proxy like `UD.me`.
    if (me.isLoading || Config.marketplace_country.id !== 'DE') {
        return null;
    }

    return (
        <li>
            <Link {...props} />
        </li>
    );
});

export const Links = ({linkColumns}: LinksProps) => {
    const isFeatureEnabled = useIsFeatureEnabled();

    return (
        <>
            {linkColumns.map((linkColumn, i) => {
                return (
                    <ul className="ud-unstyled-list link-column" key={i}>
                        {linkColumn.map((linkProps, i) => {
                            if (linkProps.data_purpose === 'footer-imprint-contact') {
                                return <ImprintContactItem key={i} {...linkProps} />;
                            } else if (
                                linkProps.data_purpose === 'footer.links.cookie_preferences'
                            ) {
                                return <OneTrustFooterLink key={i} {...linkProps} />;
                            }

                            const shouldRender = linkProps.feature_flag
                                ? isFeatureEnabled(linkProps.feature_flag)
                                : !linkProps.is_disabled;
                            if (shouldRender) {
                                return (
                                    <li key={i}>
                                        <Link {...linkProps} />
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                );
            })}
        </>
    );
};
