import {Button} from '@udemy/react-core-components';
import {ModalTrigger, Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import InviteStudentsModalBody from './invite-students-modal-body.react-component';
import InviteStudentsStore from './invite-students.mobx-store';

@observer
export default class InviteStudentsLink extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new InviteStudentsStore(props.courseId);
    }

    render() {
        return (
            <ModalTrigger
                trigger={
                    <Button name="invite" onClick={this.store.reset}>
                        {gettext('Invite students')}
                    </Button>
                }
                renderModal={(props) => (
                    <Modal {...props} title={gettext('Invite students')}>
                        <InviteStudentsModalBody store={this.store} />
                        <FooterButtons>
                            <Button
                                name="send"
                                disabled={this.store.isLoading || this.store.emails === ''}
                                onClick={() => this.store.sendInvites(props.onClose)}
                            >
                                {gettext('Send Invitation')}
                            </Button>
                        </FooterButtons>
                    </Modal>
                )}
            />
        );
    }
}
