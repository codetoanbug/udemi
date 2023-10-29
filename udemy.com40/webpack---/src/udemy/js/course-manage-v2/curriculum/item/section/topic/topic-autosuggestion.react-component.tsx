import {Keys} from '@udemy/design-system-utils';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {SectionTopicsStore, PROPOSE_TOPIC} from './section-topics.mobx-store';
import {TopicModel} from './topic.mobx-model';

import './topic-autosuggestion.less';

interface TopicAutosuggestionProps {
    sectionTopicsStore: SectionTopicsStore;
    onSuggestionSelected: (suggestion: TopicModel) => void;
    addProposedTopic?: () => void;
    autosuggestPlaceholder: string;
    autofocus: boolean;
}

@observer
export class TopicAutosuggestion extends React.Component<TopicAutosuggestionProps> {
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
            this.shouldBlurAutosuggest && this.props.sectionTopicsStore.reset();
            this.setShouldBlurAutosuggest(true);
        }, 0);
    }

    @autobind
    onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.keyCode === Keys.RETURN && !this.props.sectionTopicsStore.selectedSuggestion) {
            // We only want to process the proposed topic if the event is not
            // one of the suggested values being selected.
            event.preventDefault();
            this.props.addProposedTopic?.();
        }
    }

    @autobind
    private renderSuggestions(
        suggestions: Array<{id: number; defaultName: string}>,
        renderSuggestion: (
            i: number,
            defaultName: JSX.Element | string,
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
                    if (suggestion === PROPOSE_TOPIC) {
                        return (
                            <li key={index} styleName="propose-topic">
                                {renderSuggestion(
                                    index,
                                    interpolate(gettext('Propose new topic "%s"'), [
                                        this.props.sectionTopicsStore.inputValue,
                                    ]),
                                    {'data-purpose': 'propose-topic'},
                                )}
                            </li>
                        );
                    }
                    return (
                        <li key={index} styleName="suggested-topic">
                            {renderSuggestion(
                                index,
                                <span styleName="ellipsis">{suggestion.defaultName}</span>,
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
                autosuggestStore={this.props.sectionTopicsStore}
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
