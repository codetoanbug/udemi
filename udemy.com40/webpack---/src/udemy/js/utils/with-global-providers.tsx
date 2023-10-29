import {CoursePriceStore} from '@udemy/browse-course';
import {CompactTranslations, I18nProvider} from '@udemy/i18n';
import {StoreProvider, StoreType} from '@udemy/store-provider';
import {UDData, UDDataProvider} from '@udemy/ud-data';
import propTypes from 'prop-types';
import React, {useState} from 'react';

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let _STORES: InstanceType<StoreType>[];
}

interface ComponentWithProvidersProps {
    translations: CompactTranslations;
    udData: UDData;
    stores: InstanceType<StoreType>[];
}

export const withGlobalProviders = <TProps,>(Component: React.ComponentType<TProps>) => {
    const ComponentWithProviders = ({
        translations,
        udData,
        ...props
    }: TProps & ComponentWithProvidersProps) => {
        const locale = udData.request.locale ?? 'en_US';
        const lang = udData.request.language ?? 'en';
        const [coursePriceStore] = useState(() => new CoursePriceStore());
        const stores = [coursePriceStore];
        return (
            <I18nProvider locale={locale} lang={lang} translations={translations}>
                <UDDataProvider data={udData} useBridge={true}>
                    <StoreProvider stores={stores}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Component {...(props as any)} />
                    </StoreProvider>
                </UDDataProvider>
            </I18nProvider>
        );
    };
    ComponentWithProviders.propTypes = {
        ...Component.propTypes,
        udData: propTypes.object.isRequired,
        translations: propTypes.object.isRequired,
    };
    ComponentWithProviders.displayName = `${
        Component.displayName ?? Component.name
    }WithGlobalProviders`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentWithProviders.isIsomorphicComponent = (Component as any).isIsomorphicComponent;

    // Used by ud-render-react-components to determine whether or not to pass udData and
    // translations to component
    ComponentWithProviders.hasGlobalProviders = true;

    return ComponentWithProviders;
};

export function createGlobalStores() {
    Object.assign(globalThis, {
        _STORES: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CoursePriceStore: new CoursePriceStore(),
        },
    });
}

// For unit test purposes only
export function clearGlobalStores() {
    Object.assign(globalThis, {
        _STORES: undefined,
    });
}

export function getGlobalStore(storeName: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalStores = (globalThis as any)._STORES;
    return globalStores[storeName as keyof typeof globalStores];
}
