import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Image} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {SaveToListButton} from '@udemy/shopping';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import TruncateWithTooltip from 'base-components/ungraduated/text/truncate-with-tooltip.react-component';
import {SaveButton} from 'browse/components/ub-save-button/save-button.react-component';
import {UI_REGION} from 'browse/ui-regions';
import {SaveToListPopover} from 'course-taking/header/save-to-list-popover.react-component';
import {EventTracker} from 'learning-path/event-tracker';
import {CONTENT_ITEM_TYPES} from 'learning-path/learning-path-page/constants';
import getConfigData from 'utils/get-config-data';
import udPerf from 'utils/ud-performance';

import registers from '../registry/registers';
import requires from '../registry/requires';
import styles from './header.less';
import LeaveRating from './leave-rating.react-component';
import OptionsMenu from './options/options-menu.react-component';
import Progress from './progress.react-component';
import UnenrollStore from './unenroll.mobx-store';

const udConfig = getConfigData();

@requires('courseTakingStore')
@registers('unenrollStore')
@inject('enableUBListExperiment')
@observer
export default class Header extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            courseId: PropTypes.number, // course.id is not populated initially in the store
            course: PropTypes.shape({
                title: PropTypes.string,
                id: PropTypes.number,
                url: PropTypes.string,
                hasCertificate: PropTypes.bool,
                isPracticeTestCourse: PropTypes.bool,
                isPublished: PropTypes.bool,
                isProgramTakingExperience: PropTypes.bool,
                isSaved: PropTypes.bool,
                is_in_user_subscription: PropTypes.bool,
            }),
            enrollment: PropTypes.object,
            coursePortion: PropTypes.object,
            learningPathId: PropTypes.number,
            learningPath: PropTypes.shape({
                id: PropTypes.number,
                isPublicLearningPath: PropTypes.bool,
                isUdemyPath: PropTypes.bool,
            }),
            learningPathUrl: PropTypes.string,
            isMobileViewportSize: PropTypes.bool,
            isUserInstructor: PropTypes.bool,
            courseReview: PropTypes.object,
            program: PropTypes.shape({
                title: PropTypes.string,
            }),
            isProgramTakingExperience: PropTypes.bool,
            isCourseInConsumerSubs: PropTypes.bool,
            isCourseVersioningEnabled: PropTypes.bool,
        }).isRequired,
        enableUBListExperiment: PropTypes.bool,
    };

    static defaultProps = {
        enableUBListExperiment: false,
    };

    constructor(props) {
        super(props);
        this.unenrollStore = new UnenrollStore(this.props.courseTakingStore);
    }

    componentDidMount() {
        udPerf.mark('CourseTakingV5.header-rendered');
    }

    get courseTitle() {
        const {course, coursePortion, isCourseInConsumerSubs} = this.props.courseTakingStore;
        const truncateProps = {lines: 1, className: `ud-text-md ${styles['header-text']}`};
        if (!coursePortion && !isCourseInConsumerSubs) {
            truncateProps.componentClass = 'a';
            truncateProps.className = `${truncateProps.className} ${styles['header-link']}`;
            truncateProps.href = course.url;
        }

        return (
            <h1 data-purpose="course-header-title" styleName="course-title">
                <TruncateWithTooltip truncateProps={truncateProps} placement="bottom">
                    {course.title}
                </TruncateWithTooltip>
            </h1>
        );
    }

    handleHomeLinkClick(contentItemType, contentItemId) {
        const {learningPathUrl, learningPath} = this.props.courseTakingStore;
        if (!learningPathUrl) {
            return;
        }

        EventTracker.returnToLearningPathClicked(learningPath, contentItemType, contentItemId);
    }

    organizationHomeLink(contentItemType, contentItemId) {
        const {learningPathUrl} = this.props.courseTakingStore;
        const homeUrl = learningPathUrl || '/';
        const homeText = learningPathUrl ? gettext('Return to learning path') : gettext('Home');

        return (
            <a
                href={homeUrl}
                className="ud-text-md"
                styleName="header-text header-link"
                data-purpose="home-link"
                onClick={() => this.handleHomeLinkClick(contentItemType, contentItemId)}
            >
                <PreviousIcon label={false} color="inherit" />
                <span>{homeText}</span>
            </a>
        );
    }

    homeLink(contentItemType, contentItemId) {
        if (udConfig.brand.has_organization) {
            return this.organizationHomeLink(contentItemType, contentItemId);
        }

        return (
            <a href="/">
                <Image
                    src={udConfig.brand.product_logo_light}
                    alt={udConfig.brand.product_name}
                    width={Math.round(34 * udConfig.brand.product_logo_aspect_ratio)}
                    height={34}
                />
            </a>
        );
    }

    get viewWholeCourseLink() {
        return (
            <a
                href={this.props.courseTakingStore.course.url}
                className="ud-text-md"
                styleName="header-text header-link"
                data-purpose="full-course-link"
            >
                {gettext('View whole course')}
            </a>
        );
    }

    renderCoursePortionHeader() {
        const {coursePortion} = this.props.courseTakingStore;
        return (
            <header styleName="header">
                {this.homeLink(CONTENT_ITEM_TYPES.COURSE_SECTION, coursePortion.id)}
                <div styleName="vertical-divider" />
                <div styleName="flex header-title">
                    {this.courseTitle}
                    <div styleName="flex" />
                </div>
                {this.viewWholeCourseLink}
            </header>
        );
    }

    renderBasicHeader() {
        return <header styleName="header">{this.homeLink(null, null)}</header>;
    }

    renderProgramHeader() {
        const {program} = this.props.courseTakingStore;
        if (!program) {
            return null;
        }
        return (
            <header styleName="header">
                {this.homeLink(CONTENT_ITEM_TYPES.COURSE_SECTION, program.id)}
                <div styleName="vertical-divider" />
                <div styleName="flex header-title">
                    <h1
                        className="ud-text-md"
                        styleName="header-text"
                        data-purpose="program-header-title"
                    >
                        {program.title}
                    </h1>
                </div>
            </header>
        );
    }

    render() {
        const {
            course,
            coursePortion,
            enrollment,
            isMobileViewportSize,
            isProgramTakingExperience,
            isCourseVersioningEnabled,
        } = this.props.courseTakingStore;
        const {enableUBListExperiment} = this.props;

        if (!course) {
            if (isCourseVersioningEnabled) {
                return this.renderBasicHeader();
            }
            return null;
        }

        if (coursePortion) {
            return this.renderCoursePortionHeader();
        }

        if (isProgramTakingExperience) {
            return this.renderProgramHeader();
        }

        const canShowProgressBar = !course.isPracticeTestCourse && !isMobileViewportSize;

        const unenrollConfirmText = gettext(
            'Unenrolling from this course will remove it from your My learning ' +
                'dashboard. As a Udemy Business learner, you can enroll again to ' +
                'continue where you left off.',
        );

        return (
            <header styleName="header">
                {this.homeLink(CONTENT_ITEM_TYPES.COURSE, course.id)}
                <div styleName="vertical-divider" />
                <div styleName="flex header-title">
                    {this.courseTitle}
                    <div styleName="flex" />
                </div>
                <LeaveRating />
                {canShowProgressBar && <Progress />}
                <SaveToListButton
                    course={course}
                    udStyle="primary"
                    size="small"
                    label={gettext('Save')}
                    typography="ud-heading-md"
                    uiRegion={UI_REGION.COURSE_TAKING_HEADER}
                    renderPopover={(button) => {
                        return (
                            <SaveToListPopover trigger={button} popoverName="courseTakingHeader" />
                        );
                    }}
                />
                {enableUBListExperiment ? (
                    <div
                        data-purpose="save-button-container"
                        className={styles['save-button-container']}
                    >
                        <SaveButton courseId={course.id} enrollment={enrollment} isMobile={false} />
                        <OptionsMenu />
                    </div>
                ) : (
                    <OptionsMenu />
                )}
                <ConfirmModal
                    onCancel={this.unenrollStore.closeConfirmModal}
                    onConfirm={this.unenrollStore.unenroll}
                    isOpen={this.unenrollStore.isConfirmModalOpen}
                >
                    {unenrollConfirmText}
                </ConfirmModal>
            </header>
        );
    }
}
