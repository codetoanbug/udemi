import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {useEffect, useMemo} from 'react';

import AssessmentCard from 'my-courses-v3/measure-competence/assessment-card.react-component';
import TakeAssessmentCard from 'my-courses-v3/measure-competence/take-assessment-card.react-component';
import {showInformationToast} from 'organization-common/toasts';

import type LearningPathStore from '../../learning-path.mobx-store';
import {AUTO_ENROLL_INFO_MESSAGE} from '../constants';
import pageEventTracker from '../page-event-tracker';
import styles from './assessment-highlight.less';
import {AssessmentHighlightStore} from './assessment-highlight.mobx-store';

interface AssessmentHighlightProps {
    learningPathStore: LearningPathStore;
    store?: AssessmentHighlightStore;
}

export const AssessmentHighlight = inject('learningPathStore')(
    observer(({learningPathStore, store}: AssessmentHighlightProps) => {
        const {learningPath} = learningPathStore;
        const assessmentHighlightStore = useMemo(() => {
            // @ts-expect-error learningPath is declared as null
            return store ?? new AssessmentHighlightStore(learningPath.id);
            // @ts-expect-error learningPath is declared as null
        }, [store, learningPath.id]);

        const handleCardClick = async () => {
            // @ts-expect-error learningPath is declared as null
            const autoEnrollSuccess = await learningPath.autoEnroll({
                // this handler is only invoked when assessment is not null
                // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
                id: assessmentHighlightStore.assessment!.id,
                type: 'assessment',
                isDeepLink: false,
            });
            if (autoEnrollSuccess) {
                showInformationToast(AUTO_ENROLL_INFO_MESSAGE.TEXT);
            }
            pageEventTracker.contentItemClicked(
                'assessment',
                // @ts-expect-error learningPath is declared as null
                learningPath.assessmentToHighlight?.id,
            );
        };

        if (learningPath) {
            // @ts-expect-error learningPath is declared as null in non-TS file
            const assessment = learningPath.assessmentToHighlight;
            if (assessment) {
                assessmentHighlightStore.setAssessment(assessment);
            }
        }

        useEffect(() => {
            assessmentHighlightStore.fetchLatestAttempt();
        }, [assessmentHighlightStore]);

        const {isLoading, latestTestletAttempt} = assessmentHighlightStore;

        // @ts-expect-error learningPath is declared as null in non-TS file
        if (isLoading || learningPath.isCurriculumLoading) {
            return <Loader />;
        }
        // @ts-expect-error learningPath is declared as null in non-TS file
        const assessmentLinkDestination = `/skills-assessment/${assessmentHighlightStore.assessment?.slug}/?learning_path_id=${learningPath.id}`;
        return (
            <>
                {assessmentHighlightStore.assessment && (
                    <div className={styles['highlight-container']}>
                        <div className={styles.message}>
                            <h1 className={classNames('ud-heading-xl', styles.title)}>
                                {gettext('Assess your progress')}
                            </h1>
                            <p className="ud-text-md">
                                {gettext(
                                    'Take this assessment at any point and receive content recommendations with highlighted course sections based on your results. We suggest you take this multiple times to track your progress until you reach your learning goals.',
                                )}
                            </p>
                        </div>
                        {latestTestletAttempt ? (
                            <AssessmentCard
                                assessment={assessmentHighlightStore.latestTestletAttempt}
                                size="medium"
                                className={styles['assessment-card']}
                                onClickCallbackFunc={handleCardClick}
                            />
                        ) : (
                            <TakeAssessmentCard
                                id={assessmentHighlightStore.assessment?.id}
                                title={assessmentHighlightStore.assessment?.title}
                                key={assessmentHighlightStore.assessment?.id}
                                minCompletionTime={25}
                                maxCompletionTime={35}
                                equivalentNumberOfQuestions={30}
                                assessmentLinkDestination={assessmentLinkDestination}
                                isBeta={assessmentHighlightStore.assessment?.is_beta}
                                isPersonalPlan={true}
                                className={styles['assessment-card']}
                                onClickCallbackFunc={handleCardClick}
                            />
                        )}
                    </div>
                )}
            </>
        );
    }),
);
