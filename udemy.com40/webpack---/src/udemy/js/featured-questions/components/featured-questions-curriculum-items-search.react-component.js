import {Autosuggest} from '@udemy/react-autosuggest-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import FeaturedQuestionsCurriculumItemsStore from './featured-questions-curriculum-items.mobx-store';

@observer
export default class FeaturedQuestionsCurriculumItemsSearch extends React.Component {
    static propTypes = {
        onCurriculumItemSelect: PropTypes.func.isRequired,
        onCurriculumItemDeselect: PropTypes.func.isRequired,
        selectedCourseId: PropTypes.number.isRequired,
        initialCurriculumItemType: PropTypes.string,
        initialCurriculumItemId: PropTypes.number,
        placeholder: PropTypes.string,
        formLabel: PropTypes.node,
        labelProps: PropTypes.object,
        validationState: PropTypes.oneOf([null, 'error']),
    };

    static defaultProps = {
        initialCurriculumItemType: null,
        initialCurriculumItemId: null,
        formLabel: '',
        placeholder: '',
        labelProps: {},
        validationState: null,
    };

    constructor(props) {
        super(props);
        this.store = new FeaturedQuestionsCurriculumItemsStore();
    }

    async componentDidMount() {
        await this.store.loadInitialCourseCurriculumItems(this.props.selectedCourseId);
        if (this.props.initialCurriculumItemType && this.props.initialCurriculumItemId) {
            this.store.selectCurriculumItem(
                this.props.initialCurriculumItemType,
                this.props.initialCurriculumItemId,
            );
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedCourseId !== this.props.selectedCourseId) {
            this.onClearInput();
            this.store.loadInitialCourseCurriculumItems(this.props.selectedCourseId);
        }
    }

    @autobind
    onSuggestionSelected(suggestion) {
        this.store.setInputValue(suggestion.title);
        this.store.setSuggestions(this.store.filterCurriculumItems(this.store.query));
        this.props.onCurriculumItemSelect(suggestion.id, suggestion._class);
    }

    @autobind
    onClearInput() {
        this.store.clearInputValue();
        this.props.onCurriculumItemDeselect();
    }

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{renderSuggestion(index, suggestion.title)}</li>
                ))}
            </ul>
        );
    }

    render() {
        const {formLabel, placeholder, labelProps} = this.props;

        return (
            <FormGroup
                label={formLabel}
                labelProps={labelProps}
                note={
                    this.props.validationState === 'error'
                        ? gettext('This field is required.')
                        : null
                }
                validationState={this.props.validationState}
            >
                <Autosuggest
                    autosuggestStore={this.store}
                    placeholder={placeholder}
                    renderSuggestions={this.renderSuggestions}
                    onSuggestionSelected={this.onSuggestionSelected}
                    showClearInputButton={!!this.store.inputValue}
                    onClearInput={this.onClearInput}
                />
            </FormGroup>
        );
    }
}
