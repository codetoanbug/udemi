import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';

import requires from '../../registry/requires';
import {HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT} from './constants';

import './instructions.less';

@requires('quizViewStore')
@observer
export default class Instructions extends React.Component {
    static propTypes = {
        quizViewStore: PropTypes.object.isRequired,
    };

    onMove(event, resizeData) {
        const h = Math.min(HEADER_MAX_HEIGHT, Math.max(HEADER_MIN_HEIGHT, resizeData.height));
        resizeData.container.style.height = `${h}px`;
    }

    render() {
        const quiz = this.props.quizViewStore.quiz;
        const question = this.props.quizViewStore.questions[0];

        return (
            <Resizer styleName="instructions" onMove={this.onMove} edges={{bottom: true}}>
                <div
                    styleName="content"
                    data-purpose="instructions-content"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        return true;
                    }}
                >
                    <div className="ud-heading-xl" styleName="title" data-purpose="exercise-title">
                        {quiz.title}
                    </div>
                    {question.prompt.instructions ? (
                        <RichTextViewer
                            className="ud-text-sm"
                            unsafeHTML={question.prompt.instructions}
                        />
                    ) : null}
                </div>
                <div styleName="drag-handle" />
            </Resizer>
        );
    }
}
