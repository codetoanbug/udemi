import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {SaveButton} from 'browse/components/ub-save-button/save-button.react-component';
import {fullscreen} from 'utils/fullscreen';
import UserActivityStore from 'video-player/user-activity.mobx-store';

// Webpack doesn't like absolute .less file paths...
import userActivityStyles from '../../video-player/user-activity.less';
import EndScreen from '../end-screen/end-screen.react-component';
import {LabsPrompt} from '../labs-prompt/labs-prompt.react-component';
import LectureView from '../lecture-view/lecture-view.react-component';
import LockedScreen from '../locked-screen/locked-screen.react-component';
import PracticeView from '../practice-view/practice-view.react-component';
import QuizView from '../quiz-view/quiz-view.react-component';
import registers from '../registry/registers';
import requires from '../registry/requires';
import ReviewPrompt from '../reviews/review-prompt.react-component';
import SubHeader from '../sub-header/sub-header.react-component';
import UnsupportedItem from '../unsupported-item.react-component';
import {ITEM_TYPES, MAIN_CONTENT, QUIZ_TYPES} from './constants';
import CourseContentToggle from './course-content-toggle.react-component';
import CurriculumItemLoader from './curriculum-item-loader.react-component';
import curriculumItemStyles from './curriculum-item-view.less';
import ItemRedirect from './item-redirect.react-component';
import MobileCurriculumItem from './mobile-curriculum-item.react-component';
import NextAndPrevious from './next-and-previous.react-component';

