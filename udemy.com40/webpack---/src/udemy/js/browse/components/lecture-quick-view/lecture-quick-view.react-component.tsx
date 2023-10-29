import {BackendSourceOptions} from '@udemy/browse-event-tracking';
import {onEnterAndSpace} from '@udemy/design-system-utils';
import {Tracker} from '@udemy/event-tracking';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {LECTURE_CARD_SIZES, LectureCard} from '@udemy/react-browse-lecture';
import {Button, Image} from '@udemy/react-core-components';
import {BottomDrawer} from '@udemy/react-dialog-components';
import {Block, Skeleton, TextSkeleton} from '@udemy/react-reveal-components';
import {PlayOverlay, Tabs} from '@udemy/react-structure-components';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';
import classNames from 'classnames';
import {IReactionDisposer, reaction} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {LectureList} from 'browse/components/lecture-quick-view/lecture-list/lecture-list.react-component';
import {LectureQuickViewStore} from 'browse/components/lecture-quick-view/lecture-quick-view.mobx-store';
import {
    LectureDrawerClosed,
    BackendSourceOptions as BackendSourceOptionsMonolith,
} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';

import {MENU_TABS} from './constants';
import styles from './lecture-quick-view.less';
import {LectureSegments} from './lecture-segments/lecture-segments.react-component';
import {
    LectureViewCourseCard,
    LectureViewCourseCardSkeleton,
} from './lecture-view-course-card.react-component';
import {CourseReco, LectureReco} from './types';
import {getCourseLinkCTA, handleCourseCTAClick} from './utils';

interface LectureQuickViewProps extends WithI18nProps, WithUDDataProps {
    store: LectureQuickViewStore;
    enableLectureRecoForBottomDrawerOnSRP?: boolean;
    enableInLectureSearchSegments?: boolean;
}

const VideoPlayer = React.lazy(
    () =>
        import(/* webpackChunkName: "video-player" */ 'video-player/video-player.react-component'),
);

export const VideoPlayerSkeleton = () => (
    <Skeleton className={classNames(styles.container, styles.skeleton)}>
        <Block />
    </Skeleton>
);
@observer
class InternalLectureQuickView extends Component<LectureQuickViewProps> {
    constructor(props: LectureQuickViewProps) {
        super(props);
        this.videoPlayerContainerRef = React.createRef();
        this.videoPlayerReactionDisposer = reaction(
            () =>
                this.props.enableLectureRecoForBottomDrawerOnSRP &&
                this.props.store.isOnVideoEndState,
            (showRecommendation) => {
                const videoElement = this.videoPlayerContainerRef.current?.getElementsByTagName(
                    'video',
                )[0];
                const sneakPeekElement = this.videoPlayerContainerRef.current?.getElementsByClassName(
                    'sneak-peek-container',
                )[0];

                /*
                 * When showing the recommendation, the following things need to happen:
                 * 1. Hide the video player
                 * 2. Hide the sneak peek to prevent overlapping with recommendation overlay
                 * */
                if (showRecommendation && this.props.store.nextLectureReco) {
                    videoElement?.classList.add(styles['hidden-element']);
                    sneakPeekElement?.classList.add(styles['hidden-element']);
                } else {
                    videoElement?.classList.remove(styles['hidden-element']);
                    sneakPeekElement?.classList.remove(styles['hidden-element']);
                }
            },
        );
    }

    componentWillUnmount() {
        this.videoPlayerReactionDisposer();
    }

    private readonly videoPlayerContainerRef: React.RefObject<HTMLDivElement>;
    private readonly videoPlayerReactionDisposer: IReactionDisposer;

    handlePlay = () => {
        const {store} = this.props;
        if (store.currentLecture) {
            store.playOrPauseLecture(store.currentLecture)();
        }
    };

    onCloseButtonClick = () => {
        const {store} = this.props;
        store.toggleOpenState();
        if (store.currentLecture && store.courseId) {
            Tracker.publishEvent(
                new LectureDrawerClosed(
                    {
                        id: store.currentLecture.id,
                        type: store.lectureConsumptionStore.analyticsLectureType,
                    },

                    {id: store.courseId},
                ),
            );
        }
    };

