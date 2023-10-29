import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import udMe from 'utils/ud-me';

import requires from '../registry/requires';
import CpeSecondaryEmailStore from './cpe-secondary-email.mobx-store';

@requires('certificateStore', 'cpeSecondaryEmailStore')
@observer
export default class CpeGetCertificate extends React.Component {
    static propTypes = {
        // FIXME - make it instance of when we have time to rewrite all tests
        certificateStore: PropTypes.object.isRequired,
        cpeSecondaryEmailStore: PropTypes.instanceOf(CpeSecondaryEmailStore).isRequired,
        className: PropTypes.string,
        label: PropTypes.string,
    };

    static defaultProps = {
        certificateUrl: '',
        className: '',
        label: '',
    };

    @computed
    get isSecondaryEmailProvided() {
        const {cpeSecondaryEmailStore} = this.props;
        return cpeSecondaryEmailStore.isSecondaryEmailProvided || udMe.settings.secondary_email;
    }

    @autobind
    handleClick(e) {
        if (!this.isSecondaryEmailProvided) {
            e.preventDefault();
            this.props.cpeSecondaryEmailStore.openModal();
        }
    }

    render() {
        const {certificateStore, className, label} = this.props;
        const certificateUrl = certificateStore.cpeCertificate
            ? certificateStore.cpeCertificate.url
            : null;
        return (
            <Button
                size="small"
                componentClass="a"
                href={certificateUrl}
                disabled={!certificateStore.isCertificateReady}
                target="_blank"
                data-purpose="get-cpe-certificate"
                className={className}
                udStyle="secondary"
                onClick={this.handleClick}
            >
                {label}
            </Button>
        );
    }
}
