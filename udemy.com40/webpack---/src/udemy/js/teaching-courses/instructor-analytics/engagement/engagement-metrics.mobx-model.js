import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import {formatNumber} from 'utils/numeral';

import AnalyticsTrends from '../analytics-trends.mobx-model';
import {formatRoundNumber, pacificTimeDate} from '../helpers';
import {PaginatedMetrics} from '../students-metrics.mobx-store';

const NUM_METRICS_PER_PAGE = 4;

export default class EngagementMetrics extends AnalyticsTrends {
    @observable mostBookmarked = null;
    @observable mostSkipped = null;

    @observable quizMetrics = {items: []};

    constructor(engagementMetrics) {
        super();
        // Note: we will not always have a value for all of these fields,
        // depending on which data points were requested from the API.
        set(this, {
            minutes_taught: engagementMetrics.minutes_taught,
            active_students: engagementMetrics.active_students,
            daily: engagementMetrics.daily,
            monthly: engagementMetrics.monthly,
            course: engagementMetrics.course,
            curriculum: engagementMetrics.curriculum,
            lecture_metrics: engagementMetrics.lecture_metrics,
            days_unprocessed: engagementMetrics.days_unprocessed,
            minutes_taught_per_active_students:
                engagementMetrics.active_students && engagementMetrics.minutes_taught
                    ? engagementMetrics.minutes_taught / engagementMetrics.active_students
                    : 0,
        });
        if (this.curriculum) {
            this.initializeCurriculum();
        }
    }

    initializeCurriculum() {
        const curriculumInfo = this.mapCurriculumInfo();
        this.mostBookmarked = new BookmarkMetrics(this.lecture_metrics, curriculumInfo);
        this.mostSkipped = new SkippedMetrics(this.lecture_metrics, curriculumInfo);
    }

    @computed
    get minutesTaught() {
        const roundedMinutesTaught = Math.round(this.minutes_taught);
        return this.minutes_taught > 0 && roundedMinutesTaught < 1
            ? formatRoundNumber(this.minutes_taught, 2)
            : formatNumber(roundedMinutesTaught);
    }

    @computed
    get activeStudents() {
        return formatNumber(this.active_students);
    }

    @computed
    get minutesTaughtPerActiveStudents() {
        const roundedMinutesTaughtPerActiveStudents = Math.round(
            this.minutes_taught_per_active_students,
        );
        return this.minutes_taught_per_active_students > 0 &&
            roundedMinutesTaughtPerActiveStudents < 1
            ? formatRoundNumber(this.minutes_taught_per_active_students, 2)
            : formatNumber(roundedMinutesTaughtPerActiveStudents);
    }

    isQuizMetricItem = (item, quizIds) => {
        return (
            item.item_type === 'quiz' &&
            item.is_coding_exercise === true &&
            quizIds.includes(item.id)
        );
    };

    getMappedQuizMetricItem(sectionItem, quizMetricItem) {
        return {
            engagement: {
                avg_percent_watched: quizMetricItem.success_rate,
                bookmarks: 0,
                percent_skipped:
                    (100 * quizMetricItem.dropped_learners) / quizMetricItem.viewed_learners,
                watched_students: quizMetricItem.viewed_learners,
            },
            ...sectionItem,
        };
    }

    filterSectionItem(sectionItem) {
        const {lectureMetricsDict, noEngagementData, quizIds, quizMetrics} = this;
        if (sectionItem.item_type === 'lecture') {
            return {
                engagement: lectureMetricsDict[sectionItem.id] || noEngagementData,
                ...sectionItem,
            };
        }

        if (this.isQuizMetricItem(sectionItem, quizIds)) {
            const quizMetricItem = quizMetrics.items.find((quizMetric) => {
                return quizMetric.quiz_id === sectionItem.id;
            });
            return this.getMappedQuizMetricItem(sectionItem, quizMetricItem);
        }
    }

