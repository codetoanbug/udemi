import {observer} from 'mobx-react';
import React from 'react';

import {Accordion} from '@udemy/react-reveal-components';

import {DomainFilter, LanguageFilter} from '../filter/filter.react-component';
import {FilterMenuStore} from './filter-menu.mobx-store';
import styles from './filter-menu.module.less';

export interface QueryParams {
    l?: string;
    d?: string;
    c?: string;
    p?: string;
    size?: string;
}

export interface FilterMenuProps {
    store: FilterMenuStore;
    isDomainFilterVisible?: boolean;
    isVisible?: boolean;
}
export const FilterMenu = observer(
    ({store, isDomainFilterVisible = true, isVisible = true}: FilterMenuProps) => {
        return (
            <div
                data-testid="filter-menu"
                className={isVisible ? styles['filter-menu'] : styles['filter-menu-hide']}
            >
                <Accordion>
                    <LanguageFilter
                        filterStore={store.languageFilterStore}
                        hasBottomBorder={true}
                    />
                    {isDomainFilterVisible && (
                        <DomainFilter filterStore={store.domainFilterStore} hasTopBorder={true} />
                    )}
                </Accordion>
            </div>
        );
    },
);
