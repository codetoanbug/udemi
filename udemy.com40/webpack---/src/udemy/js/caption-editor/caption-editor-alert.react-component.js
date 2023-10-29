import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './caption-editor.less';

@inject('store')
@observer
export default class CaptionEditorAlert extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
    };

    @autobind
    dismissMessage() {
        this.props.store.dismissMessageAlert(this.props.message.id);
    }

    render() {
        return !this.props.store.hasSeenAlert(this.props.message.id) ? (
            <AlertBanner
                data-purpose="caption-dismissible-alert"
                styleName="alert-banner"
                showIcon={false}
                title={this.props.message.title}
                body={this.props.message.body}
                ctaText={gettext('Dismiss')}
                onAction={this.dismissMessage}
                dismissButtonProps={false}
            />
        ) : null;
    }
}