    @computed
    get lectureMetrics() {
        const lectureMetricsDict = {};
        this.lecture_metrics.forEach((lectureData) => {
            lectureMetricsDict[lectureData.lecture_id] = lectureData;
        });
        const noEngagementData = {
            avg_percent_watched: 0,
            bookmarks: 0,
            percent_skipped: 0,
            watched_students: 0,
        };
        let quizIds = [];
        if (this.quizMetrics.items.length > 0) {
            quizIds = this.quizMetrics.items.map((quizMetric) => quizMetric.quiz_id);
        }
        const lectureOnlyCurriculum = [];
        let minIndex = 1;
        const filterMethodContext = {
            lectureMetricsDict,
            noEngagementData,
            quizIds,
            quizMetrics: this.quizMetrics,
            isQuizMetricItem: this.isQuizMetricItem,
            getMappedQuizMetricItem: this.getMappedQuizMetricItem,
        };
        this.curriculum.forEach((section) => {
            if (section.index === 0) {
                minIndex = 0; // First section is "Section 0" if there are items before Section 1
            }
            let lectures;
            if (quizIds.length > 0) {
                lectures = section.items.map(this.filterSectionItem, filterMethodContext);
                lectures = lectures.filter((lecture) => lecture !== undefined);
            } else {
                lectures = section.items.filter((item) => item.item_type === 'lecture');
                lectures = lectures.map((item) => ({
                    engagement: lectureMetricsDict[item.id] || noEngagementData,
                    ...item,
                }));
            }

            lectureOnlyCurriculum.push(
                new CurriculumSection({lectures, ...section}, section.index === minIndex),
            );
        });
        return lectureOnlyCurriculum;
    }

    mapCurriculumInfo() {
        const curriculumSectionDict = {};
        this.curriculum.forEach((section) => {
            section.items.forEach((item) => {
                curriculumSectionDict[item.id] = {
                    section: section.index,
                    index: item.object_index,
                    title: item.title,
                    is_video: item.video_asset_id !== null,
                    url: item.learn_url,
                };
            });
        });
        return curriculumSectionDict;
    }

    getDataSeries(dataSet) {
        if (!dataSet.some((dataPoint) => dataPoint.minutes_taught !== 0)) {
            return [
                {
                    data: [],
                    name: 'Minutes taught',
                },
            ];
        }
        const data = dataSet.map((dataPoint) => dataPoint.minutes_taught);
        return [
            {
                data,
                name: 'Minutes taught',
            },
        ];
    }

    getTooltipOnlyDataSeries(dataSet) {
        const activeStudentsSeries = {
            data: dataSet.map((dataPoint) => dataPoint.active_students),
            name: gettext('Active students'),
        };
        return [activeStudentsSeries];
    }

    @computed
    get finalizedDateDaily() {
        const finalizedDate = pacificTimeDate(new Date());
        finalizedDate.setDate(finalizedDate.getDate() - this.days_unprocessed);
        return finalizedDate;
    }

    @computed
    get finalizedDateMonthly() {
        const finalizedDate = new Date(this.finalizedDateDaily);
        finalizedDate.setDate(0);
        return finalizedDate;
    }
}

class BookmarkMetrics extends PaginatedMetrics {
    pageSize = NUM_METRICS_PER_PAGE;

    constructor(lectureMetrics, curriculumInfo) {
        super();
        const mostBookmarked = lectureMetrics
            .filter((lecture) => lecture.bookmarks > 0)
            .sort((a, b) => b.bookmarks - a.bookmarks);
        this.metrics = mostBookmarked
            .map((lecture) => ({
                ...curriculumInfo[lecture.lecture_id],
                ...lecture,
            }))
            .filter((lecture) => lecture.is_video); // Only video lectures can have bookmarks
    }
}

class SkippedMetrics extends PaginatedMetrics {
    pageSize = NUM_METRICS_PER_PAGE;

    constructor(lectureMetrics, curriculumInfo) {
        super();
        const mostSkipped = lectureMetrics
            .filter((lecture) => lecture.percent_skipped > 0)
            .sort((a, b) => b.percent_skipped - a.percent_skipped);
        this.metrics = mostSkipped
            .map((lecture) => ({
                ...curriculumInfo[lecture.lecture_id],
                ...lecture,
            }))
            .filter((lecture) => lecture.is_video); // "Skipped" definition for non-video lectures TBD
    }
}

class CurriculumSection {
    @observable isExpanded = this.defaultExpanded;

    constructor(data, defaultExpanded) {
        this.title = data.title;
        this.index = data.index;
        this.lectures = data.lectures;
        this.defaultExpanded = defaultExpanded;
    }

    get displayTitle() {
        return interpolate(gettext('Section %s: %s'), [this.index, this.title]);
    }

    @autobind
    @action
    toggle(isExpanded) {
        this.isExpanded = isExpanded;
    }

    @action
    open() {
        this.isExpanded = true;
    }

    @action
    close() {
        this.isExpanded = false;
    }
}