    renderRecommendationOverlay() {
        const {gettext, store} = this.props;

        if (!store.nextLectureReco) {
            return null;
        }

        const lecture = store.nextLectureReco;
        const course = lecture.course;

        const onRecommendationClick = (course: CourseReco, lecture: LectureReco) => {
            // Set tracking context based on Discovery API recommendation
            store.setTrackingContext({
                searchTrackingId: lecture.tracking_id,
                backendSource: BackendSourceOptionsMonolith.DISCOVERY,
                trackingId: store.trackingContext?.trackingId,
                index: store.trackingContext?.index ?? 0,
            });
            store?.fetchLectureQuickViewData(course.id, lecture.id);
        };
        return (
            <div className={styles['recommendation-overlay-container']}>
                <div
                    className={styles['recommendation-overlay']}
                    data-purpose="recommendation-overlay"
                >
                    <h3
                        className={classNames('ud-heading-md', styles['recommendation-subtitle'])}
                        data-purpose="recommendation-subtitle"
                    >
                        {gettext('Similar lecture to this...')}
                    </h3>
                    <LectureCard
                        size={LECTURE_CARD_SIZES.LARGE}
                        lecture={{
                            id: lecture.id,
                            title: lecture.title,
                            duration: lecture.content_summary,
                            image: lecture.image_320_H,
                            course: {
                                image: course.image_304x171,
                                title: course.title,
                            },
                        }}
                        uiRegion={UI_REGION.BOTTOM_DRAWER_RECOMMENDATION}
                        buttonProps={{
                            onClick: () => onRecommendationClick(course, lecture),
                        }}
                        trackingContext={{
                            trackingId: lecture.tracking_id,
                            frontendTrackingId: store.trackingContext?.trackingId ?? '',
                            backendSource: BackendSourceOptions.DISCOVERY,
                            position: 0,
                        }}
                        srContext={gettext('Next lecture: ')}
                    />
                    <Button
                        udStyle="white-outline"
                        data-purpose="cancel-button"
                        className={styles['cancel-button']}
                        size="xsmall"
                        onClick={() => store.setIsOnVideoEndState(false)}
                    >
                        {gettext('Cancel')}
                    </Button>
                </div>
            </div>
        );
    }

    renderVideoPlayer() {
        const {store, gettext, enableLectureRecoForBottomDrawerOnSRP} = this.props;
        return (
            <>
                {store.showPlayer ? (
                    <div
                        data-purpose="video-player"
                        className={styles['lite-video']}
                        ref={this.videoPlayerContainerRef}
                    >
                        <React.Suspense fallback={null}>
                            <VideoPlayer {...this.props.store.videoConfig} />
                        </React.Suspense>
                        {enableLectureRecoForBottomDrawerOnSRP &&
                            store.isOnVideoEndState &&
                            this.renderRecommendationOverlay()}
                    </div>
                ) : (
                    <div
                        data-purpose="lite-video-click-handler"
                        className={styles['lite-video-play-overlay']}
                        onClick={this.handlePlay}
                        onKeyDown={onEnterAndSpace(this.handlePlay)}
                        role="button"
                        tabIndex={0}
                    >
                        <Image
                            width={600}
                            height={300}
                            alt=""
                            lazy={true}
                            src={store.currentLecture?.thumbnail_url}
                        />
                        <span className="ud-sr-only">{gettext('Play')}</span>
                        <PlayOverlay />
                    </div>
                )}
            </>
        );
    }

