import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ASSESSMENT_BANNER_ACTIONS, TRACKING_CATEGORIES} from '../constants';
import InfoSection from '../course-content/info-section.react-component';
import requires from '../registry/requires';
import {ASSESSMENT_BASE_URL} from './constants';

import './assessment-launcher-section.less';

@requires('courseTakingStore', {name: 'videoViewerStore', optional: true})
@observer
export default class AssessmentLauncherSection extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            adaptiveAssessmentForBanner: PropTypes.string,
            track: PropTypes.func,
        }).isRequired,
        useAlternateStyle: PropTypes.bool,
        videoViewerStore: PropTypes.shape({
            pause: PropTypes.func,
        }),
    };

    static defaultProps = {
        useAlternateStyle: false,
        videoViewerStore: null,
    };

    componentDidMount() {
        if (this.props.courseTakingStore.adaptiveAssessmentForBanner) {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.ASSESSMENT_BANNER_VIEW,
                ASSESSMENT_BANNER_ACTIONS.DISPLAY_ASSESSMENT_BANNER,
            );
        }
    }

    get assessmentUrl() {
        const {adaptiveAssessmentForBanner} = this.props.courseTakingStore;
        return `${ASSESSMENT_BASE_URL}${adaptiveAssessmentForBanner}/`;
    }

    @autobind
    trackAssessmentBannerClick() {
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.ASSESSMENT_BANNER_CLICK,
            ASSESSMENT_BANNER_ACTIONS.CLICK_ASSESSMENT_BANNER,
        );
        if (this.props.videoViewerStore) {
            this.props.videoViewerStore.pause();
        }
    }

    render() {
        if (!this.props.courseTakingStore.adaptiveAssessmentForBanner) {
            return null;
        }
        const {useAlternateStyle} = this.props;
        return (
            <InfoSection
                title={gettext('Take a Udemy Assessment to check your skills')}
                useAlternateStyle={useAlternateStyle}
            >
                <div styleName="assessment-launch">
                    {gettext(
                        'Made by Udemy, this generalized assessment is a great way to check in on your skills.',
                    )}
                </div>
                <Button
                    componentClass="a"
                    href={this.assessmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    udStyle="brand"
                    data-purpose="assessment-banner-button-click"
                    onClick={this.trackAssessmentBannerClick}
                >
                    {gettext('Launch Assessment')}
                </Button>
            </InfoSection>
        );
    }
}
