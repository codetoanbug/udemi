import {Keys} from '@udemy/design-system-utils';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import CourseLabelsStore, {PROPOSE_LABEL} from './course-labels.mobx-store';
import {LabelSuggestionsProps} from './types';

import './label-autosuggestion.less';

interface LabelAutosuggestionProps {
    courseLabelsStore: CourseLabelsStore;
    onSuggestionSelected: (suggestion: LabelSuggestionsProps) => void;
    addProposedLabel?: () => void;
    autosuggestPlaceholder: string;
    autofocus: boolean;
}

@observer
export class LabelAutosuggestion extends React.Component<LabelAutosuggestionProps> {
    @observable private shouldBlurAutosuggest = true;
    private autosuggestBlurTimeoutId!: ReturnType<typeof setTimeout>;

    @action
    private setShouldBlurAutosuggest(value: boolean) {
        this.shouldBlurAutosuggest = value;
    }

    @autobind
    onSuggestionsMouseDown() {
        this.setShouldBlurAutosuggest(false);
    }

    @autobind
    onInputBlur() {
        this.autosuggestBlurTimeoutId && clearTimeout(this.autosuggestBlurTimeoutId);
        this.autosuggestBlurTimeoutId = setTimeout(() => {
            this.shouldBlurAutosuggest && this.props.courseLabelsStore.reset();
            this.setShouldBlurAutosuggest(true);
        }, 0);
    }

    @autobind
    onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.keyCode === Keys.RETURN && !this.props.courseLabelsStore.selectedSuggestion) {
            // We only want to process the proposed label if the event is not
            // one of the suggested values being selected.
            event.preventDefault();
            this.props.addProposedLabel?.();
        }
    }

    @autobind
    private renderSuggestions(
        suggestions: Array<{id: number; title: string}>,
        renderSuggestion: (
            i: number,
            title: JSX.Element | string,
            suggestionProps: Record<string, unknown>,
        ) => React.ReactNode,
    ) {
        return (
            <ul
                className="ud-unstyled-list"
                styleName="suggestions"
                onMouseDown={this.onSuggestionsMouseDown}
            >
                {suggestions.map((suggestion, index) => {
                    if (suggestion === PROPOSE_LABEL) {
                        return (
                            <li key={index} styleName="propose-label">
                                {renderSuggestion(
                                    index,
                                    interpolate(gettext('Propose new topic "%s"'), [
                                        this.props.courseLabelsStore.inputValue,
                                    ]),
                                    {'data-purpose': 'propose-label'},
                                )}
                            </li>
                        );
                    }
                    return (
                        <li key={index} styleName="suggested-label">
                            {renderSuggestion(
                                index,
                                <span styleName="ellipsis">{suggestion.title}</span>,
                                {
                                    round: true,
                                    udStyle: 'secondary',
                                    size: 'small',
                                    typography: 'ud-heading-sm',
                                },
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    render() {
        return (
            <Autosuggest
                autosuggestStore={this.props.courseLabelsStore}
                renderSuggestions={this.renderSuggestions}
                noResultsContent={null}
                onSuggestionSelected={this.props.onSuggestionSelected}
                data-purpose="autosuggest-input"
                placeholder={this.props.autosuggestPlaceholder}
                autoFocus={this.props.autofocus}
                onBlur={this.onInputBlur}
                onKeyDown={this.onInputKeyDown}
            />
        );
    }
}
