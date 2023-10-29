import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import udApi, {MAX_TIMEOUT} from 'utils/ud-api';

import {useFetchPublicQuizzesOfACourseQuery} from '../../../gql-codegen/api-platform-graphql';
import {MAX_NUM_OF_CURRICULUM_OBJECTS} from '../../../instructor/common/constants';
import {API_STATE} from '../../../instructor/constants';
import {DEFAULT_DATA_SCOPE_FILTER} from '../constants';
import {DateSpan} from '../date-span-filter/types';
import EngagementMetrics from '../engagement/engagement-metrics.mobx-model';
import {QuizMeta} from '../quiz-filter/types';
import {ALL_CODING_EXERCISES_QUIZ_FILTER, DEFAULT_DATE_SPAN, defaultQuizMetrics} from './helpers';
import {Quiz, QuizConsumptionMetric, QuizMetric, QuizTableRowMetric} from './types';

export class PracticeInsightsStore {
    @observable courseId: number | null = null;
    @observable selectedQuiz: QuizMeta | null = null;
    @observable selectedDate: DateSpan = DEFAULT_DATE_SPAN;
    @observable dataScope = DEFAULT_DATA_SCOPE_FILTER;
    @observable quizMetrics: QuizMetric = defaultQuizMetrics;
    @observable quizTableMetrics: QuizTableRowMetric[] = [];
    @observable engagementChartMetrics: EngagementMetrics | undefined;
    @observable quizzesOfTheCourse: Array<QuizMeta> = [];

    @observable quizzesOfTheCourseSearchState = API_STATE.SEARCHING;
    @observable quizMetricsSearchState = API_STATE.SEARCHING;
    @observable quizConsumptionMetricsSearchState = API_STATE.SEARCHING;

    @observable activeTableMetricPage = 1;
    @observable sortOrderDesc = true;
    @observable activeSortKeyOfMetricTable: string | null = null;
    @observable hoveredColumnKeyOfMetricTable: string | null = null;

    @observable isRedirectedFromEngagement = false;

    @computed
    get apiState() {
        const states = [
            this.quizzesOfTheCourseSearchState,
            this.quizMetricsSearchState,
            this.quizConsumptionMetricsSearchState,
        ];
        if (states.some((state) => state === API_STATE.ERROR)) {
            return API_STATE.ERROR;
        }
        if (states.some((state) => state === API_STATE.NO_PERMISSION)) {
            return API_STATE.NO_PERMISSION;
        }
        if (states.some((state) => state === API_STATE.SEARCHING)) {
            return API_STATE.SEARCHING;
        }
        /*
        If the user is redirected from engagement page, can set this flag to false since
        we are about to return API_STATE.DONE meaning that we are all good with all the requests.
         */
        if (this.isRedirectedFromEngagement) {
            this.isRedirectedFromEngagement = false;
        }
        return API_STATE.DONE;
    }

    @autobind @action setActiveSortKeyOfMetricTable(
        key: 'viewed_learners' | 'attempted_learners' | 'successful_learners',
    ) {
        this.activeSortKeyOfMetricTable = key;
    }

    @autobind @action setHoveredColumnKeyOfMetricTable(key: string | null) {
        this.hoveredColumnKeyOfMetricTable = key;
    }

    @computed
    get hasAtLeastOneQuiz() {
        return this.quizzesOfTheCourse.length > 0;
    }

    @computed
    get pageCount() {
        return Math.ceil(this.quizTableMetrics.length / 10);
    }

    @computed
    get paginatedMetricTableData() {
        const start = (this.activeTableMetricPage - 1) * 10;
        const end = this.activeTableMetricPage * 10;
        return this.quizTableMetrics.slice(start, end);
    }

    @autobind @action onMetricTablePageChange(page: number) {
        this.activeTableMetricPage = page;
    }

    @autobind @action sortQuizTableMetrics(
        keyName: 'viewed_learners' | 'attempted_learners' | 'successful_learners',
    ) {
        runInAction(() => {
            if (this.activeSortKeyOfMetricTable === keyName) {
                this.sortOrderDesc = !this.sortOrderDesc;
            }
            this.activeSortKeyOfMetricTable = keyName;
            this.quizTableMetrics = this.quizTableMetrics.sort((a, b) => {
                if (this.sortOrderDesc) {
                    return b[keyName] - a[keyName];
                }
                return a[keyName] - b[keyName];
            });
        });
    }

    get hasAnyLearnerViewedQuiz() {
        return this.quizMetrics?.viewed_learners > 0;
    }

    getQuizMetricsOfAQuizRequestParams(quizId: number) {
        return {
            inquiry_id: quizId,
            inquiry_type: 'quiz',
            data_scope: this.dataScope,
            date_filter: this.selectedDate.value,
        };
    }

