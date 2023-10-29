import {withI18n} from '@udemy/i18n';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ShareAutocompleteResult, {
    getSuggestionText,
} from './share-autocomplete-result.react-component';
import styles from './share-autocomplete.less';

@observer
class InternalShareAutoComplete extends Component {
    static propTypes = {
        onSuggestionSelected: PropTypes.func.isRequired,
        onInputChange: PropTypes.func.isRequired,
        onCleanup: PropTypes.func.isRequired,
        store: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    renderSuggestions = (suggestions, renderSuggestion) => {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {renderSuggestion(
                            index,
                            <ShareAutocompleteResult
                                suggestion={suggestion}
                                query={this.props.store.cleanInputValue}
                            />,
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    onChange = (event) => {
        this.props.onInputChange(event.target.value);
    };

    onSuggestionSelected = (suggestion) => {
        const {prefix, valueWithoutPrefix} = getSuggestionText(suggestion);
        const value = prefix + valueWithoutPrefix;
        this.props.onInputChange(value);
        this.props.store.setInputValue(value);
        this.props.onSuggestionSelected(suggestion);
    };

    onClearInput = () => {
        this.props.store.reset();
        this.props.onCleanup();
    };

    render() {
        const {gettext} = this.props;
        return (
            <Autosuggest
                onChange={this.onChange}
                autosuggestStore={this.props.store}
                renderSuggestions={this.renderSuggestions}
                noResultsContent={gettext('Channel or member not found')}
                showClearInputButton={true}
                onClearInput={this.onClearInput}
                onSuggestionSelected={this.onSuggestionSelected}
                className={styles['share-autocomplete']}
            />
        );
    }
}

const ShareAutoComplete = withI18n(InternalShareAutoComplete);

export default ShareAutoComplete;
