import {Tracker} from '@udemy/event-tracking';
import {action, computed, observable} from 'mobx';

import {ExperimentImpressionEvent} from 'browse/events';
import {attachFrontendTrackingIds} from 'browse/tracking';
import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import {useSearchLecturesQuery, LectureSearchResponse} from 'gql-codegen/api-platform-graphql';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {SearchRelatedLecturesUnit, Lecture} from './types';

export class RelatedLecturesStore {
    @observable isLoading = true;
    @observable lectures: Lecture[] | undefined;
    @observable isLabIntent: boolean | undefined;
    @observable isLectureForbidden: boolean | undefined;
    @observable unitTrackingId?: string;
    @observable lduVariant?: string;
    enableLectureSearchInGQL: boolean;

    constructor(enableLectureSearchInGQL: boolean) {
        this.enableLectureSearchInGQL = enableLectureSearchInGQL;
    }

    @computed
    get unit() {
        if (!this.lectures || !this.lectures.length) {
            return undefined;
        }

        return {
            items: this.lectures,
            item_type: ITEM_TYPES.LECTURE,
            tracking_id: this.unitTrackingId,
        };
    }

    @action
    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @action
    initializeFromRESTResponse = (unit: SearchRelatedLecturesUnit) => {
        this.lectures = unit.items;
        this.unitTrackingId = unit.result_tracking_id;
        this.isLabIntent = unit.is_lab_intent;
        this.isLectureForbidden = unit.is_lecture_forbidden;
        this.lduVariant = unit.ldu_variant;
        attachFrontendTrackingIds(this.lectures);
    };

    @action
    initializeFromGQLResponse = (searchLectures: LectureSearchResponse) => {
        const {metadata, lectures} = searchLectures;

        // Metadata fields
        this.unitTrackingId = metadata?.trackingId;
        this.isLabIntent = metadata?.showLabUnit;
        this.isLectureForbidden = metadata?.showLectureDiscoveryUnit;
        this.lduVariant = metadata?.lectureExperimentVariant;

        // Lectures fields
        this.lectures = lectures?.map((lectureSearchResponse) => {
            const {trackingId, lecture, course} = lectureSearchResponse;

            // Adding param for autoplaying lectures on CTP
            const urlAutoEnroll = new URL(lecture.urlAutoEnroll);
            urlAutoEnroll.searchParams.append('isDefaultPlaying', 'true');

            return {
                content_length: lecture.durationInSeconds,
                course: {
                    id: parseInt(course.id, 10),
                    title: course?.title ?? '',
                },
                enroll_url: urlAutoEnroll.toString(),
                id: parseInt(lecture.id, 10),
                primary_topic_title: course.primaryTopic?.name ?? '',
                title: lecture.title,
                tracking_id: trackingId ?? '',
                type: ITEM_TYPES.LECTURE,
            };
        });
        attachFrontendTrackingIds(this.lectures);
    };

    async fetchRelatedLecturesByQuery(
        searchQuery: string,
        experimentIdsLectureSearchGQL: number[] | undefined,
    ) {
        const apiData = {
            url: '/search-lectures/',
            params: {q: searchQuery},
        };

        try {
            this.setIsLoading(true);

            if (experimentIdsLectureSearchGQL && experimentIdsLectureSearchGQL.length > 0) {
                Tracker.publishEvent(
                    new ExperimentImpressionEvent(experimentIdsLectureSearchGQL, false),
                );
            }
            if (this.enableLectureSearchInGQL) {
                const response = await useSearchLecturesQuery.fetcher({
                    query: searchQuery,
                })();
                const searchLectures = response?.searchLectures;
                searchLectures &&
                    this.initializeFromGQLResponse(searchLectures as LectureSearchResponse);
            } else {
                const {data} = await udApi.get(apiData.url, {params: apiData.params});
                this.initializeFromRESTResponse(data);
            }
        } catch (error) {
            Raven.captureException(`Error when fetching related lectures: ${error}`);
        } finally {
            this.setIsLoading(false);
        }
    }
}
