import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import getConfigData from 'utils/get-config-data';

import LearningPathContentAutosuggest from '../learning-path-content-autosuggest.react-component';
import {SEARCH_LABEL, SEARCH_LABEL_MOBILE, SHOW_ALL_RESULTS_SUGGESTION} from './constants';
import CourseAutosuggestResult from './course-autosuggest-result.react-component';
import CourseAutosuggestStore from './course-autosuggest.mobx-store';

import './course-autosuggest.less';

const udConfig = getConfigData();

@inject('learningPathStore')
@observer
export default class CourseAutosuggest extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        isSaving: PropTypes.bool.isRequired,
        onItemClicked: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.autosuggestStore = new CourseAutosuggestStore();
    }

    @autobind
    onSuggestionSelected(suggestion) {
        if (suggestion === SHOW_ALL_RESULTS_SUGGESTION) {
            return;
        }

        this.props.onItemClicked(`${udConfig.brand.organization.domain}${suggestion.url}`);
    }

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => {
                    let rendered;
                    if (suggestion === SHOW_ALL_RESULTS_SUGGESTION) {
                        rendered = renderSuggestion(
                            index,
                            <span className="ud-link-underline" styleName="show-all-results">
                                {gettext('Show all results')}
                            </span>,
                            {
                                componentClass: 'a',
                                href: `/organization/search/?q=${this.autosuggestStore.query}`,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                'data-purpose': 'search-results-menu-item',
                            },
                        );
                    } else {
                        rendered = renderSuggestion(
                            index,
                            <CourseAutosuggestResult course={suggestion} />,
                        );
                    }
                    return <li key={index}>{rendered}</li>;
                })}
            </ul>
        );
    }

    render() {
        const {isSaving, learningPathStore} = this.props;
        return (
            <LearningPathContentAutosuggest
                autosuggestStore={this.autosuggestStore}
                isSaving={isSaving}
                label={!learningPathStore.isMobileViewportSize ? SEARCH_LABEL : SEARCH_LABEL_MOBILE}
                onSuggestionSelected={this.onSuggestionSelected}
                renderSuggestions={this.renderSuggestions}
                browseLinkProps={{href: '/', children: gettext('Browse Udemy courses')}}
            />
        );
    }
}
