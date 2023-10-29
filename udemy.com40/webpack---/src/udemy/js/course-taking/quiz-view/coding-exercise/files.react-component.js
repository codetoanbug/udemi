import {Tracker} from '@udemy/event-tracking';
import {BlockList} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import {CodingExerciseFileStudentActionEvent} from 'course-taking/events';

import CodingExerciseStore from './coding-exercise.mobx-store';
import {SIDEBAR_MIN_WIDTH} from './constants';

import './files.less';

@inject('codingExerciseStore')
@observer
export default class Files extends React.Component {
    static propTypes = {
        codingExerciseStore: PropTypes.instanceOf(CodingExerciseStore).isRequired,
    };

    onMove(event, resizeData) {
        const w = Math.max(SIDEBAR_MIN_WIDTH, resizeData.width);
        resizeData.container.style.width = `${w}px`;
    }

    @autobind
    onSelectFile(file) {
        this.props.codingExerciseStore.selectFile(file);

        const language = (
            this.props.codingExerciseStore.question.prompt.language || ''
        ).toLowerCase();
        Tracker.publishEvent(
            new CodingExerciseFileStudentActionEvent({
                action: 'switch',
                fileName: file.fileName,
                assessmentId: this.props.codingExerciseStore.question.id,
                language,
            }),
        );
    }

    render() {
        return (
            <Resizer styleName="files" onMove={this.onMove} edges={{right: true}}>
                <BlockList size="small" padding="tight" styleName="file-list">
                    {this.props.codingExerciseStore.studentFiles.map((file) => (
                        <BlockList.Item
                            key={file.fileName}
                            componentClass="button"
                            styleName={classNames('file', {
                                active: this.props.codingExerciseStore.isActiveFile(file),
                            })}
                            onClick={() => this.onSelectFile(file)}
                        >
                            {file.fileName}
                        </BlockList.Item>
                    ))}
                </BlockList>
                <div styleName="drag-handle" />
            </Resizer>
        );
    }
}
