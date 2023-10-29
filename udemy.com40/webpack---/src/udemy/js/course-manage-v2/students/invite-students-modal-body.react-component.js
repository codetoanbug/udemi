import {FormGroup, TextArea} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './invite-students-modal-body.less';

@observer
export default class InviteStudentsModalBody extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    handleChange(event) {
        this.props.store.setEmails(event.target.value);
    }

    render() {
        let errorMessage;
        if (this.props.store.error) {
            errorMessage = (
                <AlertBanner
                    showCta={false}
                    udStyle="error"
                    styleName="alert-banner"
                    title={this.props.store.error}
                />
            );
        }
        return (
            <>
                {errorMessage}
                <FormGroup
                    label={gettext('Invite students to the course by adding their email below:')}
                >
                    <TextArea
                        name="emails"
                        placeholder={gettext('Enter one email per line')}
                        value={this.props.store.emails}
                        onChange={this.handleChange}
                    />
                </FormGroup>
            </>
        );
    }
}
