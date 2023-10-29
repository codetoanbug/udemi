import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('practiceTestStore', 'fullscreenStore')
@observer
export default class PauseTestModal extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    @autobind
    onClose() {
        this.props.practiceTestStore.timer.unpause();
    }

    render() {
        // This is technically not a ConfirmModal as we'll unpause the test no matter what the
        // user does to hide the modal.
        return (
            <Modal
                isOpen={this.props.practiceTestStore.timer.isPausedModalOpen}
                onClose={this.onClose}
                getContainer={this.getOverlayContainer}
                title={gettext('Your test is paused')}
            >
                {gettext(
                    'You can leave this page and resume this test at any time. ' +
                        'Your progress will be saved.',
                )}
                <FooterButtons>
                    <Button data-purpose="unpause-test" onClick={this.onClose}>
                        {gettext('Resume test')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
