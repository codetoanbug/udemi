import {useI18n} from '@udemy/i18n';
import FilterIcon from '@udemy/icons/dist/filter.ud-icon';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {withRouter} from 'react-router-dom';

import FilterFormContext from '../filter-form-context';
import InferredLanguageSelector from '../inferred-language-selector/inferred-language-selector.react-component';
import Sort from '../sort/sort.react-component';
import styles from './filter-button-container.less';

const getFilterCount = (aggregations) =>
    aggregations.reduce(
        (acc, {options}) =>
            acc + options.reduce((_acc, {selected = false}) => (selected ? _acc + 1 : _acc), 0),
        0,
    );

export const FilterButton = ({filterId, numFiltersApplied}) => {
    const {gettext} = useI18n();
    const {hideNumFiltersApplied} = useContext(FilterFormContext);
    const [filterPanelDisplayed, setFilterPanelDisplayed] = useState(true);
    const onClickCallback = useCallback(() => {
        setFilterPanelDisplayed(!filterPanelDisplayed);
    }, [filterPanelDisplayed, setFilterPanelDisplayed]);
    const ariaLabelClose = useMemo(() => {
        return ninterpolate(
            'Close filter panel (%(count)s currently applied)',
            'Close filter panel (%(count)s currently applied)',
            numFiltersApplied,
            {count: numFiltersApplied},
        );
    }, [numFiltersApplied]);
    const ariaLabelOpen = useMemo(() => {
        return ninterpolate(
            'Open filter panel (%(count)s currently applied)',
            'Open filter panel (%(count)s currently applied)',
            numFiltersApplied,
            {count: numFiltersApplied},
        );
    }, [numFiltersApplied]);
    const ariaLabel = filterPanelDisplayed ? ariaLabelClose : ariaLabelOpen;
    return (
        <Button
            udStyle="secondary"
            onClick={onClickCallback}
            cssToggleId={filterId}
            data-purpose="open-filters"
            aria-label={ariaLabel}
        >
            <FilterIcon label={false} />
            {gettext('Filter')}
            {!hideNumFiltersApplied && numFiltersApplied > 0 ? `(${numFiltersApplied})` : null}
        </Button>
    );
};

FilterButton.propTypes = {
    filterId: PropTypes.string.isRequired,
    numFiltersApplied: PropTypes.number.isRequired,
};

export const _ClearFiltersButton = ({aggregations, numFiltersApplied, history, location}) => {
    function handleClearFiltersClick() {
        const searchParams = new URLSearchParams(location.search);
        aggregations.forEach(({key, options}) => {
            switch (key) {
                case 'language':
                    searchParams.delete(options[0].key); // 'lang'
                    break;
                case 'features':
                    options.forEach(({key}) => searchParams.delete(key)); // 'has_closed_caption', 'has_simple_quiz', 'has_coding_exercises', 'has_practice_test', 'has_workspace'
                    break;
                default:
                    searchParams.delete(key);
            }
        });
        searchParams.sort();
        history.push({...location, search: searchParams.toString()});
    }

    const shouldShow = useMemo(
        () => (numFiltersApplied ? numFiltersApplied > 0 : getFilterCount(aggregations) > 0),
        [aggregations, numFiltersApplied],
    );

    const {gettext} = useI18n();

    return (
        shouldShow && (
            <Button
                udStyle="ghost"
                className={classNames('ud-link-neutral', styles['filter-clear'])}
                onClick={handleClearFiltersClick}
                data-purpose="clear-filters"
                aria-label={gettext('Clear applied filters')}
            >
                {gettext('Clear filters')}
            </Button>
        )
    );
};

_ClearFiltersButton.displayName = 'ClearFiltersButton';

export const ClearFiltersButton = withRouter(_ClearFiltersButton);

ClearFiltersButton.propTypes = {
    aggregations: PropTypes.array.isRequired,
};

const FilterButtonContainer = ({
    aggregations,
    sortOptions,
    backoffLanguages,
    queryLanguageInferenceTrackingId,
}) => {
    const searchParams = new URLSearchParams(location.search);
    const shouldShowBackoffLanguages = !searchParams.has('lang');
    const numFiltersApplied = useMemo(() => getFilterCount(aggregations), [aggregations]);
    return (
        <div className={styles['button-bar']}>
            <FilterButton
                aggregations={aggregations}
                filterId="filter-button"
                numFiltersApplied={numFiltersApplied}
            />
            {sortOptions && <Sort sortOptions={sortOptions} />}
            {backoffLanguages && shouldShowBackoffLanguages && (
                <InferredLanguageSelector
                    backoffLanguages={backoffLanguages}
                    queryLanguageInferenceTrackingId={queryLanguageInferenceTrackingId}
                />
            )}
            <ClearFiltersButton aggregations={aggregations} numFiltersApplied={numFiltersApplied} />
        </div>
    );
};

FilterButtonContainer.propTypes = {
    aggregations: PropTypes.array.isRequired,
    sortOptions: PropTypes.object.isRequired,
    backoffLanguages: PropTypes.object,
    queryLanguageInferenceTrackingId: PropTypes.string,
};

FilterButtonContainer.defaultProps = {
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
};

export default FilterButtonContainer;
