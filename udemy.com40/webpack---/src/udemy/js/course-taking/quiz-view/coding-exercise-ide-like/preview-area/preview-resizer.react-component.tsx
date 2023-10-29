import CollapseHorizontalIcon from '@udemy/icons/dist/collapse-horizontal.ud-icon';
import ExpandHorizontalIcon from '@udemy/icons/dist/expand-horizontal.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import CourseTakingStore from 'course-taking/course-taking.mobx-store';
import requires from 'course-taking/registry/requires';
import {Preview} from 'instructor/coding-exercise-preview/preview.react-component';

import {CodingExerciseStore} from '../coding-exercise.mobx-store';

import './preview-resizer.less';

const PreviewResizerComponent: React.FC<{courseTakingStore: CourseTakingStore}> = ({
    courseTakingStore,
}) => {
    const store = useContext(MobXProviderContext).codingExerciseStore as CodingExerciseStore;
    const {previewExpanded} = store;

    function onMove(event: never, resizeData: {width: number; container: HTMLDivElement}) {
        const w = Math.min(
            window.document.documentElement.scrollWidth - 32,
            Math.max(16, resizeData.width),
        );
        courseTakingStore.setCodingExerciseResizePanelValue('preview', w);
    }

    return (
        <Resizer
            styleName={classNames('preview-container', {
                'preview-expanded': previewExpanded,
            })}
            style={{
                width: courseTakingStore.ceResizablePanelSizes.preview
                    ? `${courseTakingStore.ceResizablePanelSizes.preview}px`
                    : '44.4%',
            }}
            onMove={onMove}
            onStart={store.onResizerStart}
            onEnd={store.onResizerEnd}
            edges={{left: true}}
        >
            <div styleName={classNames('drag-handle', {hidden: previewExpanded})} />
            <div styleName="header">
                <div styleName="preview-header-inner">
                    <div styleName="title-container">
                        <span className="ud-heading-sm">{gettext('Preview')}</span>
                    </div>
                    <Tooltip
                        udStyle="black"
                        placement={'bottom'}
                        detachFromTarget={true}
                        trigger={
                            <IconButton
                                onClick={store.togglePreviewExpanded}
                                size="medium"
                                udStyle="ghost"
                                styleName="button"
                            >
                                {previewExpanded ? (
                                    <CollapseHorizontalIcon label={false} size="small" />
                                ) : (
                                    <ExpandHorizontalIcon label={false} size="small" />
                                )}
                            </IconButton>
                        }
                    >
                        {previewExpanded ? gettext('Collapse Preview') : gettext('Expand Preview')}
                    </Tooltip>
                </div>
            </div>
            <Preview
                files={store.combinedFiles}
                isResizing={store.isPanelResizing}
                isVisible={store.isPreviewVisible}
                language={store.question.prompt.language}
                dd_key="quiz.coding_exercise.frontend"
            />
        </Resizer>
    );
};

export const PreviewResizer = requires('courseTakingStore')(observer(PreviewResizerComponent));
