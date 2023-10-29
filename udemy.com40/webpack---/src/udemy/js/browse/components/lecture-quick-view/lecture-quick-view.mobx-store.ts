import {PAGE_TYPE_LECTURE_QUICK_VIEW} from '@udemy/discovery-api';
import {Tracker} from '@udemy/event-tracking';
import {AlertBannerProps, ToasterStore} from '@udemy/react-messaging-components';
import {action, computed, observable, runInAction, toJS} from 'mobx';
import UAParser from 'ua-parser-js';

import {ASSET_LICENSE_TOKEN_TTL} from 'asset/constants';
import DiscoveryUnitsContainerStore from 'browse/components/discovery-units-container/discovery-units-container.mobx-store';
import {LectureDiscoveryCardClickEvent, LectureStartedEvent} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';
import {API_LECTURE_MEDIA_LICENSE_FIELDS} from 'course-taking/lecture-view/constants';
import {LectureStarted} from 'course-taking/lecture-view/events';
import {
    VIDEO_COMPLETION_OFFSET,
    VIDEO_PROGRESS_INTERVAL,
} from 'course-taking/lecture-view/video-viewer/constants';
import {ASSET_UNAVAILABLE, LECTURE_LOCKED} from 'course-taking/locked-screen/constants';
import {TrackingContext} from 'search/events';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';
import {getIsSafariOrIOS} from 'utils/user-agent/get-is-safari-or-ios';
import ProgressBarStore from 'video-player/progress-bar/progress-bar.mobx-store';

import {
    LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES,
    DEFAULT_LECTURE_QUICKVIEW_CONTENT_PAGE,
} from './constants';
import {LectureConsumptionStore} from './lecture-consumption.mobx-store';
import {Course, Lecture, LectureReco, LecturesInSection, ProgressData, Section} from './types';

type PageKeys = keyof typeof LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES;

type PageType = typeof LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES[PageKeys];

export class LectureQuickViewStore {
    @observable lecture: Lecture | undefined;
    @observable course: Course | undefined;
    @observable courseId: number | undefined;
    @observable section: Section | undefined;
    @observable lecturesInSection: LecturesInSection | undefined;
    @observable isOpen = false;
    @observable showPlayer = false;
    /**
     * Flag to control video player component's state.
     */
    @observable isVideoPlaying = true;
    @observable.ref currentLecture: Lecture | undefined;
    @observable trackingContext: TrackingContext | undefined;
    @observable isOnVideoEndState = false;
    /**
     * Flag to identify the initial lecture play of the selected lecture.
     * This is used to track the lecture started event.
     */
    isFirstCurrentLecturePlay = true;
    /**
     * Flag to identify the initial video play of any lecture.
     * This is used to enable muted autoplay for the first video play
     * of the selected lecture for Safari or iOS devices.
     */
    isFirstVideoPlay = true;
    /**
     * Flag to seek the video player to a start time (seconds) after it's ready.
     */
    videoInitialStartTime?: number;
    lectureConsumptionStore: LectureConsumptionStore;
    alertBannerToastId: string | undefined;
    gettext: (val: string) => string;

    enableLectureRecoForBottomDrawerOnSRP: boolean;
    uaParser = new UAParser();
    discoveryUnitsContainerStore: DiscoveryUnitsContainerStore | undefined;
    progressBarStore = new ProgressBarStore();
    nextLectureReco: LectureReco | undefined;

    constructor(gettext: (val: string) => string, enableLectureRecoForBottomDrawerOnSRP: boolean) {
        this.setInitialState();

        // Active experiment(s)
        this.enableLectureRecoForBottomDrawerOnSRP = enableLectureRecoForBottomDrawerOnSRP;

        // Initialize dependency stores
        this.lectureConsumptionStore = new LectureConsumptionStore();

        // Bind methods
        this.toggleOpenState = this.toggleOpenState.bind(this);
        this.setIsVideoPlaying = this.setIsVideoPlaying.bind(this);
        this.onVideoEnd = this.onVideoEnd.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onVideoProgress = this.onVideoProgress.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);