    renderTabs() {
        const {store, gettext} = this.props;
        const defaultTabId = store.currentLecture?.segments?.length
            ? MENU_TABS.LECTURE_DETAILS
            : MENU_TABS.SECTION_PLAYLIST;

        const handleSegmentClickForUnloadedVideo = (startTime: number) => {
            if (!store.showPlayer && store.currentLecture) {
                store.setVideoInitialStartTime(startTime);
                store.playOrPauseLecture(store.currentLecture)();
            }
        };

        return (
            <Tabs size="small" defaultTabId={defaultTabId}>
                <Tabs.Tab id={MENU_TABS.LECTURE_DETAILS} title={gettext('Lecture details')}>
                    {store.currentLecture && (
                        <LectureSegments
                            lecture={store.currentLecture}
                            progressBarStore={store.progressBarStore}
                            isVideoLoaded={store.showPlayer}
                            handleSegmentClickForUnloadedVideo={handleSegmentClickForUnloadedVideo}
                        />
                    )}
                </Tabs.Tab>
                <Tabs.Tab id={MENU_TABS.SECTION_PLAYLIST} title={gettext('Section playlist')}>
                    <LectureList store={store} lockScroll={this.props.store.isOpen} />
                </Tabs.Tab>
            </Tabs>
        );
    }

    render() {
        const {store, gettext, udData, enableInLectureSearchSegments} = this.props;
        const {course, currentLecture, toggleOpenState} = store;
        const {Config: udConfig} = udData;
        const courseCTALink = getCourseLinkCTA({
            udConfig,
            course: store.course,
            lecture: store.currentLecture,
        });
        return (
            <BottomDrawer
                id="lecture-drawer"
                isOpen={false}
                showTitle={false}
                title=""
                onOpen={toggleOpenState}
                onClose={this.onCloseButtonClick}
                className={styles['bottom-drawer']}
            >
                <div className={styles.container}>
                    <h2 className={classNames('ud-heading-md', styles['lecture-title'])}>
                        {currentLecture?.title ?? (
                            <TextSkeleton withTitle={true} lineCountPerParagraph={0} />
                        )}
                    </h2>

                    <div className={styles['lecture-container']}>
                        {currentLecture ? this.renderVideoPlayer() : <VideoPlayerSkeleton />}
                    </div>

                    <div className={styles['tabs-container']} data-purpose="lecture-list">
                        {enableInLectureSearchSegments ? (
                            <div className={styles['tab-component']}>{this.renderTabs()}</div>
                        ) : (
                            <LectureList store={store} lockScroll={this.props.store.isOpen} />
                        )}
                    </div>

                    {/*
                        For larger devices,the LectureViewCourseCard is shown at the bottom of the viewport.
                        For mobile devices, this card is shown at the bottom of the list of lectures (scrollable container).
                    */}
                    <div className={styles['course-card-container']}>
                        {course ? (
                            <LectureViewCourseCard
                                course={course}
                                trackingContext={store.trackingContext}
                                lecture={store.currentLecture}
                            />
                        ) : (
                            <LectureViewCourseCardSkeleton />
                        )}
                    </div>

                    {/*
                        For mobile devices, we want to show the minimal sticky-course-card at the bottom of the viewport.
                        This card is not shown on larger devices since the LectureViewCourseCard is always visible.
                    */}
                    <div className={styles['sticky-course-card']}>
                        {course ? (
                            <>
                                <h3
                                    className={classNames('ud-heading-md', styles['course-title'])}
                                    data-purpose="sticky-course-title"
                                >
                                    <a
                                        href={courseCTALink}
                                        onClick={() =>
                                            handleCourseCTAClick(course, store.trackingContext)
                                        }
                                    >
                                        {course.title}
                                    </a>
                                </h3>
                                <Button
                                    udStyle="brand"
                                    size="medium"
                                    componentClass="a"
                                    data-purpose="sticky-view-course-button"
                                    className={styles['course-cta']}
                                    href={courseCTALink}
                                    onClick={() =>
                                        handleCourseCTAClick(course, store.trackingContext)
                                    }
                                >
                                    {gettext('View course')}
                                </Button>
                            </>
                        ) : (
                            <LectureViewCourseCardSkeleton />
                        )}
                    </div>
                </div>
            </BottomDrawer>
        );
    }
}

export const LectureQuickView = withI18n(withUDData(InternalLectureQuickView));
