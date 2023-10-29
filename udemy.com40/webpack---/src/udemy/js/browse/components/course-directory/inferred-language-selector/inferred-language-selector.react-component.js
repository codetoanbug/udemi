import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {CompactFormGroup, Select} from '@udemy/react-form-components';
import PropTypes from 'prop-types';
import React from 'react';

import {SearchInferenceLanguageChangeEvent} from 'browse/events';

import styles from './inferred-language-selector.less';

const InferredLanguageSelector = ({
    backoffLanguages,
    queryLanguageInferenceTrackingId,
    ...props
}) => {
    const {gettext} = useI18n();
    function handleChange(event) {
        Tracker.publishEvent(
            new SearchInferenceLanguageChangeEvent(
                event.target.value,
                queryLanguageInferenceTrackingId,
            ),
        );
        event.target.form.dispatchEvent(new Event('submit', {cancelable: true}));
    }

    return backoffLanguages ? (
        <CompactFormGroup
            label={gettext('Showing first')}
            className={styles['inferred-language-selector']}
        >
            <Select
                name="bol"
                defaultValue={backoffLanguages.current_lang_option.key}
                form="filter-form"
                onChange={handleChange}
                {...props}
            >
                <option
                    key={backoffLanguages.current_lang_option.key}
                    value={backoffLanguages.current_lang_option.key}
                >
                    {backoffLanguages.current_lang_option.label}
                </option>
                {backoffLanguages.options.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </CompactFormGroup>
    ) : null;
};

InferredLanguageSelector.propTypes = {
    backoffLanguages: PropTypes.object,
    queryLanguageInferenceTrackingId: PropTypes.string,
};

InferredLanguageSelector.defaultProps = {
    backoffLanguages: undefined,
    queryLanguageInferenceTrackingId: undefined,
};

export default InferredLanguageSelector;