        // I18n props
        this.gettext = gettext;
    }

    setInitialState() {
        this.lecture = undefined;
        this.course = undefined;
        this.section = undefined;
        this.lecturesInSection = undefined;
        this.currentLecture = undefined;
        this.alertBannerToastId = undefined;
        this.isOnVideoEndState = false;
        this.isVideoPlaying = true;
        this.videoInitialStartTime = undefined;
        this.isFirstCurrentLecturePlay = true;
        this.nextLectureReco = undefined;
        this.discoveryUnitsContainerStore = undefined;
        this.progressBarStore = new ProgressBarStore();
    }

    @action
    setTrackingContext(trackingContext: TrackingContext) {
        this.trackingContext = trackingContext;
    }

    @action
    setIsOnVideoEndState(isOnVideoEndState: boolean) {
        this.isOnVideoEndState = isOnVideoEndState;
    }

    @action
    setVideoInitialStartTime(videoInitialStartTime: number | undefined) {
        this.videoInitialStartTime = videoInitialStartTime;
    }

    @action
    toggleOpenState() {
        this.isOpen = !this.isOpen;

        if (!this.isOpen) {
            this.setShowPlayer(false);
            this.setIsVideoPlaying(true);
            this.setIsFirstCurrentLecturePlay(true);
            if (this.alertBannerToastId) {
                this.hideAlertBannerToast();
            }
        }
    }

    @computed
    get videoConfig() {
        if (this.currentLecture) {
            const asset = this.currentLecture?.asset;
            const config = {
                playerId: `playerId__${asset.id}`,
                trackingTag: 'lecture_search_asset',
                assetId: asset.id,
                mediaLicenseToken: asset.media_license_token,
                mediaSources: asset.media_sources,
                duration: asset.time_estimation,
                captions: toJS(asset.captions),
                thumbnailSprite: asset.thumbnail_sprite,
                muxMetadata: {
                    playerName: 'Lecture search page Player',
                    assetId: asset.id,
                    duration: asset.time_estimation,
                },
                onVideoProgress: this.onVideoProgress,
                videoProgressInterval: VIDEO_PROGRESS_INTERVAL,
                isPlaying: this.isVideoPlaying,
                onPlayPause: this.setIsVideoPlaying,
                progressBarStore: this.progressBarStore,
                onPlayerReady: this.onPlayerReady,
            };
            const extraClientConfig = getIsSafariOrIOS(this.uaParser)
                ? {
                      isDefaultMuted: this.isFirstVideoPlay,
                      prioritizeDefaultMuted: this.isFirstVideoPlay,
                      extraVideoAttributes: {
                          playsInline: true,
                      },
                  }
                : {};
            const extraFeatureConfig = this.enableLectureRecoForBottomDrawerOnSRP
                ? {
                      onVideoEnd: this.onVideoEnd,
                      onTimeUpdate: this.onTimeUpdate,
                  }
                : {};
            return {...config, ...extraClientConfig, ...extraFeatureConfig};
        }
        return {};
    }

    hideAlertBannerToast() {
        ToasterStore.removeToast(this.alertBannerToastId);
        this.alertBannerToastId = undefined;
    }

    displayAlertBannerToast() {
        const alertBannerProps = {
            udStyle: 'error',
            title: this.gettext('There was a problem fetching content from our server.'),
            body: this.gettext(
                'This error may be the result of a bad network connection. Please close this drawer and try again.',
            ),
            showCta: false,
        };
        this.alertBannerToastId = ToasterStore.addAlertBannerToast(
            alertBannerProps as AlertBannerProps,
        );
    }

    // Since we only receive the lecture index in the lecture prefetch response,
    // we need to attach indexes to the remaining lectures based on their position
    // on the list.
    attachLectureIndexes(lectures: Lecture[]) {
        const lectureListPosition = this.lecturesInSection?.results.findIndex(
            (l: {id: number}) => l.id === this.lecture?.id,
        );
        const lectureListIndex = this.lecture?.list_data?.index;

        if (lectureListIndex !== undefined && lectureListPosition !== undefined) {
            const indexOffset = lectureListIndex - lectureListPosition;
            lectures.forEach((lecture, position) => {
                const index = lecture.list_data?.index ?? position + indexOffset;
                lecture.list_data = {...lecture.list_data, index};
            });
        }
    }

    @action
    async fetchLectureQuickViewData(courseId: number, lectureId: number) {
        this.setInitialState();
        try {
            const url = `browse/courses/${courseId}/lectures/${lectureId}/quickview/`;
            const response = await udApi.get(url);

            runInAction(async () => {
                this.lecture = response.data as Lecture;
                this.lecture.asset.licenseTokenLoadTime = new Date();
                this.courseId = courseId;
                await this.setCurrentLecture(this.lecture);
                await this.fetchLectureListData(courseId, response.data.list_data.chapter_id);
            });
        } catch (e) {
            Raven.captureException(`Error when fetching lecture data: ${e}`);
            this.displayAlertBannerToast();
        }
    }

    @action
    async fetchLectureListData(courseId: number, sectionId: number) {
        try {
            const page = this.lecture?.list_data?.page ?? DEFAULT_LECTURE_QUICKVIEW_CONTENT_PAGE;
            const url = `/browse/courses/${courseId}/sections/${sectionId}/quickview/?page=${page}`;
            const response = await udApi.get(url);

            runInAction(() => {
                this.course = response.data.course as Course;
                this.section = response.data.section as Section;
                this.lecturesInSection = response.data.lectures_in_section as LecturesInSection;
                this.attachLectureIndexes(this.lecturesInSection.results);
                this.lecturesInSection.results.forEach((lecture) => {
                    lecture.asset.licenseTokenLoadTime = new Date();
                });
            });
        } catch (e) {
            Raven.captureException(`Error when fetching lecture list data: ${e}`);
            this.displayAlertBannerToast();
        }
    }

    @action
    async fetchLectureListDataByPageLink(page: PageType) {
        const isPreviousPage = page === LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES.PREVIOUS;
        const url = isPreviousPage
            ? this.lecturesInSection?.links.previous
            : this.lecturesInSection?.links.next;
        if (!url) {
            return;
        }
        try {
            const response = await udApi.get(url);
            const lecturesInSectionPage = response.data.lectures_in_section;
            const lecturesPage = lecturesInSectionPage.results;

            runInAction(() => {
                if (this.lecturesInSection && lecturesPage.length) {
                    // attaching license token load time to each new lecture
                    lecturesPage.forEach((lecture: Lecture) => {
                        lecture.asset.licenseTokenLoadTime = new Date();
                    });

                    // combining new lectures with existing lectures
                    if (isPreviousPage) {
                        this.lecturesInSection.results = [
                            ...(lecturesPage as Lecture[]),
                            ...this.lecturesInSection.results,
                        ];
                        this.lecturesInSection.links.previous =
                            lecturesInSectionPage.links.previous;
                    } else {
                        this.lecturesInSection.results = [
                            ...this.lecturesInSection.results,
                            ...(lecturesPage as Lecture[]),
                        ];
                        this.lecturesInSection.links.next = lecturesInSectionPage.links.next;
                    }

                    // attaching indexes to each lecture
                    this.attachLectureIndexes(this.lecturesInSection.results);
                }
            });
        } catch (e) {
            Raven.captureException(`Error when fetching lecture list page: ${e}`);
            this.displayAlertBannerToast();
        }
    }

    handleLectureClick() {
        if (this.currentLecture?.id && this.trackingContext) {
            Tracker.publishEvent(
                new LectureDiscoveryCardClickEvent({
                    backendSource: this.trackingContext.backendSource,
                    id: this.currentLecture.id,
                    position: this.currentLecture.list_data?.index ?? 0,
                    serveTrackingId: this.trackingContext.searchTrackingId ?? '',
                    trackingId: this.trackingContext.trackingId ?? '',
                    uiRegion: UI_REGION.BOTTOM_DRAWER_LECTURE_LIST,
                }),
            );
        }
    }

    handleLectureStart() {
        if (this.currentLecture?.id && this.trackingContext) {
            Tracker.publishEvent(
                new LectureStartedEvent({
                    id: this.currentLecture?.id,
                    trackingId: this.trackingContext.trackingId ?? '',
                }),
            );
            // Important analytics event!
            Tracker.publishEvent(
                new LectureStarted(
                    {
                        id: this.currentLecture.id,
                        type: this.lectureConsumptionStore.analyticsLectureType,
                    },
                    // note: leaving course empty as the lecture is not being viewed in the context
                    // of a course
                    null,
                ),
            );
        }
    }

    setIsFirstCurrentLecturePlay(isFirstCurrentLecturePlay: boolean) {
        this.isFirstCurrentLecturePlay = isFirstCurrentLecturePlay;
    }

    setIsFirstVideoPlay(isFirstVideoPlay: boolean) {
        this.isFirstVideoPlay = isFirstVideoPlay;
    }

    @action
    setShowPlayer(showPlayer: boolean) {
        this.showPlayer = showPlayer;
    }

    @action
    setIsVideoPlaying(isVideoPlaying: boolean) {
        this.isVideoPlaying = isVideoPlaying;

        if (this.isFirstVideoPlay && this.showPlayer) {
            this.setIsFirstVideoPlay(false);
        }

        if (this.showPlayer && this.isVideoPlaying && this.isFirstCurrentLecturePlay) {
            this.handleLectureStart();
            this.setIsFirstCurrentLecturePlay(false);
        }
    }

    @action
    playOrPauseLecture(lecture: Lecture) {
        return async () => {
            const isCurrentLecture = this.currentLecture?.id === lecture.id;

            if (!isCurrentLecture) {
                this.resetNextLectureRecommendation();
                await this.setCurrentLecture(lecture);
                this.handleLectureClick();
                this.setIsFirstCurrentLecturePlay(true);
            }

            if (!this.showPlayer) {
                this.setShowPlayer(true);
                return;
            }

            if (isCurrentLecture) {
                this.setIsVideoPlaying(!this.isVideoPlaying);
            } else {
                this.setIsVideoPlaying(true);
            }
        };
    }

    onVideoEnd() {
        this.setIsOnVideoEndState(true);
    }

    onTimeUpdate() {
        // Reset end state if video is no longer at the end, i.e.
        // there was a time update.
        if (this.isOnVideoEndState) {
            this.setIsOnVideoEndState(false);
        }
    }

    onPlayerReady() {
        // Seek to the initial start time if it exists, and then resets it.
        if (this.videoInitialStartTime) {
            this.progressBarStore?.seekTo(this.videoInitialStartTime);
            this.setVideoInitialStartTime(undefined);
        }
    }

    @action
    async setCurrentLecture(lecture: Lecture) {
        // Each lecture's video asset has a media license token which expires in 5 minutes.
        // If it is expired, we need to get a new media license token.
        if (this.isLicenseTokenExpired(lecture)) {
            await this.fetchLectureMediaLicenseToken(lecture);
        }
        runInAction(() => {
            this.currentLecture = lecture;
        });
        if (this.courseId) {
            this.lectureConsumptionStore.setLecture(lecture, this.courseId);
        } else {
            Raven.captureException(
                `Cannot update lecture consumption store as course is undefined.`,
            );
        }
    }

    fetchNextLectureRecommendation() {
        if (
            !this.discoveryUnitsContainerStore ||
            this.discoveryUnitsContainerStore.firstLoad !== false
        ) {
            this.discoveryUnitsContainerStore = new DiscoveryUnitsContainerStore({
                pageType: PAGE_TYPE_LECTURE_QUICK_VIEW,
                pageObject: {lecture_id: this.currentLecture?.id},
            });
            this.discoveryUnitsContainerStore
                ?.fetchUnits({
                    pageSize: 1,
                })
                .then(() => {
                    if (
                        this.discoveryUnitsContainerStore?.units &&
                        this.discoveryUnitsContainerStore.units.length > 0
                    ) {
                        runInAction(() => {
                            this.nextLectureReco = this.discoveryUnitsContainerStore?.units[0].items[0];
                        });
                    }
                });
        }
    }

    resetNextLectureRecommendation() {
        this.nextLectureReco = undefined;
        this.discoveryUnitsContainerStore = undefined;
    }

    onVideoProgress(event: any, progressData: ProgressData) {
        if (
            this.enableLectureRecoForBottomDrawerOnSRP &&
            progressData.position > 0 &&
            progressData.position > progressData.total - VIDEO_COMPLETION_OFFSET
        ) {
            // fetch next lecture recommendation
            this.fetchNextLectureRecommendation();
        }
        this.lectureConsumptionStore.onVideoProgress(event, progressData);
    }

    isLicenseTokenExpired(lecture: Lecture) {
        return (
            !lecture.asset.licenseTokenLoadTime ||
            new Date().getTime() - lecture.asset.licenseTokenLoadTime.getTime() >
                ASSET_LICENSE_TOKEN_TTL
        );
    }

    fetchLectureMediaLicenseToken(lecture: Lecture) {
        if (!this.courseId) {
            Raven.captureException(`Cannot fetch Media license token as course is undefined.`);
            return;
        }

        const lectureUrl = `/users/me/subscribed-courses/${this.courseId}/lectures/${lecture.id}/`;

        return new Promise(function (resolve) {
            udApi.get(lectureUrl, {params: API_LECTURE_MEDIA_LICENSE_FIELDS}).then(
                (response) => {
                    runInAction(async () => {
                        lecture.asset.media_license_token = response.data.asset.media_license_token;
                        lecture.asset.licenseTokenLoadTime = new Date();
                        resolve(lecture);
                    });
                },
                (error) => {
                    if (
                        error.response?.data &&
                        (error.response.data.detail === LECTURE_LOCKED ||
                            error.response.data.detail === ASSET_UNAVAILABLE)
                    ) {
                        Raven.captureException(
                            `Lecture ${lecture.id} failed to renew expired media license token due to ${error.response.data.detail}`,
                        );
                    } else {
                        Raven.captureException(
                            `Lecture ${lecture.id} failed to renew expired media license token: ${error}`,
                        );
                    }
                    resolve(lecture);
                },
            );
        });
    }
}