    getQuizMetricsOfACourseRequestParams(courseId: number | null) {
        return {
            inquiry_id: courseId,
            inquiry_type: 'course',
            data_scope: this.dataScope,
            date_filter: this.selectedDate.value,
        };
    }

    getQuizConsumptionMetricsByQuizIdRequestParams(quizId: number | undefined) {
        return {
            quiz_id: quizId,
            data_scope: this.dataScope,
            date_filter: this.selectedDate.value,
        };
    }

    getQuizConsumptionMetricsByCourseIdRequestParams(courseId: number | null, quizType: string) {
        return {
            course_id: courseId,
            quiz_type: quizType,
            data_scope: this.dataScope,
            date_filter: this.selectedDate.value,
        };
    }

    buildQuizConsumptionMetricsRequest(
        quizId: number | null,
        courseId: number | null,
        quizType: string,
    ) {
        let url;
        let params;

        if (quizId) {
            url = 'instructor-analytics/quiz-consumption-metrics-by-quiz-id/';
            params = this.getQuizConsumptionMetricsByQuizIdRequestParams(quizId);
        } else {
            url = 'instructor-analytics/quiz-consumption-metrics-by-course-id/';
            params = this.getQuizConsumptionMetricsByCourseIdRequestParams(courseId, quizType);
        }
        return {url, params};
    }

    buildQuizMetricsRequest(quizId: number | null, courseId: number | null) {
        const url = 'instructor-analytics/quiz-metrics/';
        let params;

        if (quizId) {
            params = this.getQuizMetricsOfAQuizRequestParams(quizId);
        } else {
            params = this.getQuizMetricsOfACourseRequestParams(courseId);
        }
        return {url, params};
    }

    buildQuizTableMetrics(quizMetricItems: QuizMetric[]) {
        const quizTableMetrics = this.quizzesOfTheCourse.map((quiz) => {
            const quizMetricItem = quizMetricItems.find((item) => item.quiz_id === quiz.id);
            return quizMetricItem
                ? {
                      quiz_id: quiz.id,
                      quiz_name: quiz.title,
                      viewed_learners: quizMetricItem.viewed_learners,
                      attempted_learners:
                          (quizMetricItem.attempted_learners / quizMetricItem.viewed_learners) *
                          100,
                      successful_learners:
                          (quizMetricItem.successful_learners / quizMetricItem.viewed_learners) *
                          100,
                  }
                : ({} as QuizTableRowMetric);
        });
        quizTableMetrics.shift();
        return quizTableMetrics;
    }

    @autobind
    @action
    /*
    This method uses Monolith endpoint to retrieve curriculum information of a course
    then filters out the quizzes of the course by the quiz type.
     */
    async fetchQuizzesOfACourse(courseId: string, quizType: string) {
        runInAction(() => {
            this.quizzesOfTheCourseSearchState = API_STATE.SEARCHING;
            this.quizzesOfTheCourse = [];
        });

        const curriculumParams = {
            params: {
                curriculum_types: 'quiz',
                page_size: MAX_NUM_OF_CURRICULUM_OBJECTS,
            },
        };

        await udApi
            .get(`/courses/${courseId}/instructor-curriculum-items/`, curriculumParams)
            .then((response) => {
                runInAction(() => {
                    const quizzes: Array<QuizMeta> = [];
                    quizzes.push(ALL_CODING_EXERCISES_QUIZ_FILTER);
                    response.data.results.forEach((quiz: Quiz) => {
                        if (
                            quiz.type.toLowerCase() === quizType.toLowerCase() &&
                            quiz.is_published
                        ) {
                            quizzes.push({
                                title: quiz.title,
                                type: quizType,
                                id: Number(quiz.id),
                            });
                        }
                    });
                    this.quizzesOfTheCourse = quizzes;
                    this.quizzesOfTheCourseSearchState = API_STATE.DONE;
                });
            })
            .catch(() => {
                runInAction(() => {
                    this.quizzesOfTheCourse = [];
                    this.quizzesOfTheCourseSearchState = API_STATE.ERROR;
                });
            });
    }

