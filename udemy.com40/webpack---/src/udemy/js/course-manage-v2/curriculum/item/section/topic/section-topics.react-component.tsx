import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {AxiosResponse} from 'axios';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {showErrorToast, showSuccessToast} from 'instructor/toasts';

import './section-topics.less';
import {SectionHasTopicStore} from './section-has-topic.mobx-store';
import {SectionTopic} from './section-topic.react-component';
import {SectionTopicsStore, PROPOSE_TOPIC} from './section-topics.mobx-store';
import {TopicAutosuggestion} from './topic-autosuggestion.react-component';
import {TopicModel} from './topic.mobx-model';

interface SectionTopicsProps {
    sectionHasTopicStore: SectionHasTopicStore;
}
@observer
export class SectionTopics extends React.Component<SectionTopicsProps> {
    static defaultProps: SectionTopicsProps;

    constructor(props: SectionTopicsProps) {
        super(props);
        this.sectionTopicsStore = new SectionTopicsStore(true);
    }

    componentDidMount() {
        this.props.sectionHasTopicStore.fetchSectionHasTopics();
    }

    sectionTopicsStore: SectionTopicsStore;

    @computed
    get searchBoxVisible() {
        return (
            (this.sectionTopicsStore.addNewTopic && this.props.sectionHasTopicStore.canAddTopic) ||
            !this.props.sectionHasTopicStore.sectionHasTopics.length
        );
    }

    @autobind
    async onSuggestionSelected(suggestion: TopicModel) {
        if (suggestion.id === PROPOSE_TOPIC.id) {
            return this.addProposedLabel();
        }
        this.sectionTopicsStore.reset();
        await this.props.sectionHasTopicStore.addTopic(suggestion);
    }

    @autobind
    handleNewTopic() {
        this.sectionTopicsStore.handleNewTopicClick();
    }

    @autobind
    addProposedLabel() {
        if (!this.sectionTopicsStore.canPropose) {
            return;
        }

        const topic = this.sectionTopicsStore.inputValue;
        this.sectionTopicsStore
            .create(topic)
            .then(async (response: AxiosResponse) => {
                const status = response.data.results[0].status;
                if (status === 'success') {
                    const proposedTopic = new TopicModel({
                        id: response.data.results[0].data.id,
                        default_name: topic,
                        is_proposed_topic: true,
                    });
                    await this.props.sectionHasTopicStore.addTopic(proposedTopic);
                    showSuccessToast(
                        interpolate(
                            gettext('The topic "%(topic)s" has been proposed.'),
                            {topic},
                            true,
                        ),
                    );
                } else {
                    showErrorToast(
                        interpolate(
                            gettext(
                                'Something went wrong proposing topic "%(topic)s" to section. Please refresh page and try again.',
                            ),
                            {topic},
                            true,
                        ),
                    );
                }
                this.sectionTopicsStore.reset();
            })
            .catch(() => {
                this.sectionTopicsStore.reset();
                showErrorToast(
                    interpolate(
                        gettext(
                            'Something went wrong proposing topic "%(topic)s" to section. Please refresh page and try again.',
                        ),
                        {topic},
                        true,
                    ),
                );
            });
    }

    renderAutosuggestComponent() {
        return (
            <div styleName="autosuggest-display-container">
                <TopicAutosuggestion
                    autosuggestPlaceholder={gettext('e.g. AWS S3')}
                    onSuggestionSelected={this.onSuggestionSelected}
                    sectionTopicsStore={this.sectionTopicsStore}
                    autofocus={this.props.sectionHasTopicStore.sectionHasTopics.length > 0}
                    addProposedTopic={this.addProposedLabel}
                />
            </div>
        );
    }

    renderTopics(topics: TopicModel[]) {
        const sectionTopics: React.ReactNode[] = [];
        topics.forEach((topic: TopicModel) => {
            return sectionTopics.push(
                <SectionTopic
                    key={topic.id}
                    topic={topic}
                    locked={false}
                    onAdd={this.props.sectionHasTopicStore.addTopic}
                    onDelete={this.props.sectionHasTopicStore.removeAssignment}
                />,
            );
        });
        return !sectionTopics.length ? null : (
            <span styleName="section-topics">{sectionTopics}</span>
        );
    }

    render() {
        let autosuggest, note;

        const {isLoadingTopics} = this.props.sectionHasTopicStore;
        if (this.searchBoxVisible) {
            autosuggest = this.renderAutosuggestComponent();
        } else if (this.props.sectionHasTopicStore.canAddTopic) {
            note = (
                <Button
                    udStyle="link"
                    data-purpose="display-autosuggest-box"
                    onClick={this.handleNewTopic}
                    className="ud-link-neutral ud-link-underline"
                    typography="ud-text-xs"
                >
                    {gettext('Propose another topic...')}
                </Button>
            );
        } else {
            note = gettext(
                'A maximum of 2 topics are allowed. To replace a topic, first remove one.',
            );
        }
        return (
            <>
                {isLoadingTopics ? (
                    <Loader block={true} size="medium" />
                ) : (
                    <FormGroup
                        label={gettext('Topic')}
                        labelProps={{className: 'ud-sr-only'}}
                        note={note}
                    >
                        {this.renderTopics(this.props.sectionHasTopicStore.sectionHasTopics)}
                        {autosuggest}
                    </FormGroup>
                )}
            </>
        );
    }
}
