import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {createRef, useContext, useEffect, useState} from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';
import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import CourseTakingStore from 'course-taking/course-taking.mobx-store';
import QuizViewStore from 'course-taking/quiz-view/quiz-view.mobx-store';
import requires from 'course-taking/registry/requires';
import {
    AnimatedCollapse,
    AUTO_CLOSE_DISTANCE,
    TRANSITION_DURATION,
} from 'instructor/animated-collapse/animated-collapse.react-component';

import {CodingExerciseStore} from '../coding-exercise.mobx-store';
import {Assessment, Quiz} from '../types';
import {Instructions} from './instructions.react-component';

import './problem-container.less';

type TabIdsType = 'instructions' | 'hints' | 'solution';
const ProblemContainerComponent: React.FC<{courseTakingStore: CourseTakingStore}> = ({
    courseTakingStore,
}) => {
    const store = useContext(MobXProviderContext);
    const codingExerciseStore: CodingExerciseStore = store.codingExerciseStore;
    const quizViewStore: QuizViewStore = store.quizViewStore;
    const [activeTab, setActiveTab] = useState<TabIdsType>('instructions');

    const assessment: Assessment = quizViewStore.questions[0];
    const prompt = assessment.prompt;
    const quiz: Quiz = (quizViewStore.quiz as unknown) as Quiz;

    const [headerWidth, setHeaderWidth] = useState<number>(0);
    const headerRef = createRef<HTMLDivElement>();

    useEffect(() => {
        setHeaderWidth(headerRef.current?.scrollWidth ?? 0);
    }, [codingExerciseStore.isPanelResizing, headerRef]);

    const onMove = (event: any, resizeData: any) => {
        if (codingExerciseStore.problemAreaHidden) return;
        const w = Math.max(0, resizeData.width);
        if (w > AUTO_CLOSE_DISTANCE) {
            courseTakingStore.setCodingExerciseResizePanelValue('problemContainer', w);
        } else {
            toggleProblemContainer();
            setTimeout(() => {
                const w = window.document.documentElement.clientWidth / 4;
                courseTakingStore.setCodingExerciseResizePanelValue('problemContainer', w);
            }, TRANSITION_DURATION);
        }
    };

    const toggleProblemContainer = () => {
        codingExerciseStore.toggleProblemAreaHidden();
    };

    return (
        <AnimatedCollapse
            collapsed={codingExerciseStore.problemAreaHidden}
            collapseDirection="width"
        >
            <Resizer
                styleName="problem-container"
                style={{
                    width: courseTakingStore.ceResizablePanelSizes.problemContainer
                        ? `${courseTakingStore.ceResizablePanelSizes.problemContainer}px`
                        : '25vw',
                }}
                onMove={onMove}
                onStart={codingExerciseStore.onResizerStart}
                onEnd={codingExerciseStore.onResizerEnd}
                edges={{right: true}}
            >
                <div
                    styleName="content"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        return true;
                    }}
                >
                    <div styleName="header">
                        <div styleName="tab-container">
                            <div styleName="tab-container-inner">
                                <Tabs
                                    key={headerWidth}
                                    size="small"
                                    activeTabId={activeTab}
                                    onSelect={(id) => {
                                        setActiveTab(id as TabIdsType);
                                        codingExerciseStore.trackEvent(id as string);
                                    }}
                                >
                                    <Tabs.Tab title={gettext('Instructions')} id="instructions" />
                                    {prompt.hints?.[0]?.description && (
                                        <Tabs.Tab title={gettext('Hints')} id="hints" />
                                    )}
                                    {prompt.solution && (
                                        <Tabs.Tab
                                            title={gettext('Solution explanation')}
                                            id="solution"
                                        />
                                    )}
                                </Tabs>
                            </div>
                        </div>
                        <IconButton
                            styleName="button"
                            udStyle="ghost"
                            size="small"
                            data-purpose="close-button"
                            onClick={toggleProblemContainer}
                        >
                            <ArrowLeftIcon label="Close" color="neutral" />
                        </IconButton>
                    </div>
                    <div styleName="tab-content" data-purpose="tab-content">
                        {activeTab === 'instructions' && (
                            <Instructions
                                title={quiz?.title}
                                content={prompt.instructions}
                                lecture={assessment.related_lectures?.[0]}
                                store={codingExerciseStore}
                            />
                        )}
                        {activeTab === 'hints' && (
                            <Instructions content={prompt.hints?.[0].description} />
                        )}
                        {activeTab === 'solution' && <Instructions content={prompt.solution} />}
                    </div>
                </div>
                <div styleName="drag-handle" />
            </Resizer>
        </AnimatedCollapse>
    );
};

export const ProblemContainer = requires('courseTakingStore')(observer(ProblemContainerComponent));
