import {useI18n} from '@udemy/i18n';
import {CompactFormGroup, Select} from '@udemy/react-form-components';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import FilterFormContext from '../filter-form-context';

const Sort = ({sortOptions, ...props}) => {
    const {gettext} = useI18n();
    function handleChange(event) {
        event.target.form.dispatchEvent(new Event('submit', {cancelable: true}));
    }
    let filteredSortOptions = sortOptions;
    const {hiddenSortOptions = []} = useContext(FilterFormContext);
    if (hiddenSortOptions) {
        filteredSortOptions = {
            ...sortOptions,
            options: sortOptions.options.filter(({key}) => !hiddenSortOptions.includes(key)),
        };
    }

    const getLabel = (sortOption) => {
        // TODO: move this change to the backend
        // AllCoursesDiscoveryUnitViewSet.default_sort_option
        return sortOption.key === 'popularity' ? gettext('Most Popular') : sortOption.label;
    };

    return (
        <CompactFormGroup label={gettext('Sort by')}>
            <Select
                name="sort"
                defaultValue={filteredSortOptions.current_sort_option.key}
                form="filter-form"
                onChange={handleChange}
                {...props}
            >
                <option
                    key={filteredSortOptions.current_sort_option.key}
                    value={filteredSortOptions.current_sort_option.key}
                >
                    {getLabel(filteredSortOptions.current_sort_option)}
                </option>
                {filteredSortOptions.options.map((option) => (
                    <option key={option.key} value={option.key}>
                        {getLabel(option)}
                    </option>
                ))}
            </Select>
        </CompactFormGroup>
    );
};

Sort.propTypes = {
    sortOptions: PropTypes.object.isRequired,
};

export default Sort;
