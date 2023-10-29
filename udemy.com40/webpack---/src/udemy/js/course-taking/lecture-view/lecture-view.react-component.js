import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ASSET_TYPE} from 'asset/constants';
import udPerf from 'utils/ud-performance';

import CurriculumItemLoader from '../curriculum/curriculum-item-loader.react-component';
import registers from '../registry/registers';
import requires from '../registry/requires';
import LectureViewStore from './lecture-view.mobx-store';
import PresentationViewer from './presentation-viewer/presentation-viewer.react-component';
import ArticleViewer from './text-viewer/article-viewer.react-component';
import UnavailableViewer from './text-viewer/unavailable-viewer.react-component';
import VideoViewer from './video-viewer/video-viewer.react-component';

import './lecture-view.less';

@inject('fullscreenStore')
@requires('courseTakingStore')
@registers('lectureViewStore')
@observer
export default class LectureView extends React.Component {
    static propTypes = {
        fullscreenStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.lectureViewStore = new LectureViewStore(
            props.courseTakingStore,
            props.fullscreenStore,
        );
        udPerf.start(`CourseTakingV5.lecture-loading-${this.lectureViewStore.assetType}`);
    }

    componentDidMount() {
        this.lectureViewStore.loadLecture();
    }

    get content() {
        const {isUserInstructor, isPreviewingAsStudent} = this.props.courseTakingStore;
        const {lecture} = this.lectureViewStore;
        // For students, failed assets should be treated like assetless lectures
        // For instructors, actually render the failed asset and its errors
        if (lecture.isMissingAsset && (!isUserInstructor || isPreviewingAsStudent)) {
            return <UnavailableViewer />;
        }

        if (lecture.isVideo) {
            return <VideoViewer />;
        } else if (lecture.asset && lecture.asset.type === ASSET_TYPE.PRESENTATION) {
            return <PresentationViewer />;
        } else if (lecture.asset && lecture.asset.type === ASSET_TYPE.ARTICLE) {
            return <ArticleViewer />;
        }
        return <UnavailableViewer />;
    }

    get ariaLabelContent() {
        const {lecture} = this.lectureViewStore;
        const {currentCurriculumSection} = this.props.courseTakingStore;

        return interpolate(
            gettext(
                'Section %(sectionNum)s: %(sectionTitle)s, Lecture %(lectureNum)s: %(lectureTitle)s',
            ),
            {
                sectionTitle: currentCurriculumSection.title,
                sectionNum: currentCurriculumSection.objectIndex,
                lectureNum: lecture.objectIndex,
                lectureTitle: lecture.title,
            },
            true,
        );
    }

    render() {
        return (
            <section
                styleName="container"
                ref={this.props.fullscreenStore.setFocusElement}
                aria-label={this.ariaLabelContent}
            >
                {this.lectureViewStore.isLoading ? <CurriculumItemLoader /> : this.content}
            </section>
        );
    }
}
