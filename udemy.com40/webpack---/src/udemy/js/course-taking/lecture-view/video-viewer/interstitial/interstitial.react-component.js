import SolidArrowRightIcon from '@udemy/icons/dist/solid-arrow-right.ud-icon';
import {Button} from '@udemy/react-core-components';
import {tokens} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import ProgressBar from 'progressbar.js';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import FastFeedback from 'structured-data/fast-feedback/fast-feedback.react-component';

import {TRACKING_CATEGORIES} from '../../../constants';
import ItemLink, {
    getCurriculumItemNavigationProps,
} from '../../../curriculum/item-link.react-component';
import requires from '../../../registry/requires';
import {AUTOPLAY_DEFAULT_COUNTDOWN, TRACKING_ACTIONS} from './constants';
import './interstitial.less';

@withRouter
@requires('courseTakingStore', 'videoViewerStore')
@observer
export default class Interstitial extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        videoViewerStore: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.setAutoNextTimeout();
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.INTERSTITIAL, TRACKING_ACTIONS.VIEW);
        this.initializeAutoplayAnimation();
    }

    componentWillUnmount() {
        this.clearAutoNextTimeout();
    }

    @autobind
    setAutoNextTimeout() {
        if (this.props.videoViewerStore.isAutoplayEnabled) {
            this.autoNextTimeout = setTimeout(this.autoGoToNext, AUTOPLAY_DEFAULT_COUNTDOWN);
        }
    }

    @autobind
    clearAutoNextTimeout() {
        clearTimeout(this.autoNextTimeout);
    }

    @autobind
    setProgressBar(el) {
        this.progressCircleEl = el;
    }

    initializeAutoplayAnimation() {
        if (!this.progressCircleEl) {
            return;
        }

        // duration is -1 when autoplay is disabled causing the animation to "not start"
        const autoplayAnimation = new ProgressBar.Circle(this.progressCircleEl, {
            duration: this.props.videoViewerStore.isAutoplayEnabled
                ? AUTOPLAY_DEFAULT_COUNTDOWN
                : -1,
            strokeWidth: 6, // same as @auto-play-animation-stroke-width
            trailWidth: 6, // this needs to be same as strokeWidth
            easing: 'easeOut',
            color: tokens['color-white'],
            trailColor: tokens['color-gray-300'],
            svgStyle: null,
            autoStyleContainer: false,
        });

        autoplayAnimation && autoplayAnimation.animate(1.0);
    }

    @autobind
    trackNext() {
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.INTERSTITIAL, TRACKING_ACTIONS.NEXT);
    }

    @autobind
    autoGoToNext() {
        const {courseTakingStore, history} = this.props;
        if (!courseTakingStore.nextCurriculumItem) {
            return;
        }
        this.trackNext();
        history.push(
            getCurriculumItemNavigationProps(courseTakingStore.nextCurriculumItem, history),
        );
    }

    @autobind
    stayHere() {
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.INTERSTITIAL,
            TRACKING_ACTIONS.DISMISS,
        );
        this.props.videoViewerStore.hideInterstitial();
    }

    render() {
        const {courseTakingStore} = this.props;
        const {nextCurriculumItem} = courseTakingStore;

        return (
            <div styleName="container" data-purpose="container">
                <div styleName="inner">
                    <div className="ud-text-md" styleName="up-next">
                        {gettext('Up next')}
                    </div>
                    <h2 styleName="title">
                        <ItemLink
                            className="ud-text-xl"
                            styleName="link"
                            itemType={nextCurriculumItem.type}
                            itemId={nextCurriculumItem.id}
                        >
                            {nextCurriculumItem.displayTitle}
                        </ItemLink>
                    </h2>
                    <div>
                        <ItemLink
                            itemType={nextCurriculumItem.type}
                            itemId={nextCurriculumItem.id}
                            styleName="continue-button"
                            onClick={this.trackNext}
                            data-purpose="go-to-next-button"
                        >
                            <div ref={this.setProgressBar} styleName="continue-circle" />
                            <SolidArrowRightIcon
                                label={gettext('Continue')}
                                color="inherit"
                                size="xlarge"
                            />
                        </ItemLink>
                    </div>
                    <div>
                        <Button
                            udStyle="ghost"
                            styleName="link"
                            onClick={this.stayHere}
                            data-purpose="cancel-button"
                        >
                            {gettext('Cancel')}
                        </Button>
                    </div>
                    <div>
                        <FastFeedback
                            onStayInFlow={this.clearAutoNextTimeout}
                            onFinishFlow={this.setAutoNextTimeout}
                            courseTakingStore={courseTakingStore}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
