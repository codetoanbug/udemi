import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('practiceTestStore', 'fullscreenStore')
@observer
export default class TimesUpConfirmModal extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    render() {
        const {practiceTestStore} = this.props;
        const text = gettext(
            'If you want to see how you would do in a real test situation, end the test now. ' +
                'Otherwise, you can keep going, but this attempt will not count as a pass.',
        );

        return (
            <ConfirmModal
                cancelText={gettext('Keep going')}
                confirmText={gettext('End test')}
                onCancel={practiceTestStore.timer.cancelTimesUp}
                onConfirm={practiceTestStore.timer.confirmTimesUp}
                title={gettext("Time's up!")}
                isOpen={practiceTestStore.timer.isTimesUpConfirmationOpen}
                getContainer={this.getOverlayContainer}
            >
                {text}
            </ConfirmModal>
        );
    }
}
