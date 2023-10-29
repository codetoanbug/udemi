import {Button} from '@udemy/react-core-components';
import {action} from 'mobx';
import {MobXProviderContext, observer, Provider} from 'mobx-react';
import React, {useContext, useEffect, useState} from 'react';

import CourseTakingStore from 'course-taking/course-taking.mobx-store';
import CurriculumItemFooter from 'course-taking/curriculum/controls/curriculum-item-footer.react-component';
import NextItemLink from 'course-taking/curriculum/next-item-link.react-component';
import requires from 'course-taking/registry/requires';
import {ResultContainer} from 'instructor/coding-exercise-result-panel/result-container.react-component';
import {WelcomeModal} from 'instructor/welcome-modal/welcome-modal.react-component';
import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';
import {noop} from 'utils/noop';
import udLink from 'utils/ud-link';

import QuizViewStore from '../quiz-view.mobx-store';
import {CodingExerciseStore} from './coding-exercise.mobx-store';
import {EditorContainer} from './editor-area/editor-container.react-component';
import {PreviewResizer} from './preview-area/preview-resizer.react-component';
import {ProblemContainer as ProblemContainer2} from './problem-area-phase-2/problem-container.react-component';
import {ProblemContainer} from './problem-area/problem-container.react-component';

import './coding-exercise.less';

const CodingExerciseComponent: React.FC = () => {
    const codingExerciseStore = useContext(MobXProviderContext).codingExerciseStore;
    const workspaceRef = React.createRef<HTMLDivElement>();
    const parentRef = React.createRef<HTMLDivElement>();

    const hasSidebarContent = useContext(MobXProviderContext).registry.courseTakingStore
        .hasSidebarContent;
    const [firstTime, setFirstTime] = useState(true);
    useEffect(
        (() => {
            if (firstTime) {
                setFirstTime(false);
                return;
            }
            codingExerciseStore.codeEditorStore.triggerResize();
        }) as VoidFunction,
        [hasSidebarContent],
    );

    useEffect(
        action(() => {
            codingExerciseStore.parentRef = parentRef.current;
        }),
        [codingExerciseStore.parentRef, parentRef],
    );

    return (
        <>
            <div styleName="coding-exercise" ref={parentRef}>
                {getVariantValueFromUdRequest(
                    'is_new_coding_exercise_creation_ui_enabled',
                    'is_active',
                    false,
                ) ? (
                    <ProblemContainer2 />
                ) : (
                    <ProblemContainer />
                )}
                <div styleName="workspace" ref={workspaceRef}>
                    <div styleName="editor-preview-container">
                        <EditorContainer />
                        {codingExerciseStore.isPreviewVisible && <PreviewResizer />}
                    </div>
                    <ResultContainer
                        workspaceRef={workspaceRef}
                        store={codingExerciseStore.resultStore}
                    />
                </div>
            </div>
            <CurriculumItemFooter
                renderLeftButtons={() => (
                    <div styleName="ce-tag">
                        <div>{gettext('Coding Exercise')}</div>
                    </div>
                )}
                renderRightButtons={() => (
                    <Button
                        componentClass={NextItemLink}
                        data-purpose="next-item"
                        size="medium"
                        onClick={() => codingExerciseStore.trackEvent('continue')}
                    >
                        {gettext('Next')}
                    </Button>
                )}
                shortcutsMenuItemProps={{
                    renderHotkeyOverlay: noop,
                    target: 'blank',
                    href: '/learners/coding-exercises/keys_map',
                    onClick: () => {
                        codingExerciseStore.trackEvent('keyboard_shortcut');
                    },
                }}
                reportId={codingExerciseStore.question.id}
                reportType="assessment"
            />
            <WelcomeModal
                isOpen={codingExerciseStore.isWelcomeModalOpen}
                onClose={codingExerciseStore.closeWelcomeModal}
                finishButtonText={gettext('Get started')}
                disableFooterView={true}
                steps={[
                    {
                        title: gettext('Welcome to a new experience'),
                        description: gettext(
                            'Coding exercises now appear in an IDE-like interface. ' +
                                'You may also find instructor-provided guidance like hints, solutions, and related lectures.',
                        ),
                        imageSource: udLink.toStorageStaticAsset(
                            'instructor/coding_exercise/learner-welcome-1.gif',
                        ),
                    },
                ]}
                modalProps={{
                    getContainer: codingExerciseStore.parentContainer as () => HTMLElement,
                }}
            />
        </>
    );
};

const CodingExerciseObserver = observer(CodingExerciseComponent);

interface Props {
    courseTakingStore: CourseTakingStore;
    quizViewStore: QuizViewStore;
    codingExerciseStore?: CodingExerciseStore; // for test purposes
}
const CodingExerciseContext: React.FC<Props> = (props) => {
    const [codingExerciseStore] = useState(() => {
        const store =
            props.codingExerciseStore ??
            new CodingExerciseStore(props.courseTakingStore, props.quizViewStore);
        store.initializeFiles();
        return store;
    });

    useEffect(
        (() => {
            const {hasOpenedCodingExercise, hasSidebarContent} = props.courseTakingStore;
            if (!hasOpenedCodingExercise && hasSidebarContent) {
                props.courseTakingStore.toggleSidebar();
            }
            props.courseTakingStore.hasOpenedCodingExercise = true;
            codingExerciseStore.loadStudentFiles();
            codingExerciseStore.loadWelcomeModalOpen();
        }) as VoidFunction,
        [],
    );

    return (
        <Provider codingExerciseStore={codingExerciseStore} quizViewStore={props.quizViewStore}>
            <CodingExerciseObserver />
        </Provider>
    );
};

export const CodingExercise = requires('courseTakingStore', 'quizViewStore')(CodingExerciseContext);
