import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../../registry/requires';

@inject('practiceTestStore', 'fullscreenStore')
@requires('quizViewStore')
@observer
export default class StopTestConfirmModal extends Component {
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
        const numUnanswered = quizViewStore.questions.filter((q) => !q.isAnswered).length;
        const total = quizViewStore.questions.length;
        const percentLeft = Math.round((100 * numUnanswered) / total);
        const text = interpolate(
            gettext(
                'You still have %(percentLeft)s% of the test remaining. ' +
                    "If you don't want to submit this attempt now, you can always pause the test " +
                    'and return to it later. Remember that you can take this test as many times as ' +
                    'you want.',
            ),
            {percentLeft},
            true,
        );

        return (
            <ConfirmModal
                confirmText={gettext('Finish test')}
                onCancel={practiceTestStore.cancelStopTest}
                onConfirm={practiceTestStore.confirmStopTest}
                title={gettext('Are you sure you want to finish the test?')}
                isOpen={practiceTestStore.isStopTestConfirmationOpen}
                getContainer={this.getOverlayContainer}
            >
                {text}
            </ConfirmModal>
        );
    }
}
