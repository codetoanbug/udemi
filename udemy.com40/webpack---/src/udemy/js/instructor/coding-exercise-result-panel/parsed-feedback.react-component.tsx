import {Table} from '@udemy/react-structure-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import {CodingExerciseResultStore} from './coding-exercise-result.mobx-store';
import {Feedback, FeedbackUnsuccessful} from './types';
import './result-container.less';

function prepareRows(element: Array<any>) {
    element.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
            obj[key] = String(obj[key]);
        });
    });
    return element;
}

export const ScrollableContent: React.FC = ({children}) => {
    return (
        <div styleName="scroll-content">
            <div styleName="scroll-content-horizontal">
                <div styleName="scroll-content-scrollable scroll-color">{children}</div>
            </div>
        </div>
    );
};

const PreContent: React.FC<{text: string}> = ({text}) => (
    <pre className="ud-text-sm" data-purpose="feedback-content">
        {text}
    </pre>
);

const FeedbackContent: React.FC<{feedback: Array<any>}> = ({feedback}) => {
    return (
        <>
            {feedback.map((element, i) => {
                if (typeof element === 'number') {
                    return (
                        <PreContent
                            key={`${i}`}
                            text={ninterpolate(
                                '%(count)s row affected',
                                '%(count)s rows affected',
                                element,
                                {
                                    count: element,
                                },
                            )}
                        />
                    );
                } else if (!Array.isArray(element)) {
                    return <PreContent key={`${i}`} text={(element as unknown) as string} />;
                } else if (!element[0] || typeof element[0] !== 'object') {
                    return (
                        <>
                            {element.map((row, j) => (
                                <PreContent key={`${i}-${j}`} text={row} />
                            ))}
                        </>
                    );
                }
                return (
                    <Table
                        key={i}
                        padding="xs"
                        noBackgroundColor={true}
                        noBorder={true}
                        scrollShadow={false}
                        invertedColors={true}
                        columns={Object.keys(element[0]).map((col) => {
                            return {fieldName: col, headerName: col};
                        })}
                        rows={prepareRows(element)}
                    />
                );
            })}
        </>
    );
};

// Note: this component currently only deals with SQL feedback
const FeedbackComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    try {
        const feedback: Feedback = JSON.parse(store.evaluatorFeedback ?? '');
        if (!Array.isArray(feedback)) {
            throw new Error('Feedback should be rendered without formatting');
        }

        // Note: feedback[0] is not an unsuccessful feedback in normal cases
        // there is a bug in sql-evaluator which sometimes fills it in as unsuccessful
        // even though it the tests pass. This is a temporary fix until evaluator is fixed
        const errorFeedback = feedback[0] as FeedbackUnsuccessful;
        if (store.hasSolutionPassed) {
            return (
                <div className="ud-text-sm" styleName="parsed-output">
                    <ScrollableContent>
                        <FeedbackContent
                            feedback={errorFeedback.actual ?? (feedback as Array<undefined>)}
                        />
                    </ScrollableContent>
                </div>
            );
        }

        return (
            <div className="ud-text-sm" styleName="parsed-output parsed-output-error">
                <ScrollableContent>
                    <p className="ud-heading-sm" data-purpose="feedback-content">
                        {gettext('Your result')}
                    </p>
                    <FeedbackContent feedback={errorFeedback.actual} />
                </ScrollableContent>
                <ScrollableContent>
                    <p className="ud-heading-sm" data-purpose="feedback-content">
                        {gettext('Expected result')}
                    </p>
                    <FeedbackContent feedback={errorFeedback.expected} />
                </ScrollableContent>
            </div>
        );
    } catch (e) {
        return <PreContent text={store.evaluatorFeedback as string} />;
    }
};
export const ParsedFeedback = observer(FeedbackComponent);
