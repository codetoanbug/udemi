import '@udemy/footer/dist/footer.global.css';

import {Footer, FooterData, FooterClientData, FooterServerData} from '@udemy/footer';
import React from 'react';

import loadCommonAppContext from 'common/load-common-app-context';
import {isomorphic} from 'utils/isomorphic-rendering';

export const FooterContainer = (props: FooterServerData) => {
    const [clientProps, setClientProps] = React.useState<FooterClientData>();

    React.useEffect(() => {
        loadCommonAppContext().then((result: {data: {footer: FooterData}}) => {
            setClientProps(result.data.footer);
        });
    }, []);

    return (
        <Footer
            clientProps={clientProps}
            serverProps={props}
            limitedConsumptionTrial={true}
            useLangPrefixedUrls={false}
        />
    );
};

export default isomorphic(FooterContainer);
