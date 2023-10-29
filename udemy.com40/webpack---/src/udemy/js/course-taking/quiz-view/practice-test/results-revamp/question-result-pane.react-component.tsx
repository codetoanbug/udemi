import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Accordion} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import {ASSESSMENT_TYPES} from '../../constants';
import MCQuestion from '../../mc-question.mobx-model';
import {Answer} from '../types';
import {AnswerResultPane} from './answer-result-pane.react-component';
import {DomainPane, DomainPaneProps} from './domain-pane.react-component';
import {QuestionResultHeader} from './question-result-header.react-component';
import {ResourcePane} from './resource-pane.react-component';
import styles from './result-pane.less';

const convertToNumber = (letter: string) => {
    return letter.charCodeAt(0) - 96;
};

const QuestionResultPaneComponent: React.FC<{question: MCQuestion}> = ({question}) => {
    const dataDomain: DomainPaneProps = {
        data: question.knowledgeArea,
    };

    const generateResourceData = () => {
        const links = question.links?.map((item: any) => {
            const regex = /\[(.*?)\]\((.*?)\)/;
            const matches = item.match(regex);
            return {type: 'link', link: matches[2], title: matches[1]};
        });
        const relatedLectures = question.resourcesRelatedLectures?.map((item: any) => {
            return {type: 'lecture', link: item.url, title: item.title, lectureId: item.id};
        });
        return [...links, ...relatedLectures];
    };

    const generateFITBAnswers = () => {
        const isCorrect = question.answers.filter((answer: Answer) => !answer.correct).length === 0;
        const answers: Answer[] = [];
        if (isCorrect) {
            answers.push({
                id: 'a',
                text: question.answers.map((answer: Answer) => ` ${answer.text}`).toString(),
                feedback: question.explanation,
                correct: true,
                selected: true,
            });
        } else {
            answers.push({
                id: 'a',
                text: question.answers.map((answer: Answer) => ` ${answer.text}`).toString(),
                feedback: question.explanation,
                correct: true,
                selected: false,
            });

            answers.push({
                id: 'b',
                text: question.answers
                    .map(
                        (answer: Answer) =>
                            ` ${answer.userAnswer?.trim() ? answer.userAnswer?.trim() : '_'}`,
                    )
                    .toString(),
                feedback: '',
                correct: false,
                selected: true,
            });
        }

        return answers;
    };

    const data = generateResourceData();
    const sortedAnswers = question.answers.filter((answer: Answer) => answer.correct);
    question.answers
        .filter((answer: Answer) => answer.selected && !answer.correct)
        .forEach((answer: Answer) => {
            sortedAnswers.push(answer);
        });

    return (
        <div className={styles['question-result-pane-wrapper']}>
            {question.isMarkedForReview && (
                <RatingStarIcon
                    className={styles['star-rating-icon']}
                    size="medium"
                    label={false}
                />
            )}
            <Accordion.Panel
                title={<QuestionResultHeader question={question} />}
                className={`${styles['question-result-pane']} ${styles['accordion-panel']}`}
            >
                <div className={styles['question-result-pane-expanded-content']}>
                    {question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK
                        ? generateFITBAnswers().map((answer: Answer, answerIndex: number) => (
                              <AnswerResultPane
                                  key={answerIndex + 1}
                                  answer={answer}
                                  answerIndex={convertToNumber(answer.id)}
                                  isAnswerIndexVisible={false}
                              />
                          ))
                        : sortedAnswers.map((answer: Answer, answerIndex: number) => (
                              <AnswerResultPane
                                  key={answerIndex + 1}
                                  answer={answer}
                                  answerIndex={convertToNumber(answer.id)}
                                  isAnswerIndexVisible={true}
                              />
                          ))}
                    {data.length > 0 && <ResourcePane data={data} />}
                    {dataDomain.data.length > 0 && <DomainPane data={dataDomain.data} />}
                </div>
            </Accordion.Panel>
        </div>
    );
};

export const QuestionResultPane = observer(QuestionResultPaneComponent);
