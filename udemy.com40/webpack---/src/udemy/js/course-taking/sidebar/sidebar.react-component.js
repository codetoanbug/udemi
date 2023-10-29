import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AssessmentLauncherSection from '../assessments/assessment-launcher-section.react-component';
import {SIDEBAR_CONTENT, SIDEBAR_SCROLL_CONTAINER_ID} from '../constants';
import CourseContent from '../course-content/course-content.react-component';
import ScrollContainer from '../course-content/scroll-container.react-component';
import AutoscrollToggle from '../lecture-view/video-viewer/transcript/autoscroll-toggle.react-component';
import Transcript from '../lecture-view/video-viewer/transcript/transcript.react-component';
import QuestionNavigation from '../quiz-view/practice-test/question/question-navigation.react-component';
import requires from '../registry/requires';
import SidebarHeader from './sidebar-header.react-component';

import './sidebar.less';

@requires('courseTakingStore')
@observer
export default class Sidebar extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: false,
    };

    constructor(props) {
        super(props);
        this.transcriptRef = React.createRef();
    }

    componentDidMount() {
        if (this.isTranscriptOpen && this.transcriptRef.current) {
            this.transcriptRef.current.focus();
        }
    }

    @observable.ref contentRef = null;

    @autobind
    @action
    setContentRef(ref) {
        this.contentRef = ref;
    }

    @computed
    get isTranscriptOpen() {
        return this.props.courseTakingStore.activeSidebarContent === SIDEBAR_CONTENT.TRANSCRIPT;
    }

    get header() {
        const {closeSidebar} = this.props.courseTakingStore;
        switch (this.props.courseTakingStore.activeSidebarContent) {
            case SIDEBAR_CONTENT.TRANSCRIPT:
                return (
                    <SidebarHeader
                        title={
                            <h2 className="ud-heading-md" ref={this.transcriptRef} tabIndex="-1">
                                {gettext('Transcript')}
                            </h2>
                        }
                        a11yTitle={gettext('Transcript')}
                        onClose={closeSidebar}
                        autoFocus={this.props.autoFocus}
                    />
                );
            case SIDEBAR_CONTENT.DEFAULT:
                return (
                    <SidebarHeader
                        title={<h2 className="ud-heading-md">{gettext('Course content')}</h2>}
                        a11yTitle={gettext('Course content')}
                        onClose={closeSidebar}
                        autoFocus={this.props.autoFocus}
                    />
                );
            case SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS:
                return null;
        }
    }

    get content() {
        switch (this.props.courseTakingStore.activeSidebarContent) {
            case SIDEBAR_CONTENT.TRANSCRIPT:
                return <Transcript />;
            case SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS:
                return <QuestionNavigation />;
            case SIDEBAR_CONTENT.DEFAULT:
                return <CourseContent />;
        }
    }

    get footer() {
        switch (this.props.courseTakingStore.activeSidebarContent) {
            case SIDEBAR_CONTENT.TRANSCRIPT:
                return <AutoscrollToggle />;
            default:
                return null;
        }
    }

    render() {
        return (
            <section
                styleName="sidebar"
                data-purpose="sidebar"
                aria-label={gettext('Sidebar')}
                role={this.isTranscriptOpen ? 'dialog' : undefined}
                aria-modal={this.isTranscriptOpen ? false : undefined}
            >
                <AssessmentLauncherSection />
                {this.header}
                <ScrollContainer
                    id={SIDEBAR_SCROLL_CONTAINER_ID}
                    styleName="content"
                    ref={this.setContentRef}
                    data-purpose="sidebar-content"
                >
                    {this.content}
                </ScrollContainer>
                {this.footer}
            </section>
        );
    }
}
