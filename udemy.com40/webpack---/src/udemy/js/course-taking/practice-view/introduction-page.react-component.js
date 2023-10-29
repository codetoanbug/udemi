import {Tracker} from '@udemy/event-tracking';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import VideoAsset from 'asset/video/video-asset.react-component';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import {Assignment, Course} from 'course-manage-v2/events-v2';
import ensureInView from 'utils/ensure-in-view';

import {AssignmentStarted} from '../events-v2';
import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PAGES} from './constants';
import {AssetMessage, DurationMessage, SubmissionMessage} from './messages.react-component';
import Question from './question.react-component';
import ResourceDownload from './resource-download.react-component';

import './practice.less';

@requires('practiceViewStore')
@observer
export default class IntroductionPage extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.resourcesRef = React.createRef();
    }

    componentDidMount() {
        this.sendStartedEvent();
    }

    get subtitleContents() {
        const {isPracticeLoaded, practice} = this.props.practiceViewStore;
        const content = [
            isPracticeLoaded && !!practice.estimatedDuration && (
                <DurationMessage key="duration" duration={practice.estimatedDuration} />
            ),
            isPracticeLoaded && practice.downloadableAssets.length > 0 && (
                <AssetMessage
                    key="downloadable-assets"
                    length={practice.downloadableAssets.length}
                    scrollToResources={this.scrollToResources}
                />
            ),
            isPracticeLoaded && practice.numSubmissions > 0 && (
                <SubmissionMessage key="num-submissions" amount={practice.numSubmissions} />
            ),
        ].filter(Boolean);
        return content.length > 0 ? content : null;
    }

    @autobind
    scrollToResources() {
        ensureInView(this.resourcesRef.current, this.props.practiceViewStore.scrollContainerRef);
    }

    @autobind
    sendStartedEvent() {
        const {practice, userSubmission} = this.props.practiceViewStore;
        if (!practice.isComplete) {
            const assignment = new Assignment(practice.id, practice.title);
            const course = new Course(practice.courseId);
            Tracker.publishEvent(
                new AssignmentStarted({
                    assignment,
                    course,
                    attemptId: userSubmission?.id,
                }),
            );
        }
    }

    render() {
        const {practice} = this.props.practiceViewStore;
        return (
            <BasePage
                title={gettext('Assignment instructions')}
                subtitle={this.subtitleContents}
                pageType={PAGES.INTRO_PAGE}
            >
                {!!practice && (
                    <div styleName="panel">
                        {!practice.videoComponent && !practice.textComponent ? (
                            <Loader size="large" block={true} />
                        ) : null}
                        {practice.videoComponent ? (
                            <div styleName="practice-component-video">
                                <VideoAsset
                                    id={practice.videoComponent.asset.id}
                                    courseId={practice.courseId}
                                    practiceId={practice.id}
                                />
                            </div>
                        ) : null}
                        {practice.textComponent ? (
                            <RichTextViewer
                                data-purpose="practice-component-text"
                                unsafeHTML={practice.textComponent.body}
                            />
                        ) : null}
                        <div styleName="question-list mt-md" data-purpose="question-list">
                            <h4 className="ud-heading-md" styleName="mb-xs">
                                {gettext('Questions for this assignment')}
                            </h4>
                            <div>
                                {practice.questions.map((question) => (
                                    <Question question={question} key={question.id} />
                                ))}
                            </div>
                        </div>
                        {!!practice.downloadableAssets.length && (
                            <div ref={this.resourcesRef} styleName="mt-md">
                                <ResourceDownload
                                    practice={practice}
                                    resources={practice.downloadableAssets.slice()}
                                />
                            </div>
                        )}
                    </div>
                )}
            </BasePage>
        );
    }
}
