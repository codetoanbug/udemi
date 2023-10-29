import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../../registry/requires';

@inject('practiceTestStore', 'fullscreenStore')
@requires('quizViewStore')
@observer
export default class FinishTestConfirmModal extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    render() {
        const {practiceTestStore, quizViewStore} = this.props;
        const numSkipped = quizViewStore.questions.filter((question) => {
            return !question.isAnswered && question.wasSkipped;
        }).length;
        const numMarkedForReview = quizViewStore.questions.filter((question) => {
            return question.isMarkedForReview;
        }).length;

        let text;

        let skippedText;
        if (numSkipped === 0) {
            skippedText = '';
        } else {
            skippedText = ninterpolate(
                'You skipped %s question.',
                'You skipped %s questions.',
                numSkipped,
            );
        }

        let markedText;
        if (numMarkedForReview === 0) {
            markedText = '';
        } else {
            markedText = ninterpolate(
                'You marked %s question for review.',
                'You marked %s questions for review.',
                numMarkedForReview,
            );
        }

        if (numSkipped === 0 && numMarkedForReview === 0) {
            text = gettext('You may still review the answers you have entered.');
        } else {
            text = `${skippedText} ${markedText}`.trim();
        }

        return (
            <ConfirmModal
                cancelText={gettext('Review questions')}
                confirmText={gettext('Finish test')}
                onCancel={practiceTestStore.cancelFinishTest}
                onConfirm={practiceTestStore.confirmFinishTest}
                title={gettext('Are you sure you want to finish?')}
                isOpen={practiceTestStore.isFinishTestConfirmationOpen}
                requireExplicitAction={true}
                getContainer={this.getOverlayContainer}
            >
                {text}
            </ConfirmModal>
        );
    }
}
