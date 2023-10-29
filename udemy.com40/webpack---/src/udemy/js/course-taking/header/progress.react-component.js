import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import TrophyIcon from '@udemy/icons/dist/trophy.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {tokens} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import ProgressBar from 'progressbar.js';
import PropTypes from 'prop-types';
import React from 'react';

import requires from '../registry/requires';
import ProgressPopoverContent from './progress-popover-content.react-component';

import './progress.less';

@requires('courseTakingStore', 'certificateStore')
@observer
export default class Progress extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            course: PropTypes.shape({
                hasCertificate: PropTypes.bool,
            }).isRequired,
            courseId: PropTypes.number,
            isCourseCompleted: PropTypes.bool,
            completionRatio: PropTypes.number,
            numPublishedCurriculumItems: PropTypes.number,
            numCompletedItems: PropTypes.number,
        }).isRequired,
        certificateStore: PropTypes.shape({
            isCertificateEnabled: PropTypes.bool,
            isCertificateReady: PropTypes.bool,
            certificate: PropTypes.object,
            loadCertificate: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        reaction(
            () => this.props.courseTakingStore.completionRatio,
            this.initializeProgressAnimation,
        );

        // necessary for when resizing to mobile view and then back to larger view
        this.initializeProgressAnimation();

        // check if user has the certificate already, may be true even if course isn't completed
        if (!this.props.courseTakingStore.isCourseCompleted) {
            this.props.certificateStore.loadCertificate(false);
        }
    }

    @autobind
    setProgressCircle(el) {
        this.progressCircleEl = el;
    }

    @autobind
    initializeProgressAnimation() {
        if (!this.progressCircleEl) {
            return;
        }

        const progressAnimation = new ProgressBar.Circle(this.progressCircleEl, {
            duration: -1,
            strokeWidth: 6,
            trailWidth: 6, // this needs to be same as strokeWidth
            easing: 'easeOut',
            color: tokens['color-indigo-200'],
            trailColor: tokens['color-gray-400'],
            svgStyle: null,
            autoStyleContainer: false,
        });

        progressAnimation &&
            progressAnimation.animate(this.props.courseTakingStore.completionRatio);
    }

    get certificateStatus() {
        const {isCertificateEnabled, isCertificateReady, certificate} = this.props.certificateStore;

        if (!isCertificateEnabled) {
            return null;
        }

        const trophy = (
            <TrophyIcon
                label={false}
                color="inherit"
                data-purpose="progress-icon"
                styleName={classNames('trophy', {'trophy-ready': isCertificateReady})}
            />
        );
        const trophyGlow = certificate && !certificate.isReady ? trophy : null;

        return (
            <span styleName="trophy-container">
                {trophy}
                {trophyGlow}
            </span>
        );
    }

    get progressLabel() {
        const {isCertificateEnabled, isCertificateReady} = this.props.certificateStore;

        if (isCertificateEnabled && isCertificateReady) {
            return gettext('Get certificate');
        }
        return gettext('Your progress');
    }

    get popoverTrigger() {
        return (
            <Button udStyle="link" typography="ud-text-sm" styleName="progress-btn">
                <span ref={this.setProgressCircle} styleName="progress-circle">
                    {this.certificateStatus}
                </span>
                <span styleName="progress-label progress-text" data-purpose="progress-label">
                    {this.progressLabel}
                </span>
                <ExpandIcon label={false} styleName="progress-text" color="inherit" />
            </Button>
        );
    }

    render() {
        return (
            <Popover placement="bottom" trigger={this.popoverTrigger}>
                <ProgressPopoverContent />
            </Popover>
        );
    }
}
