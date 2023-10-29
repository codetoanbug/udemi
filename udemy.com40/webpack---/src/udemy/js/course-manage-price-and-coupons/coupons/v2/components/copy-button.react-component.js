import {getUniqueId} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {showSuccessToast, showErrorToast} from 'instructor/toasts';

export const showCopySuccessToast = () => showSuccessToast(gettext('Copied to clipboard'));
export const showCopyErrorToast = () => showErrorToast(gettext('Unable to copy to clipboard'));

export default class CopyButton extends Component {
    static propTypes = {
        onSuccess: PropTypes.func,
        onError: PropTypes.func,
    };

    static defaultProps = {
        onSuccess: showCopySuccessToast,
        onError: showCopyErrorToast,
    };

    constructor(props) {
        super(props);
        this.id = getUniqueId('copy-button');
        this.clipboard = new Clipboard(`#${this.id}`);
        this.clipboard.on('success', this.props.onSuccess);
        this.clipboard.on('error', this.props.onError);
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    render() {
        const {onSuccess, onError, ...props} = this.props;
        return <Button {...props} id={this.id} />;
    }
}
