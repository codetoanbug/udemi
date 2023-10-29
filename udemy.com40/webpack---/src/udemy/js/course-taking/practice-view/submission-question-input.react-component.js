import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import Question from './question.react-component';

@observer
export default class SubmissionQuestionInput extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        isSubmitted: PropTypes.bool.isRequired,
    };

    @autobind
    @action
    onBodyChange(value) {
        this.props.question.userAnswer.body = value;
    }

    renderViewer() {
        return (
            <RichTextViewer
                openBlankTarget={true}
                unsafeHTML={this.props.question.userAnswer.body}
            />
        );
    }

    renderEditor() {
        return (
            <RichTextEditor
                theme={RichTextEditor.THEMES.ASSIGNMENT}
                placeholder={gettext('Add your submission')}
                value={this.props.question.userAnswer.body}
                minHeight={`${pxToRem(150)}rem`}
                onValueChange={this.onBodyChange}
            />
        );
    }

    render() {
        const {question, isSubmitted} = this.props;
        return (
            <Question question={question} data-purpose="submission-question-input">
                {!isSubmitted || !question.userAnswer ? this.renderEditor() : this.renderViewer()}
            </Question>
        );
    }
}