    @autobind
    @action
    /*
    This method uses GraphQL to retrieve curriculum information of a course
    then filters out the quizzes of the course by the quiz type.
    This is not currently used due to the fact that GraphQL/CRS can only provide
    public curriculum information.
     */
    async fetchQuizzesByQuery(courseId: string, quizType: string) {
        let graphqlReturnsError = false;
        runInAction(() => {
            this.quizzesOfTheCourseSearchState = API_STATE.SEARCHING;
            this.quizzesOfTheCourse = [];
        });
        async function getCurriculumForQuizzes(courseId: string) {
            try {
                const response = await useFetchPublicQuizzesOfACourseQuery.fetcher({
                    id: courseId,
                })();
                if (!response.course) {
                    graphqlReturnsError = true;
                }
                return response.course?.curriculum;
            } catch (e) {
                graphqlReturnsError = true;
            }
        }
        const curriculum = await getCurriculumForQuizzes(courseId);

        if (graphqlReturnsError) {
            runInAction(() => {
                this.quizzesOfTheCourse = [];
                this.quizzesOfTheCourseSearchState = API_STATE.ERROR;
            });
        } else {
            runInAction(() => {
                const quizzes: Array<QuizMeta> = [];
                quizzes.push(ALL_CODING_EXERCISES_QUIZ_FILTER);
                curriculum?.sections.forEach((section) => {
                    section.items.forEach((item) => {
                        if (item.__typename === quizType && 'id' in item) {
                            quizzes.push({
                                title: item.title,
                                type: quizType,
                                id: Number(item.id),
                            });
                        }
                    });
                });
                this.quizzesOfTheCourse = quizzes;

                // For now, we need to populate quiz list according to the curriculum order.
                /* this.quizzesOfTheCourse = this.quizzesOfTheCourse?.sort((q1, q2) =>
                    q1.title.localeCompare(q2.title),
                ) as QuizMeta[];*/
                runInAction(() => {
                    this.quizzesOfTheCourseSearchState = API_STATE.DONE;
                });
            });
        }
    }

    @action
    async getQuizMetricsOfAQuiz(quizId: number | null, courseId: number | null) {
        runInAction(() => {
            this.quizMetricsSearchState = API_STATE.SEARCHING;
        });

        const {url, params} = this.buildQuizMetricsRequest(quizId, courseId);
        udApi
            .get(url, {
                useCache: true,
                params,
                timeout: MAX_TIMEOUT,
            })
            .then((response) => {
                runInAction(() => {
                    this.quizMetrics = response.data.results[0].items[0];
                    if (!quizId) {
                        this.quizTableMetrics = this.buildQuizTableMetrics(
                            response.data.results[0].items,
                        );
                    }
                    this.quizMetricsSearchState = API_STATE.DONE;
                });
            })
            .catch((error) => {
                runInAction(() => {
                    this.quizMetrics = defaultQuizMetrics;
                    this.quizMetricsSearchState = this.getApiState(error);
                });
            });
    }

    @action
    async getEngagementChartMetrics(
        quizId: number | null,
        courseId: number | null,
        quizType: string,
    ) {
        runInAction(() => {
            this.quizConsumptionMetricsSearchState = API_STATE.SEARCHING;
        });
        if (!quizId && !courseId) {
            this.quizConsumptionMetricsSearchState = API_STATE.ERROR;
        }
        // Fetch response from endpoint
        const isDailyGranularity =
            this.selectedDate.value === 'last_7days' || this.selectedDate.value === 'last_30days';
        let minutesConsumed = 0;
        let monthlyForResponse: QuizConsumptionMetric[] = [];
        let dailyForResponse: QuizConsumptionMetric[] = [];

        const {url, params} = this.buildQuizConsumptionMetricsRequest(quizId, courseId, quizType);

        await udApi
            .get(url, {
                useCache: true,
                params,
                timeout: MAX_TIMEOUT,
            })
            .then((response) => {
                runInAction(() => {
                    minutesConsumed = response.data.results[0].minutes_consumed;
                    if (isDailyGranularity) {
                        dailyForResponse = response.data.results[0].items;
                    } else {
                        monthlyForResponse = response.data.results[0].items;
                    }

                    const shapedResponse = {
                        minutes_consumed: minutesConsumed,
                        items: isDailyGranularity ? dailyForResponse : monthlyForResponse,
                    };

                    // Convert response to target
                    const target = {
                        monthly: shapedResponse.items.map((item) => ({
                            date: item.for_date,
                            minutes_taught: item.minutes_consumed,
                            active_students: item.active_learners,
                        })),
                        daily: dailyForResponse.map((item) => ({
                            date: item.for_date,
                            minutes_taught: item.minutes_consumed,
                            active_students: item.active_learners,
                        })),
                        minutes_taught: shapedResponse.minutes_consumed,
                    };
                    this.engagementChartMetrics = new EngagementMetrics(target);
                    this.quizConsumptionMetricsSearchState = API_STATE.DONE;
                });
            })
            .catch((error) => {
                runInAction(() => {
                    this.quizConsumptionMetricsSearchState = this.getApiState(error);
                });
            });
    }

    getApiState(error: {response: {status: number}}) {
        if (error?.response && error.response.status === 403) {
            return API_STATE.NO_PERMISSION;
        }
        return API_STATE.ERROR;
    }
}
