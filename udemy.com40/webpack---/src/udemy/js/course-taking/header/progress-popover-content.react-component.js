import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CpeGetCertificate from '../certificate/cpe-get-certificate.react-component';
import requires from '../registry/requires';
import './progress-popover-content.less';

@requires('courseTakingStore', 'certificateStore')
@observer
export default class ProgressPopoverContent extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            numPublishedCurriculumItems: PropTypes.number,
            numCompletedItems: PropTypes.number,
            isCourseCpeCompliant: PropTypes.bool,
        }).isRequired,
        certificateStore: PropTypes.shape({
            certificate: PropTypes.object,
            cpeCertificate: PropTypes.object,
            isCertificateEnabled: PropTypes.bool,
            isCertificateReady: PropTypes.bool,
        }).isRequired,
    };

    get certInProgressMessage() {
        return (
            <div className="ud-text-sm">
                {gettext('Your completion certificate is being prepared!')}
            </div>
        );
    }

    renderCpeCertificateDropdown() {
        const {certificate, isCertificateReady} = this.props.certificateStore;
        if (!isCertificateReady) {
            return this.certInProgressMessage;
        }
        return (
            <>
                <Button
                    size="small"
                    componentClass="a"
                    href={certificate.url}
                    target="_blank"
                    data-purpose="get-udemy-certificate"
                    udStyle="secondary"
                >
                    {gettext('Get Udemy certificate')}
                </Button>
                <CpeGetCertificate label={gettext('Get NASBA certificate')} />
            </>
        );
    }

    certificateStatusMessage() {
        const {certificate} = this.props.certificateStore;
        if (certificate) {
            if (this.props.courseTakingStore.isCourseCpeCompliant) {
                return this.renderCpeCertificateDropdown();
            }
            return certificate.isReady ? (
                <Button
                    size="small"
                    componentClass="a"
                    href={certificate.url}
                    target="_blank"
                    data-purpose="get-certificate"
                >
                    {gettext('Get certificate')}
                </Button>
            ) : (
                this.certInProgressMessage
            );
        }

        return <div className="ud-text-sm">{gettext('Finish course to get your certificate')}</div>;
    }

    renderProgressText() {
        const {numCompletedItems, numPublishedCurriculumItems} = this.props.courseTakingStore;
        return (
            <div data-purpose="progress-popover-text" className="ud-heading-sm">
                {interpolate(gettext('%s of %s complete.'), [
                    numCompletedItems,
                    numPublishedCurriculumItems,
                ])}
            </div>
        );
    }

    render() {
        return (
            <div styleName="container">
                {this.renderProgressText()}
                {this.props.certificateStore.isCertificateEnabled &&
                    this.certificateStatusMessage()}
            </div>
        );
    }
}
