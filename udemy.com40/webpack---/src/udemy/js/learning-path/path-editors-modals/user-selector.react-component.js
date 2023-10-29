import {Autosuggest} from '@udemy/react-autosuggest-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import PathEditorsStore from '../learning-path-page/path-editors.mobx-store';
import UserAutocompleteResult from './user-autocomplete-result.react-component';

import './path-editors-modals.less';

@observer
export default class UserSelector extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(PathEditorsStore).isRequired,
    };

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        const editors = this.props.store.editableEditors;
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((user, index) => {
                    const isAlreadyAnEditor = editors.some((editor) => editor.id === user.id);
                    return (
                        <li key={index}>
                            {renderSuggestion(
                                index,
                                <UserAutocompleteResult
                                    data-purpose="user-autocomplete-result"
                                    user={user}
                                    isAlreadyAnEditor={isAlreadyAnEditor}
                                />,
                                {disabled: isAlreadyAnEditor},
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    render() {
        return (
            <FormGroup
                label={gettext('Select users')}
                labelProps={{className: 'ud-sr-only'}}
                styleName="add-editor-form"
            >
                <Autosuggest
                    data-purpose="autocomplete-input"
                    autosuggestStore={this.props.store}
                    renderSuggestions={this.renderSuggestions}
                    onSuggestionSelected={this.props.store.selectUser}
                    placeholder={gettext('Enter name or email')}
                />
            </FormGroup>
        );
    }
}
