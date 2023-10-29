import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {assetTypes} from '../../asset-library/constants';
import CurriculumLectureModel from '../../curriculum/item/lecture/curriculum-lecture.mobx-model';
import ChildAssetCreator from './child-asset-creator.react-component';
import VideoMashupSynchronizer from './video-mashup-synchronizer.react-component';
import './video-mashup-asset-creator.less';

// eslint-disable-next-line react/prop-types
const MashupStep = ({className, stepNum, stepLabel, children}) => (
    <div className={className} styleName="step">
        <div styleName="step-header">
            <div styleName="step-num">{stepNum}</div>
            <div className="ud-text-lg" styleName="step-title">
                {stepLabel}
            </div>
        </div>
        <div data-purpose={`mashup-step-${stepNum}`}>{children}</div>
    </div>
);

@observer
export default class VideoMashupAssetCreator extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        onAssetSelected: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.creator.reset();
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
    }

    @autobind
    onBeforeUnload(event) {
        if (this.creator.isProcessing) {
            const msg = gettext("You are creating a video mashup. You're going to lose your data.");
            event.returnValue = msg;
            return msg;
        }
    }

    get creator() {
        return this.props.curriculumItem.videoMashupAssetCreator;
    }

    getStepClassName(child) {
        return classNames({
            'step-draft': !!child.asset && !child.isConfirmed,
            'step-completed': !!child.asset && child.isConfirmed,
        });
    }

    render() {
        return (
            <>
                <MashupStep
                    stepNum={1}
                    styleName={this.getStepClassName(this.creator.videoChild)}
                    stepLabel={gettext('Pick a Video')}
                >
                    <ChildAssetCreator
                        assetType={assetTypes.video}
                        child={this.creator.videoChild}
                        curriculumItem={this.props.curriculumItem}
                        saveLabel={gettext('Use this video')}
                    />
                </MashupStep>
                <MashupStep
                    stepNum={2}
                    styleName={this.getStepClassName(this.creator.presentationChild)}
                    stepLabel={gettext('Pick a Presentation')}
                >
                    <ChildAssetCreator
                        assetType={assetTypes.presentation}
                        child={this.creator.presentationChild}
                        curriculumItem={this.props.curriculumItem}
                        saveLabel={gettext('Use this presentation')}
                    />
                </MashupStep>
                <MashupStep stepNum={3} stepLabel={gettext('Synchronize Video & Presentation')}>
                    <VideoMashupSynchronizer
                        creator={this.creator}
                        isSaving={this.props.curriculumItem.isSaving}
                        onSave={this.props.onAssetSelected}
                    />
                </MashupStep>
            </>
        );
    }
}
