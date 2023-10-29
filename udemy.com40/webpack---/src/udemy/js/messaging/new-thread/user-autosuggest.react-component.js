import {Autosuggest} from '@udemy/react-autosuggest-components';
import {Avatar} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import UserAutosuggestStore from './user-autosuggest.mobx-store';

import './user-autosuggest.less';

@observer
export default class UserAutosuggest extends Component {
    static propTypes = {
        initialUser: PropTypes.object,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        initialUser: null,
    };

    constructor(props) {
        super(props);
        this.store = new UserAutosuggestStore();
        if (this.props.initialUser) {
            this.store.selectedUser = this.props.initialUser;
            this.store.setInputValue(this.store.selectedUser.display_name);
        }
    }

    @autobind
    onSuggestionSelected(suggestion) {
        this.store.setInputValue(suggestion.display_name);
        this.store.selectedUser = suggestion;
        this.props.onChange(suggestion);
    }

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {renderSuggestion(index, this.renderSuggestion(suggestion))}
                    </li>
                ))}
            </ul>
        );
    }

    renderSuggestion(suggestion) {
        return (
            <div styleName="suggestion-container">
                <Avatar user={suggestion} alt="NONE" size="small" srcKey="image_50x50" />
                <div className="ud-text-md">{suggestion.display_name}</div>
            </div>
        );
    }

    @autobind
    @action
    onChange() {
        this.store.selectedUser = null;
        this.props.onChange(null);
    }

    @autobind
    @action
    onClearInput() {
        this.store.clearInputValue();
        this.store.selectedUser = null;
        this.props.onChange(null);
    }

    render() {
        const {initialUser, ...props} = this.props;
        const selectedUser = this.store.selectedUser;
        return (
            <Autosuggest
                autosuggestStore={this.store}
                renderSuggestions={this.renderSuggestions}
                onSuggestionSelected={this.onSuggestionSelected}
                showClearInputButton={!!this.store.inputValue}
                noResultsContent={gettext('No matches found')}
                onClearInput={this.onClearInput}
                icon={
                    selectedUser ? (
                        <Avatar
                            user={selectedUser}
                            alt="NONE"
                            size="small"
                            srcKey="image_50x50"
                            styleName="selected-avatar"
                        />
                    ) : null
                }
                // inputProps
                autoFocus={!selectedUser && !props.disabled}
                {...props}
                onChange={this.onChange}
            />
        );
    }
}
