import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {Autosuggest, AUTOSUGGEST_LOADING_STATE} from '@udemy/react-autosuggest-components';
import {IconButton} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import './learning-path-content-autosuggest.less';

@observer
export default class LearningPathContentAutosuggest extends Component {
    static propTypes = {
        autosuggestStore: PropTypes.object.isRequired,
        isSaving: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        browseLinkProps: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.onChangeSelectedSuggestionDisposer = reaction(
            () => this.props.autosuggestStore.selectedSuggestionIndex,
            this.onChangeSelectedSuggestion,
        );
    }

    componentWillUnmount() {
        this.onChangeSelectedSuggestionDisposer && this.onChangeSelectedSuggestionDisposer();
    }

    ref = React.createRef();

    @autobind
    onChangeSelectedSuggestion() {
        if (this.ref.current) {
            const items = this.ref.current.querySelectorAll('.ud-autosuggest-suggestion');
            const item = items[this.props.autosuggestStore.selectedSuggestionIndex];
            item && item.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
    }

    render() {
        const {label, isSaving, browseLinkProps, ...props} = this.props;
        const isLoading = props.autosuggestStore.loadingState === AUTOSUGGEST_LOADING_STATE.LOADING;
        return (
            <form ref={this.ref} onSubmit={this.onSubmit} className="no-drag" styleName="form">
                <FormGroup label={label} labelProps={{className: 'ud-sr-only'}}>
                    <div styleName="search-field">
                        <Autosuggest
                            placeholder={label}
                            data-purpose="add-link-form"
                            styleName="autosuggest"
                            noResultsContent={gettext('No matches found')}
                            {...props}
                        />
                        <IconButton disabled={isLoading || isSaving} type="submit">
                            {isLoading || isSaving ? (
                                <Loader color="inherit" />
                            ) : (
                                <SearchIcon label={gettext('Search')} />
                            )}
                        </IconButton>
                    </div>
                </FormGroup>
                <div styleName="browse">
                    <a
                        className="ud-link-underline"
                        target={getIsMobileApp() ? null : '_blank'}
                        {...browseLinkProps}
                    />
                </div>
            </form>
        );
    }
}
