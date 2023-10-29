import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import PracticeTestStore from '../practice-test.mobx-store';
import TestResultModel from '../results/test-result.mobx-model';
import styles from './result-badges.less';

const ResultBadgesComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).practiceTestStore as PracticeTestStore;
    const result = (store.detailedTestResult as unknown) as TestResultModel;
    const {gettext} = useI18n();

    const correctCount = result.numCorrect;
    const incorrectCount = result.numIncorrect;
    const skippedCount = result.numSkipped + result.unanswered;

    return (
        <div className={styles['result-badges']}>
            <Badge className={`${styles.badge} ${styles.correct}`}>
                <p>
                    <span className={'ud-heading-sm'}>{correctCount}</span>{' '}
                    <span className={'ud-text-sm'}>{gettext('correct')}</span>
                </p>
            </Badge>
            <Badge className={`${styles.badge} ${styles.incorrect}`}>
                <p>
                    <span className={'ud-heading-sm'}>{incorrectCount}</span>{' '}
                    <span className={'ud-text-sm'}>{gettext('incorrect')}</span>
                </p>
            </Badge>
            <Badge className={`${styles.badge} ${styles.skipped}`}>
                <p>
                    <span className={'ud-heading-sm'}>{skippedCount}</span>{' '}
                    <span className={'ud-text-sm'}>{gettext('skipped')}</span>
                </p>
            </Badge>
        </div>
    );
};

export const ResultBadges = observer(ResultBadgesComponent);
