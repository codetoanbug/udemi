import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import ArticleAsset from 'asset/article/article-asset.react-component';

import requires from '../../registry/requires';
import {ARTICLE_COMPLETION_DELAY, ARTICLE_STARTED_EVENT_DELAY} from './constants';
import TextViewer from './text-viewer.react-component';

@requires('courseTakingStore', 'lectureViewStore')
export default class ArticleViewer extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        lectureViewStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.startLectureTimeoutId = setTimeout(
            this.props.lectureViewStore.fireLectureStartedEvent,
            ARTICLE_STARTED_EVENT_DELAY,
        );
        this.completeLectureTimeoutId = setTimeout(this.completeLecture, ARTICLE_COMPLETION_DELAY);
    }

    componentWillUnmount() {
        clearTimeout(this.startLectureTimeoutId);
        clearTimeout(this.completeLectureTimeoutId);
    }

    @autobind
    completeLecture() {
        const {lecture} = this.props.lectureViewStore;

        const progressData = [
            {
                position: 1,
                total: 1,
                context: {type: 'Article'},
                time: new Date().toISOString(),
            },
        ];
        lecture.updateProgress(progressData);
        this.props.courseTakingStore.markCurrentItemComplete();
        this.props.lectureViewStore.fireLectureCompletedEvent();
    }

    render() {
        const {lecture} = this.props.lectureViewStore;
        return (
            <TextViewer>
                <ArticleAsset
                    id={lecture.asset.id}
                    courseId={lecture.courseId}
                    lectureId={lecture.id}
                />
            </TextViewer>
        );
    }
}
