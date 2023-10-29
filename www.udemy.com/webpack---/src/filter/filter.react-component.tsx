import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Checkbox} from '@udemy/react-form-components';
import {Tooltip} from '@udemy/react-popup-components';
import {Accordion} from '@udemy/react-reveal-components';
import {ShowMore} from '@udemy/react-reveal-components';

import {FilterAggregationOption} from '../types';
import {DomainFilterStore, LanguageFilterStore} from './filter.mobx-store';
import styles from './filter.module.less';

/*
TODO: localization with interpolate, option value?, tooltip text
 */

const InfoTooltip = ({infoTooltipText}: {infoTooltipText: string}) => {
    return (
        <Tooltip
            trigger={<InfoOutlineIcon />}
            className={styles['title-icon']}
            canToggleOnHover={true}
            detachFromTarget={true}
        >
            {infoTooltipText}
        </Tooltip>
    );
};
export interface FilterOptionProps {
    option: FilterAggregationOption;
    checked: boolean;
    handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Option = ({option, checked, handleOnChange}: FilterOptionProps) => {
    const {key, value, isVisible, infoTooltipText} = option;
    const willBeRendered = isVisible !== undefined && isVisible !== null ? isVisible : true;
    return willBeRendered ? (
        <Checkbox key={key} value={value} onChange={handleOnChange} checked={checked}>
            {value}
            {infoTooltipText && <InfoTooltip infoTooltipText={infoTooltipText} />}
        </Checkbox>
    ) : null;
};

export interface FilterBorderProps {
    hasBottomBorder?: boolean;
    hasTopBorder?: boolean;
}

export interface FilterProps extends FilterBorderProps {
    title: string;
    infoTooltipText?: string;
    showMoreDefaultExpanded?: boolean;
    panelDefaultExpanded?: boolean;
    filterStore: DomainFilterStore | LanguageFilterStore;
}

export const Filter = observer(
    ({
        title,
        infoTooltipText,
        hasBottomBorder = false,
        hasTopBorder = false,
        showMoreDefaultExpanded = false,
        panelDefaultExpanded = true,
        filterStore,
    }: FilterProps) => {
        const style = hasBottomBorder
            ? {borderTop: 'none'}
            : hasTopBorder
            ? {borderBottom: 'none'}
            : {};
        const accordionTitle = infoTooltipText ? (
            <>
                {title}
                <InfoTooltip infoTooltipText={infoTooltipText} />
            </>
        ) : (
            title
        );
        return (
            <form data-testid="opportunity-filter">
                <Accordion.Panel
                    style={style}
                    key={title}
                    title={accordionTitle}
                    defaultExpanded={panelDefaultExpanded}
                >
                    <ShowMore
                        collapsedHeight={150}
                        defaultExpanded={showMoreDefaultExpanded}
                        withGradient={true}
                    >
                        {filterStore.options.map((option) => {
                            return (
                                <Option
                                    key={option.key}
                                    option={option}
                                    checked={filterStore.isChecked(option)}
                                    handleOnChange={() =>
                                        filterStore.toggleCheckedOptions(option.key)
                                    }
                                />
                            );
                        })}
                    </ShowMore>
                </Accordion.Panel>
            </form>
        );
    },
);

export interface LanguageFilterProps extends FilterBorderProps {
    filterStore: LanguageFilterStore;
}

export const LanguageFilter = ({
    filterStore,
    hasBottomBorder = false,
    hasTopBorder = false,
}: LanguageFilterProps) => {
    const {gettext} = useI18n();
    return (
        <Filter
            title={gettext('Course languages')}
            hasBottomBorder={hasBottomBorder}
            hasTopBorder={hasTopBorder}
            filterStore={filterStore}
        />
    );
};

export interface DomainFilterProps extends FilterBorderProps {
    filterStore: DomainFilterStore;
}

export const DomainFilter = ({
    filterStore,
    hasBottomBorder = false,
    hasTopBorder = false,
}: DomainFilterProps) => {
    const {gettext} = useI18n();
    return (
        <Filter
            title={gettext('Domain')}
            hasBottomBorder={hasBottomBorder}
            hasTopBorder={hasTopBorder}
            filterStore={filterStore}
        />
    );
};
