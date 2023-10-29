import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import getConfigData from 'utils/get-config-data';

import {LAB_COLLECTION_BASE_PATH} from '../../../constants';
import LearningPathContentAutosuggest from '../learning-path-content-autosuggest.react-component';
import {SEARCH_LABEL, SEARCH_LABEL_MOBILE} from './constants';
import {LabAutosuggestResult} from './lab-autosuggest-result.react-component';
import {LabAutosuggestStore} from './lab-autosuggest.mobx-store';
import {LabType} from './types';
import './lab-autosuggest.less';

const udConfig = getConfigData();

interface LabAutosuggestProps {
    learningPathStore: LearningPathStore;
    isSaving: boolean;
    onItemClicked: (url: string) => void;
}

@inject('learningPathStore')
@observer
export class LabAutosuggest extends Component<LabAutosuggestProps> {
    static defaultProps = {
        learningPathStore: LearningPathStore,
    };

    constructor(props: LabAutosuggestProps) {
        super(props);
        this.autosuggestStore = new LabAutosuggestStore();
    }

    private autosuggestStore: LabAutosuggestStore;

    @autobind
    onSuggestionSelected(lab: LabType) {
        this.props.onItemClicked(
            `${udConfig.brand.organization.domain}${LAB_COLLECTION_BASE_PATH}${lab.id}`,
        );
    }

    @autobind
    renderSuggestions(
        suggestions: LabType[],
        renderSuggestion: (index: React.Key, element: JSX.Element) => React.ReactNode,
    ) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {renderSuggestion(index, <LabAutosuggestResult lab={suggestion} />)}
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
                    href: LAB_COLLECTION_BASE_PATH,
                    children: gettext('Browse Udemy labs'),
                }}
            />
        );
    }
}
