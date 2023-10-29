import {Accordion} from '@udemy/react-reveal-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import PracticeTestStore from '../practice-test.mobx-store';
import {QuestionResultPane} from './question-result-pane.react-component';

const RevampedResultPanelComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).practiceTestStore as PracticeTestStore;

    const result = store.detailedTestResult;

    return (
        <Accordion size="xlarge">
            {
                // @ts-expect-error PracticeTestStore is not typed yet
                result?.filteredQuestions.map((question) => (
                    <QuestionResultPane key={question.id} question={question} />
                ))
            }
        </Accordion>
    );
};

export const RevampedResultPanel = observer(RevampedResultPanelComponent);
