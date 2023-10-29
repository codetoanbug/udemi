import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {Autosuggest, AUTOSUGGEST_LOADING_STATE} from '@udemy/react-autosuggest-components';
import {IconButton} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import {SearchFormAutocompleteStore, boldSearchTerms} from '@udemy/search-form-autocomplete';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './search-my-courses-field.less';

const SearchMyCoursesField = (props) => {
    const [store] = React.useState(() => {
        return new SearchFormAutocompleteStore({
            url: '/courses/my-courses-search-suggestions/',
            gettext,
        });
    });

    const onSubmit = (event) => {
        event.preventDefault();
        store.searchPhrase && props.onSubmit(store.searchPhrase);
    };

    const renderSuggestions = (suggestions, renderSuggestion) => (
        <ul className="ud-unstyled-list" styleName="menu">
            {suggestions.map((suggestion, index) => (
                <li key={index}>
                    {renderSuggestion(
                        index,
                        <span
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'search-my-courses-field:result',
                                html: boldSearchTerms(suggestion.label, store.inputValue),
                            })}
                        />,
                        {
                            componentClass: 'a',
                            'aria-label': suggestion.ariaLabel,
                            href: suggestion.link,
                            typography: 'ud-text-sm',
                        },
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <form styleName="form" onSubmit={onSubmit}>
            <FormGroup label={gettext('Search my courses')} labelProps={{className: 'ud-sr-only'}}>
                <div styleName="search-field">
                    <Autosuggest
                        autosuggestStore={store}
                        noResultsContent={gettext('No matches found')}
                        placeholder={gettext('Search my courses')}
                        size="medium"
                        value={store.searchPhrase}
                        renderSuggestions={renderSuggestions}
                        styleName="autosuggest"
                    />
                    <IconButton size="medium" type="submit">
                        {store.loadingState === AUTOSUGGEST_LOADING_STATE.LOADING ? (
                            <Loader color="inherit" />
                        ) : (
                            <SearchIcon label={gettext('Search')} />
                        )}
                    </IconButton>
                </div>
            </FormGroup>
        </form>
    );
};

SearchMyCoursesField.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default observer(SearchMyCoursesField);
