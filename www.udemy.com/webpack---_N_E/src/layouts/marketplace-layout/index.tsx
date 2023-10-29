import {observer} from 'mobx-react';
import React from 'react';

import {TrackerInitializer} from '@udemy/event-tracking';
import {Footer} from '@udemy/footer';
import {Header} from '@udemy/react-header';
import {Toaster} from '@udemy/react-messaging-components';

import {useRootStore} from 'src/contexts/root-store-context';

import styles from './marketplace-layout.module.less';

export const getMarketplaceLayout = (page: React.ReactElement) => {
    return <MarketplaceLayout>{page}</MarketplaceLayout>;
};

const MarketplaceLayout = observer(({children}: {children: React.ReactElement}) => {
    const rootStore = useRootStore();

    return (
        <>
            {/* TODO: remove SmartBar rendering from Header component, re-add it here */}
            {/* <SmartBar /> */}
            <div className={styles['container']}>
                <Header {...rootStore.headerData} />
                <main className={styles['content']} id="main-content-anchor">
                    {children}
                </main>
                <Footer
                    clientProps={rootStore.footerData}
                    serverProps={rootStore.footerData}
                    limitedConsumptionTrial={true}
                    useLangPrefixedUrls={true}
                />
                <Toaster />
            </div>
            <TrackerInitializer />
        </>
    );
});