@fullscreen
@requires('courseTakingStore')
@registers('userActivityStore')
@inject('enableUBListExperiment')
@observer
export default class CurriculumItemView extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        initialCurriculumItemType: PropTypes.string.isRequired,
        initialCurriculumItemId: PropTypes.number.isRequired,
        setFullscreenRef: PropTypes.func.isRequired, // Provided by the `fullscreen` decorator.
        isFullscreen: PropTypes.bool.isRequired, // Provided by the `fullscreen` decorator.
        enableUBListExperiment: PropTypes.bool,
    };

    static defaultProps = {
        enableUBListExperiment: false,
    };

    constructor(props) {
        super(props);
        this.userActivityStore = new UserActivityStore();
    }

    componentDidMount() {
        this.updateCurriculumItem();
    }

    componentDidUpdate(prevProps) {
        const itemHasNotChanged =
            prevProps.match.params.itemType === this.urlItemType &&
            +prevProps.match.params.itemId === this.urlItemId;
        const queryStringHasNotChanged = prevProps.location.search === this.props.location.search;
        if (itemHasNotChanged && queryStringHasNotChanged) {
            return;
        }
        this.updateCurriculumItem();
    }

    get urlItemType() {
        return this.props.match.params.itemType;
    }

    get urlItemId() {
        return +this.props.match.params.itemId;
    }

    updateCurriculumItem() {
        this.props.courseTakingStore.setCurrentCurriculumItem(this.urlItemType, this.urlItemId);
    }

    get isUnsupportedCurriculumType() {
        const {currentCurriculumItem} = this.props.courseTakingStore;

        return (
            currentCurriculumItem.type === ITEM_TYPES.PRACTICE ||
            currentCurriculumItem.quizType === QUIZ_TYPES.CODING_EXERCISE
        );
    }

    get mobileLauncherProps() {
        const {
            currentCurriculumItem,
            isMobileViewportSize,
            mainContentType,
        } = this.props.courseTakingStore;

        switch (mainContentType) {
            case MAIN_CONTENT.LOCKED_SCREEN:
                return {useLauncher: false};
            case MAIN_CONTENT.END_SCREEN:
            case MAIN_CONTENT.REVIEW_PROMPT:
                return {useLauncher: true};
            default:
                return {
                    useLauncher:
                        isMobileViewportSize &&
                        !currentCurriculumItem.isVideo &&
                        !this.isUnsupportedCurriculumType,
                    displayImageOverlay: this.isUnsupportedCurriculumType,
                };
        }
    }

    get content() {
        const {
            currentCurriculumItem,
            isMobileView,
            hasSidebarContent,
            canShowSidebar,
            mainContentType,
            enableSidebarControlAutoFocus,
        } = this.props.courseTakingStore;

        const canShowCourseContentToggle =
            canShowSidebar && !hasSidebarContent && !this.props.isFullscreen;

        const ViewComponent =
            {
                [MAIN_CONTENT.LABS_PROMPT]: LabsPrompt,
                [MAIN_CONTENT.LOCKED_SCREEN]: LockedScreen,
                [MAIN_CONTENT.REVIEW_PROMPT]: ReviewPrompt,
                [MAIN_CONTENT.END_SCREEN]: EndScreen,
            }[mainContentType] ||
            {
                [ITEM_TYPES.LECTURE]: LectureView,
                [ITEM_TYPES.QUIZ]: QuizView,
                [ITEM_TYPES.PRACTICE]: PracticeView,
            }[currentCurriculumItem.type];

        if (isMobileView && !currentCurriculumItem.isVideo) {
            return (
                <MobileCurriculumItem {...this.mobileLauncherProps}>
                    {this.isUnsupportedCurriculumType ? <UnsupportedItem /> : <ViewComponent />}
                </MobileCurriculumItem>
            );
        }

        return (
            <>
                <ViewComponent />
                {canShowCourseContentToggle && (
                    <CourseContentToggle autoFocus={enableSidebarControlAutoFocus} />
                )}
                {currentCurriculumItem.type === ITEM_TYPES.LECTURE && <NextAndPrevious />}
            </>
        );
    }

    get mobileHeaderBar() {
        const {
            courseId,
            course,
            mobileHeaderBackUrl,
            isProgramTakingExperience,
        } = this.props.courseTakingStore;
        const {enableUBListExperiment} = this.props;
        return (
            <>
                <div className={curriculumItemStyles['mobile-header-bar']}>
                    <a
                        href={mobileHeaderBackUrl}
                        className={curriculumItemStyles['my-courses-link']}
                        data-purpose="mobile-header-bar-back-link"
                    >
                        <ArrowLeftIcon label={gettext('Back to courses')} color="inherit" />
                    </a>
                    <span className={curriculumItemStyles['course-title']}>
                        {course && course.title}
                    </span>
                    {enableUBListExperiment && (
                        <SaveButton
                            courseId={courseId}
                            enrollment={this.props.courseTakingStore.enrollment}
                            isMobile={true}
                        />
                    )}
                </div>
                {isProgramTakingExperience && (
                    <div className={curriculumItemStyles['program-sub-header']}>
                        <SubHeader />
                    </div>
                )}
            </>
        );
    }

    render() {
        const {
            currentCurriculumItem,
            isMobileViewportSize,
            isSidebarVisible,
            hasInvalidCurriculumItem,
            isLoading,
        } = this.props.courseTakingStore;

        let renderLoader = isLoading;
        if (hasInvalidCurriculumItem) {
            if (
                this.urlItemType !== this.props.initialCurriculumItemType ||
                this.urlItemId !== this.props.initialCurriculumItemId
            ) {
                return (
                    <ItemRedirect
                        itemType={this.props.initialCurriculumItemType}
                        itemId={this.props.initialCurriculumItemId}
                    />
                );
            }
            renderLoader = true;
        }

        if (
            !currentCurriculumItem ||
            currentCurriculumItem.type !== this.urlItemType ||
            currentCurriculumItem.id !== this.urlItemId
        ) {
            renderLoader = true;
        }

        const contentClass = classNames(curriculumItemStyles.content, {
            'curriculum-item-fullscreen': this.props.isFullscreen,
            [userActivityStyles['user-inactive']]:
                currentCurriculumItem &&
                currentCurriculumItem.isVideo &&
                !this.userActivityStore.isUserActive,
            [curriculumItemStyles['video-background']]:
                currentCurriculumItem && currentCurriculumItem.isVideo,
        });

        // We use two height limiters because the absolutely positioned content also needs limiting.
        return (
            <>
                {isMobileViewportSize && this.mobileHeaderBar}
                <HeightLimiter isSidebarVisible={isSidebarVisible}>
                    <div className={curriculumItemStyles['aspect-ratio-container']}>
                        <div
                            className={curriculumItemStyles['content-container']}
                            ref={this.props.courseTakingStore.setCurriculumItemContentContainerRef}
                        >
                            <HeightLimiter isSidebarVisible={isSidebarVisible}>
                                <div
                                    className={contentClass}
                                    ref={this.props.setFullscreenRef}
                                    data-purpose="curriculum-item-viewer-content"
                                >
                                    {renderLoader ? <CurriculumItemLoader /> : this.content}
                                </div>
                            </HeightLimiter>
                        </div>
                    </div>
                </HeightLimiter>
            </>
        );
    }
}

const HeightLimiter = (props) => (
    <div
        className={classNames(curriculumItemStyles['scaled-height-limiter'], {
            [curriculumItemStyles['no-sidebar']]: !props.isSidebarVisible,
        })}
    >
        <div
            className={classNames(curriculumItemStyles['absolute-height-limiter'], {
                [curriculumItemStyles['no-sidebar']]: !props.isSidebarVisible,
            })}
        >
            {props.children}
        </div>
    </div>
);

HeightLimiter.propTypes = {
    isSidebarVisible: PropTypes.bool.isRequired,
};
