import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import PresentationAsset from 'asset/presentation/presentation-asset.react-component';

import {ITEM_TYPES} from '../../curriculum/constants';
import CurriculumItemControls from '../../curriculum/controls/curriculum-item-controls.react-component';
import requires from '../../registry/requires';

@requires('courseTakingStore', 'lectureViewStore')
@observer
export default class PresentationViewer extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        lectureViewStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.lectureViewStore.onContentReady();
    }

    @autobind
    handleStart() {
        this.props.lectureViewStore.fireLectureStartedEvent();
    }

    @autobind
    updateProgress(progressData) {
        progressData.time = new Date().toISOString();
        progressData.context = {type: 'Presentation'};
        this.props.lectureViewStore.lecture.updateProgress([progressData]);
    }

    @autobind
    renderFooter(Component, props) {
        const {lecture} = this.props.lectureViewStore;

        return (
            <Component
                {...props}
                className={classNames(props.className, 'ct-dashboard-separator')}
                right={
                    <CurriculumItemControls
                        reportId={lecture.id}
                        reportType={ITEM_TYPES.LECTURE}
                        downloadUrl={!!lecture.downloadUrl && lecture.asset.downloadUrl}
                    />
                }
            />
        );
    }

    @autobind
    handleComplete() {
        this.props.courseTakingStore.markCurrentItemComplete();
        this.props.lectureViewStore.fireLectureCompletedEvent();
    }

    render() {
        const {lecture} = this.props.lectureViewStore;

        return (
            <PresentationAsset
                id={lecture.asset.id}
                asset={lecture.asset}
                courseId={lecture.courseId}
                lectureId={lecture.id}
                onStart={this.handleStart}
                onComplete={this.handleComplete}
                onSlideChange={this.updateProgress}
                renderFooter={this.renderFooter}
            />
        );
    }
}
