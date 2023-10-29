import React from 'react';

import {FooterClientData, FooterServerData, FooterStore} from './footer.mobx-store';

interface FooterContextValue {
    footerStore: FooterStore;
    limitedConsumptionTrial: boolean;
}

const FooterContext = React.createContext<FooterContextValue | null>(null);

interface FooterContextProviderProps {
    clientProps?: FooterClientData;
    serverProps: FooterServerData;
    limitedConsumptionTrial: boolean;
    children: React.ReactNode;
}

export const FooterContextProvider = ({
    clientProps,
    serverProps,
    limitedConsumptionTrial,
    children,
}: FooterContextProviderProps) => {
    const [context] = React.useState<FooterContextValue>({
        footerStore: new FooterStore(serverProps, clientProps),
        limitedConsumptionTrial,
    });

    React.useEffect(() => {
        if (clientProps) {
            context.footerStore.updateClientData(clientProps);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientProps]);

    React.useEffect(() => {
        context.footerStore.updateServerData(serverProps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverProps]);

    return <FooterContext.Provider value={context}>{children}</FooterContext.Provider>;
};

export const useFooterContext = () => {
    const footerContext = React.useContext(FooterContext);
    if (!footerContext) {
        throw new Error('useFooterContext must be used within a FooterProvider.');
    }

    return footerContext;
};
