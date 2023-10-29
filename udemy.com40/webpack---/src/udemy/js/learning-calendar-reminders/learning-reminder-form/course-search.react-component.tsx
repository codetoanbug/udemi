import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {CourseType} from '../types';
import {CourseSearchStore} from './course-search.mobx-store';

import './learning-reminder-form.less';

interface CourseSearchProps {
    onCourseSelect: (id: number, title: string, _class?: string) => void;
}
@observer
export class CourseSearch extends Component<CourseSearchProps> {
    componentDidMount() {
        this.store.loadInitialCourses();
    }

    readonly store = new CourseSearchStore();

    @autobind
    renderSuggestions(
        suggestions: CourseType[],
        renderSuggestion: (i: number, title: string) => React.ReactNode,
    ) {
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{renderSuggestion(index, suggestion.title)}</li>
                ))}
            </ul>
        );
    }

    @autobind
    onSuggestionSelected(suggestion: CourseType) {
        this.store.setInputValue(suggestion.title);
        this.store.setSuggestions(this.store.filteredCourses);
        this.props.onCourseSelect(suggestion.id, suggestion.title, suggestion._class);
    }

    @autobind
    onClearInput() {
        this.store.clearInputValue();
    }

    render() {
        const searchIcon = (
            <div styleName="search-icon">
                <SearchIcon color="neutral" label={false} />
            </div>
        );
        return (
            <FormGroup
                label={gettext('Search from your courses')}
                labelProps={{className: 'ud-sr-only'}}
            >
                <Autosuggest
                    autosuggestStore={this.store}
                    placeholder={gettext('Search courses')}
                    renderSuggestions={this.renderSuggestions}
                    onSuggestionSelected={this.onSuggestionSelected}
                    showClearInputButton={!!this.store.inputValue}
                    onClearInput={this.onClearInput}
                    icon={searchIcon}
                />
            </FormGroup>
        );
    }
}
