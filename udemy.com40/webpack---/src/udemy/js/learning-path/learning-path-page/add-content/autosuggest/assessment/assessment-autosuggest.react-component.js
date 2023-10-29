import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import getConfigData from 'utils/get-config-data';

import {ASSESSMENT_COLLECTION_BASE_PATH} from '../../../constants';
import LearningPathContentAutosuggest from '../learning-path-content-autosuggest.react-component';
import AssessmentAutosuggestResult from './assessment-autosuggest-result.react-component';
import AssessmentAutosuggestStore from './assessment-autosuggest.mobx-store';
import {SEARCH_LABEL, SEARCH_LABEL_MOBILE} from './constants';
import './assessment-autosuggest.less';

const udConfig = getConfigData();

@inject('learningPathStore')
@observer
export default class AssessmentAutosuggest extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        isSaving: PropTypes.bool.isRequired,
        onItemClicked: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.autosuggestStore = new AssessmentAutosuggestStore();
    }

    @autobind
    onSuggestionSelected(assessment) {
        this.props.onItemClicked(
            `${udConfig.brand.organization.domain}${ASSESSMENT_COLLECTION_BASE_PATH}${assessment.slug}`,
        );
    }

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {renderSuggestion(
                            index,
                            <AssessmentAutosuggestResult assessment={suggestion} />,
                        )}
                    </li>
                ))}
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
                browseLinkProps={{
                    href: ASSESSMENT_COLLECTION_BASE_PATH,
                    children: gettext('Browse Udemy assessments'),
                }}
            />
        );
    }
}
