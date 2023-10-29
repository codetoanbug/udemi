import {Tracker, ClickEvent} from '@udemy/event-tracking';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';

import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import styles from './questions-and-answers.module.less';

export interface QuestionAndAnswer {
    question: string;
    answer: React.ReactNode;
    link_url?: string;
    link_text?: string;
}

interface QuestionsAndAnswersProps {
    questionsAndAnswers: QuestionAndAnswer[];
    compact: boolean;
    numRowsToShow: number | 'all';
    defaultExpanded: boolean;
}

@observer
class InternalQuestionsAndAnswers extends Component<QuestionsAndAnswersProps & WithI18nProps> {
    static defaultProps = {
        compact: false,
        defaultExpanded: false,
        numRowsToShow: 3,
    };

    @observable hideExtraRows = true;

    @action
    onToggle = () => {
        this.hideExtraRows = !this.hideExtraRows;
        Tracker.publishEvent(
            new ClickEvent({
                componentName: 'topicQuestionsAndAnswersShowMore',
            }),
        );
    };

    @computed
    get displayShowMoreButton() {
        return (
            this.props.numRowsToShow !== 'all' &&
            this.props.questionsAndAnswers.length > this.props.numRowsToShow &&
            this.hideExtraRows
        );
    }

    render() {
        const {compact, questionsAndAnswers, numRowsToShow, defaultExpanded, gettext} = this.props;

        return (
            <div className={styles['question-and-answer-container']}>
                <div
                    className={classNames(
                        compact ? 'ud-heading-lg' : 'ud-heading-xl',
                        styles.header,
                    )}
                    data-purpose="faq-heading"
                >
                    {gettext('Frequently asked questions')}
                </div>
                <Accordion size={compact ? 'medium' : undefined} name="faq-accordion">
                    {questionsAndAnswers.map((item, index) => {
                        return (
                            <Accordion.Panel
                                key={index}
                                id={`faq-panel--${index}`}
                                titleId={`faq-panel-title--${index}`}
                                defaultExpanded={defaultExpanded && index === 0}
                                title={item.question}
                                className={classNames({
                                    [styles.hidden]:
                                        numRowsToShow !== 'all' &&
                                        this.hideExtraRows &&
                                        index >= numRowsToShow,
                                })}
                            >
                                <div className={classNames('ud-text-sm', styles.answer)}>
                                    {item.answer}
                                </div>
                                {item.link_url && (
                                    <div className={classNames('ud-heading-md', styles.link)}>
                                        <a
                                            href={item.link_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.link_text ?? gettext('Learn more')}
                                        </a>
                                    </div>
                                )}
                            </Accordion.Panel>
                        );
                    })}
                </Accordion>
                {numRowsToShow !== 'all' && questionsAndAnswers.length > numRowsToShow && (
                    <Button
                        size="medium"
                        udStyle="secondary"
                        className={styles['show-more']}
                        onClick={this.onToggle}
                        data-purpose="toggle-button"
                    >
                        {this.displayShowMoreButton ? gettext('Show more') : gettext('Show less')}
                    </Button>
                )}
            </div>
        );
    }
}

export const QuestionsAndAnswers = withI18n(InternalQuestionsAndAnswers);
