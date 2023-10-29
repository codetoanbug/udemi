import {observer} from 'mobx-react';
import React from 'react';

import {AboveTheFoldProvider} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {UFBLogo} from '@udemy/react-brand-components';
import {Button} from '@udemy/react-core-components';

import {loadCommonAppContext} from '../external/load-common-app-context';
import {HeaderStore, HeaderStoreProps} from '../header.mobx-store';
import styles from './logged-out-header.module.less';

export const LoggedOutHeader = observer((props: HeaderStoreProps) => {
    const {gettext, locale} = useI18n();
    const [headerStore] = React.useState(() => new HeaderStore(props));

    React.useEffect(() => {
        loadCommonAppContext(locale, true).then((response) => {
            headerStore.setUserSpecificContext(response.data.header);
        });
    }, [headerStore, locale]);

    const {organizationState} = headerStore.userSpecificContext;

    return (
        <AboveTheFoldProvider>
            <div className={styles['header']}>
                <a href={headerStore.urls.BROWSE}>
                    <UFBLogo />
                </a>
                <div style={{flex: 1}} />
                {organizationState && (
                    <Button
                        size="medium"
                        udStyle="primary"
                        componentClass="a"
                        href={`/?next=${encodeURIComponent(window.location.href)}`}
                    >
                        {organizationState.is_forced_sso
                            ? gettext('Log in')
                            : gettext('Log in or sign up')}
                    </Button>
                )}
            </div>
        </AboveTheFoldProvider>
    );
});
