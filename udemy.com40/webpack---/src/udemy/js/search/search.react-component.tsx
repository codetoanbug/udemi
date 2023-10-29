import {Tracker, TrackingContextProvider} from '@udemy/event-tracking';
import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {useFormatNumber, useI18n} from '@udemy/i18n';
import {MarketplaceOnly} from '@udemy/react-brand-components';
import {Button} from '@udemy/react-core-components';
import {
    CourseObjectivesQuickViewBox,
    CourseObjectivesQuickViewBoxProps,
    BundleUnit,
} from '@udemy/react-discovery-units';
import {AdvertisingBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {getConfigData, serverOrClient} from '@udemy/shared-utils';
import classNames from 'classnames';
import {when} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React, {useMemo, useRef} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {AssessmentClickEvent} from 'assessments/events';
import ErrorBoundary from 'base-components/error-boundary/error-boundary.react-component';
import CourseDirectory, {
    onCollectionTypeChange,
} from 'browse/components/course-directory/course-directory.react-component';
import CourseList from 'browse/components/course-directory/course-list/course-list.react-component';
import {SkeletonCourseCarousel} from 'browse/components/discovery-units-container/skeleton-course-carousel.react-component';
import {LectureQuickViewStore} from 'browse/components/lecture-quick-view/lecture-quick-view.mobx-store';
import {LectureQuickView} from 'browse/components/lecture-quick-view/lecture-quick-view.react-component';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {CompactUBNotice} from 'browse/components/notices/compact-ub-notice.react-component';
import RefundNotice from 'browse/components/notices/refund-notice.react-component';
import {BackendSourceOptions} from 'browse/events';
import {funnelTrackingConstants, CollectionTypes} from 'browse/lib/constants';
import {getDeviceType} from 'browse/lib/device-type';
import loadSubscribedCoursesUnit from 'browse/lib/load-subscribed-courses-unit';
import {EnrolledBrowseCourse} from 'browse/types/course';
import {UI_REGION} from 'browse/ui-regions';
import loadCommonAppContext from 'common/load-common-app-context';
import {showFooterWhenContentReady} from 'footer/content-ready';
import {Lab, SearchAggregationInputOption} from 'gql-codegen/api-platform-graphql';
import {CareerTrackBackLink} from 'occupation/components/career-track-back-link/career-track-back-link.react-component';
import {CAREER_TRACK_LANDING_PAGE} from 'occupation/constants';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import CourseCardResourceContextMenuWrapper from 'organization-common/resource-context-menu/course-card-resource-context-menu-wrapper.react-component';
import ResourceContextMenuProvider from 'organization-common/resource-context-menu/resource-context-menu-provider.react-component';
import {LabSearchRecommendationsStore} from 'search/recommendations/lab-search-recommendations.mobx-store';
import {CourseSearchResult} from 'search/types/course-search-result';
import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {getVariantValue} from 'utils/get-experiment-data';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import {AnalyzedQuery, AnalyzedQueryData} from './analyzed-query/analyzed-query.react-component';
import {MAX_EXPANDED_LECTURE_RESULTS, MEASURE_COMPETENCE_SEARCH_STRINGS} from './constants';
import {CourseCard} from './course-card/course-card.react-component';
import {trackSearchCourseImpression} from './events';
import {LearningLanguageSelector} from './learning-language-selector/learning-language-selector.react-component';
import {QuerySwitcher} from './query-switcher/query-switcher.react-component';
import {LabSearchRecommendations} from './recommendations/labs-recommendations.react-component';
import {Recommendations} from './recommendations/recommendations.react-component';
import {RelatedLecturesStore} from './related-lectures/related-lectures.mobx-store';
import {RelatedLectures} from './related-lectures/related-lectures.react-component';
import {LDU_VARIANT} from './related-lectures/types';
import {RelatedSearches} from './related-searches/related-searches.react-component';
import styles from './search.less';
import {useSearchAPI} from './use-search-api';

const Unavailable = () => {
    const {gettext} = useI18n();

    return (
        <div className="ud-container ud-page-wrapper" styleName="container">
            <h1 className="ud-heading-xl">{gettext('Sorry, search is currently unavailable')}</h1>
            <p
                className="ud-heading-lg"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'search:browse-courses-link',
                    html: gettext('Please try again, or <a href="/">browse courses</a>'),
                })}
            />
        </div>
    );
};

interface NoResultsProps {
    correctedPhrase: string;
    originalPhrase?: string;
    suggestedPhrase?: string;
    analyzedQuery?: AnalyzedQueryData[];
    detectedLanguage?: string;
    isInferredLanguage?: boolean;
    inferredProbability?: number;
    query?: Record<string, string>;
    location: RouteComponentProps['location'];
}

export const NoResults = ({
    correctedPhrase,
    originalPhrase,
    suggestedPhrase,
    analyzedQuery,
    detectedLanguage,
    isInferredLanguage,
    inferredProbability,
    query,
    location,
}: NoResultsProps) => {
    const {gettext, interpolate} = useI18n();

    const params = new URLSearchParams(location.search);
    const hasSubsOnlyFilter = params.get('subs_filter_type') === 'subs_only';
    const escapedHtmlCorrectedPhrase = escapeHtml(correctedPhrase);

    if (hasSubsOnlyFilter) {
        const searchParams = new URLSearchParams({
            q: correctedPhrase,
            subs_filter_type: 'purchasable_only',
            homeOnSwitch: String(true),
        });
        return (
            <div className="ud-container ud-page-wrapper" styleName="container">
                <div>
                    {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                    <div
                        className="ud-heading-xl"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'search:no-results-for-query',
                            html: interpolate(
                                gettext('We couldn’t find any exact matches for <q>%s</q>'),
                                [correctedPhrase],
                            ),
                        })}
                    />
                    <div styleName="search-all-text">
                        {interpolate(
                            gettext(
                                'Search for "%s" courses outside of the Personal Plan collection',
                            ),
                            [correctedPhrase],
                        )}
                    </div>
                </div>
                <QuerySwitcher
                    correctedPhrase={correctedPhrase}
                    originalPhrase={originalPhrase}
                    suggestedPhrase={suggestedPhrase}
                />
                <Button
                    componentClass="a"
                    data-purpose="search-all-courses"
                    onClick={() =>
                        onCollectionTypeChange(
                            correctedPhrase,
                            0,
                            CollectionTypes.CONSUMERSUBSCRIPTION,
                            CollectionTypes.MX,
                        )
                    }
                    href={`${location.pathname}?${searchParams.toString()}`}
                >
                    {gettext('Search all courses')}
                </Button>
                <p
                    className="ud-text-xs"
                    styleName="pp-no-result-description"
                    data-purpose="pp-no-result-description"
                >
                    {gettext(
                        'If you can’t find the course you’re looking for within Personal Plan,' +
                            ' you can still explore and purchase courses outside your subscription.' +
                            ' Personal Plan gives you access to a curated collection of 5,000+ courses' +
                            ' on in-demand professional topics, along with a selection of personal development courses.',
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="ud-container ud-page-wrapper" styleName="container">
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h1
                className="ud-heading-xl"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'search:no-results-for-query',
                    html: interpolate(
                        gettext("Sorry, we couldn't find any results for <q>%s</q>"),
                        [escapedHtmlCorrectedPhrase],
                    ),
                })}
            />
            <QuerySwitcher
                correctedPhrase={correctedPhrase}
                originalPhrase={originalPhrase}
                suggestedPhrase={suggestedPhrase}
            />
            {analyzedQuery && (
                <AnalyzedQuery
                    analyzedQuery={analyzedQuery}
                    detectedLanguage={detectedLanguage}
                    isInferredLanguage={isInferredLanguage}
                    inferredProbability={inferredProbability}
                    query={query}
                />
            )}
            <div>
                <h2 className="ud-heading-lg">
                    {gettext('Try adjusting your search. Here are some ideas:')}
                </h2>
                <ul>
                    <li>{gettext('Make sure all words are spelled correctly')}</li>
                    <li>{gettext('Try different search terms')}</li>
                    <li>{gettext('Try more general search terms')}</li>
                </ul>
            </div>
        </div>
    );
};

const deviceType = getDeviceType();
const udConfig = getConfigData();
const resourceContextMenuProps = {context: CONTEXT_TYPES.SEARCH};

function getUnitPosition(variant: string, fallback: number) {
    const position = parseInt(getVariantValue('srp', variant, fallback), 10);
    return isNaN(position) ? fallback : position;
}

function onClickAssessmentBanner() {
    Tracker.publishEvent(
        new AssessmentClickEvent({
            componentName: 'bannerSearch',
        }),
    );
}

interface SearchProps {
    subsCollectionIds?: number;
    showSRPRefundNotice?: boolean;
    showUserEnrollmentProgress?: boolean;
    showPersonalPlanBadge?: boolean;
    showCodingExerciseCount?: boolean;
    enableInLectureSearchSegments?: boolean;
    enableLabsInPersonalPlan?: boolean;
    occupationId?: number;
    showCodingExercisesBadge?: boolean;
    enableLectureRecoForBottomDrawerOnSRP?: boolean;
    enableLearnerGoalCollection?: boolean;
    enableLectureSearchInGQL?: boolean;
    experimentIdsLectureSearchGQL?: number[];
}

export const Search = withRouter(
    observer(
        // eslint-disable-next-line max-statements
        ({
            location,
            subsCollectionIds,
            showSRPRefundNotice = true,
            showUserEnrollmentProgress = false,
            showPersonalPlanBadge = false,
            enableInLectureSearchSegments = false,
            enableLabsInPersonalPlan = false,
            occupationId,
            showCodingExercisesBadge = false,
            enableLectureRecoForBottomDrawerOnSRP = false,
            enableLearnerGoalCollection = false,
            enableLectureSearchInGQL = false,
            experimentIdsLectureSearchGQL = undefined,
        }: SearchProps & RouteComponentProps) => {
            const {formatNumber} = useFormatNumber();
            const {gettext, interpolate, ninterpolate} = useI18n();
            const [isConsumerSubsSubscriber, setIsConsumerSubsSubscriber] = React.useState(false);
            const [hasRemovedHiddenFromFooter, setHasRemovedHiddenFromFooter] = React.useState(
                false,
            );
            const [isCommonAppContextLoaded, setIsCommonAppContextLoaded] = React.useState(false);
            const [courseEnrollment, setCourseEnrollment] = React.useState<EnrolledBrowseCourse[]>(
                [],
            );
            const [
                labSearchRecommendationStore,
                refreshLabSearchRecommendationStore,
            ] = React.useState(() => new LabSearchRecommendationsStore());
            const [lectureQuickviewStore] = React.useState(
                () => new LectureQuickViewStore(gettext, enableLectureRecoForBottomDrawerOnSRP),
            );
            const [relatedLecturesStore] = React.useState(
                () => new RelatedLecturesStore(enableLectureSearchInGQL),
            );
            let totalLectureUnitExpanded = 0;
            React.useEffect(() => {
                async function _getIsConsumerSubsSubscriber() {
                    const commonAppContext = await loadCommonAppContext();
                    const {user} = commonAppContext.data.header;
                    if ('id' in user) {
                        setIsConsumerSubsSubscriber(user.consumer_subscription_active);
                    } else {
                        setIsConsumerSubsSubscriber(false);
                    }
                    setIsCommonAppContextLoaded(true);
                }

                _getIsConsumerSubsSubscriber();
            }, []);

            const searchParams = useMemo(() => new URLSearchParams(location.search), [
                location.search,
            ]);
            const containerRef = useRef<HTMLDivElement>(null);
            const {data, error, isLoading: loading} = useSearchAPI(
                location.search,
                subsCollectionIds,
            );

            const filterOrder = subsCollectionIds ? ['subs_filter_type'] : undefined;

            React.useEffect(() => {
                // Footer is initially hidden to optimize CLS. Show it when content is loaded.
                if (!hasRemovedHiddenFromFooter && (data || error)) {
                    setHasRemovedHiddenFromFooter(true);
                    showFooterWhenContentReady();
                }
            }, [hasRemovedHiddenFromFooter, data, error]);

            React.useEffect(() => {
                async function _getUserEnrollment() {
                    await when(() => !udMe.isLoading);
                    if (udMe.is_authenticated) {
                        let page = 1;
                        let results = null;
                        let allEnrolledCourses: EnrolledBrowseCourse[] = [];
                        do {
                            results = await loadSubscribedCoursesUnit(
                                {page, page_size: 250},
                                '@min,completion_ratio,enrollment_time',
                            );
                            const enrolledCourses = results?.courses;
                            if (enrolledCourses && enrolledCourses.length > 0) {
                                allEnrolledCourses = [...allEnrolledCourses, ...enrolledCourses];
                                setCourseEnrollment(allEnrolledCourses);
                            }
                            page++;
                        } while (results?.next);
                    }
                }

                _getUserEnrollment();
            }, []);

            const labsInProSearchEnabled =
                udMe.id &&
                udMe.organization &&
                (udMe.organization?.is_pro_license_holder ||
                    udConfig.features.organization.learning_path?.pro_path);
            const labsInPPSearchEnabled = enableLabsInPersonalPlan && isConsumerSubsSubscriber;
            const isLabsEnabled = labsInProSearchEnabled || labsInPPSearchEnabled;
            const showRelatedLectures = !!udMe.organization;

            React.useEffect(() => {
                const promises = [];
                if (isLabsEnabled || showRelatedLectures) {
                    const params = new URLSearchParams(location.search);
                    const query = params.get('q');
                    let filters: [SearchAggregationInputOption] | undefined;
                    if (labsInPPSearchEnabled) {
                        filters = [
                            {
                                key: 'subs_content_collection',
                                value: 'in_mine',
                            },
                        ];
                    }

                    if (!query) {
                        return;
                    }

                    isLabsEnabled &&
                        promises.push(
                            labSearchRecommendationStore.fetchLabsByQuery(query, filters),
                        );
                    showRelatedLectures &&
                        promises.push(
                            relatedLecturesStore.fetchRelatedLecturesByQuery(
                                query,
                                experimentIdsLectureSearchGQL,
                            ),
                        );
                    Promise.all(promises);
                }
            }, [
                labSearchRecommendationStore,
                location.search,
                isLabsEnabled,
                labsInPPSearchEnabled,
                relatedLecturesStore,
                showRelatedLectures,
                experimentIdsLectureSearchGQL,
            ]);

            // error state
            if (error) {
                return <Unavailable />;
            }

            // Only show the Loader component on initial render. During subsequent fetches, i.e. pagination, just apply the loading class to the existing view
            if (!data) {
                return <MainContentLoader styleName="loader-spacing" withLCPCandidate={true} />;
            }

            const {
                aggregations,
                analyzed_query: analyzedQuery,
                detected_language: detectedLanguage,
                is_inferred_language: isInferredLanguage,
                inferred_probability: inferredProbability,
                count,
                courses,
                has_courses_for_org: hasCoursesForOrg,
                original_phrase: originalPhrase,
                paid_alternative: paidAlternativeCourse,
                pagination,
                query,
                boosted_language: boostedLanguage,
                query_operation: queryOperation,
                search_tracking_id: searchTrackingId,
                sort_options: sortOptions,
                inferred_language_key: inferredLanguage,
                backoff_languages: backoffLanguages,
                query_language_inference_tracking_id: queryLanguageInferenceTrackingId,
                suggestion,
                topic,
            } = data;

            // no results state
            if (data && data.count === 0) {
                return (
                    <NoResults
                        correctedPhrase={queryOperation.phrase}
                        originalPhrase={originalPhrase}
                        suggestedPhrase={suggestion?.phrase}
                        analyzedQuery={analyzedQuery}
                        detectedLanguage={detectedLanguage}
                        isInferredLanguage={isInferredLanguage}
                        inferredProbability={inferredProbability}
                        query={query}
                        location={location}
                    />
                );
            }

            const onPageChange = () => {
                containerRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
            };

            const loadLabSearchResults = () => {
                refreshLabSearchRecommendationStore(new LabSearchRecommendationsStore());
            };

            const window = () => {
                return serverOrClient.global;
            };

            const renderCourseImage = (ImageComponent: React.ElementType, {...props}) => {
                return (
                    <div className={styles['search-course-image']}>
                        <ImageComponent width={322} height={181} {...props} />
                    </div>
                );
            };

            const renderCourseCard = (courses: CourseSearchResult[]) =>
                courses.map((course, index) => {
                    let isUserEnrolled = false;
                    let completionRatio = null;
                    let enrollmentDate = null;
                    const enrollmentData = courseEnrollment.find((c) => c.id === course.id);
                    if (enrollmentData && !course.is_user_subscribed) {
                        isUserEnrolled = true;
                        completionRatio = enrollmentData.completion_ratio;
                        enrollmentDate = new Date(enrollmentData.enrollment_time);
                    }
                    const expandLectureResults =
                        isConsumerSubsSubscriber &&
                        course.curriculum_items?.length > 0 &&
                        totalLectureUnitExpanded++ < MAX_EXPANDED_LECTURE_RESULTS;
                    return (
                        <TrackingContextProvider
                            // adding tracking_id as key so when filter changes and courses are reloaded,
                            // react knows that there has been a change to trigger events. TB-4769
                            key={`${course.id} ${course.tracking_id}`}
                            trackingContext={{
                                trackImpressionFunc: trackSearchCourseImpression,
                                searchTrackingId,
                                index,
                                trackingId: course.tracking_id,
                                backendSource: BackendSourceOptions.SEARCH_RECOMMENDATIONS,
                                uiRegion: UI_REGION.SEARCH_RECOMMENDATION_UNIT,
                            }}
                        >
                            <ResourceContextMenuProvider
                                resourceContextMenuProps={resourceContextMenuProps}
                            >
                                <CourseCardResourceContextMenuWrapper
                                    className={classNames(
                                        'course-list-context-menu',
                                        isConsumerSubsSubscriber
                                            ? styles['search-course-card-context-menu']
                                            : '',
                                    )}
                                    course={course}
                                >
                                    {course.objectives_summary?.length > 0 ? (
                                        <CourseObjectivesQuickViewBox
                                            course={
                                                (course as unknown) as CourseObjectivesQuickViewBoxProps['course']
                                            }
                                            isUserEnrolled={isUserEnrolled}
                                            enrollmentDate={enrollmentDate as Date}
                                            courseCard={
                                                <CourseCard
                                                    course={course}
                                                    query={queryOperation.phrase}
                                                    isUserEnrolled={
                                                        showUserEnrollmentProgress
                                                            ? isUserEnrolled
                                                            : undefined
                                                    }
                                                    completionRatio={
                                                        showUserEnrollmentProgress
                                                            ? completionRatio
                                                            : undefined
                                                    }
                                                    renderCourseImage={
                                                        isConsumerSubsSubscriber
                                                            ? renderCourseImage
                                                            : undefined
                                                    }
                                                    isConsumerSubsSubscriber={
                                                        isConsumerSubsSubscriber
                                                    }
                                                    expandLectureResults={expandLectureResults}
                                                />
                                            }
                                            styleName="quick-view-box"
                                            showCta={true}
                                            placement={index === 0 ? 'bottom' : undefined}
                                        />
                                    ) : (
                                        <CourseCard
                                            course={course}
                                            query={queryOperation.phrase}
                                            isUserEnrolled={
                                                showUserEnrollmentProgress
                                                    ? isUserEnrolled
                                                    : undefined
                                            }
                                            completionRatio={
                                                showUserEnrollmentProgress
                                                    ? completionRatio
                                                    : undefined
                                            }
                                            renderCourseImage={
                                                isConsumerSubsSubscriber
                                                    ? renderCourseImage
                                                    : undefined
                                            }
                                            isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                                            expandLectureResults={expandLectureResults}
                                        />
                                    )}
                                </CourseCardResourceContextMenuWrapper>
                            </ResourceContextMenuProvider>
                        </TrackingContextProvider>
                    );
                });

            const courseDirectoryProps = {
                aggregations,
                courses: courses ?? [],
                pagination,
                sortOptions,
                backoffLanguages,
                loading,
                onPageChange,
                renderCourseCard,
                filterOrder,
                queryLanguageInferenceTrackingId,
                query: queryOperation.phrase,
            };

            const isMeasureCompetenceEnabledForSearchQuery =
                udConfig.brand.has_organization &&
                udConfig.features.organization?.learning_path?.pro_path &&
                MEASURE_COMPETENCE_SEARCH_STRINGS.includes(queryOperation.phrase);
            const showCareerTrackBackLink = searchParams
                .get('src')
                ?.includes(CAREER_TRACK_LANDING_PAGE);
            const showRecommendation =
                (!udConfig.brand.has_organization && !isConsumerSubsSubscriber) ||
                (isConsumerSubsSubscriber && occupationId);
            let showCourseRecoAtIndex8 = false;

            let showLabsUnitAtIndex3 = false;
            if (isLabsEnabled && !showRelatedLectures) {
                showLabsUnitAtIndex3 = true;
            } else if (showRelatedLectures && isLabsEnabled) {
                const searchServiceCriteria =
                    !(queryOperation.phrase.split(' ').length === 1) &&
                    !relatedLecturesStore.isLectureForbidden &&
                    !relatedLecturesStore.isLabIntent;
                const emptyLabsResultsWithNoError =
                    !labSearchRecommendationStore?.labs.length &&
                    labSearchRecommendationStore?.error === undefined;
                const showRelatedLecturesUnitAtIndex3 =
                    relatedLecturesStore.lectures?.length &&
                    (searchServiceCriteria || emptyLabsResultsWithNoError);
                showLabsUnitAtIndex3 = !showRelatedLecturesUnitAtIndex3;
            }

            const hasLabsLoading = isLabsEnabled && labSearchRecommendationStore.isLoading;
            const hasRelatedLecturesLoading = showRelatedLectures && relatedLecturesStore.isLoading;

            function renderCourseInjectionLoading() {
                return <SkeletonCourseCarousel courseCount={4} />;
            }

            function renderUnitInjectionAtIndex3() {
                if (hasLabsLoading || hasRelatedLecturesLoading) {
                    return renderCourseInjectionLoading();
                }
                return showLabsUnitAtIndex3 ? renderLabsUnit() : renderRelatedLecturesUnit();
            }

            function renderUnitInjectionAtIndex6() {
                const showLabsUnitAtIndex6 = !showLabsUnitAtIndex3;

                if (hasLabsLoading || hasRelatedLecturesLoading) {
                    return renderCourseInjectionLoading();
                }
                return showLabsUnitAtIndex6 ? renderLabsUnit() : renderRelatedLecturesUnit();
            }

            function renderRelatedLecturesUnit() {
                if (!relatedLecturesStore.lectures?.length) {
                    return null;
                }
                return (
                    <RelatedLectures
                        store={relatedLecturesStore}
                        lectureQuickViewStore={
                            relatedLecturesStore.lduVariant === LDU_VARIANT.ONLY_BOTTOM_DRAWER
                                ? lectureQuickviewStore
                                : undefined
                        }
                        uiRegion={
                            relatedLecturesStore.lduVariant === LDU_VARIANT.ONLY_BOTTOM_DRAWER
                                ? UI_REGION.LECTURE_DISCOVERY_UNIT_VIDEO_CARD_DRAWER
                                : undefined
                        }
                    />
                );
            }

            function renderLabsUnit() {
                // Logic for rendering labs unit
                // 1. If UB Pro render labs unit
                // 2. If user has personal plan with labs enabled and no occupation assignment
                //    render labs unit
                // 3. If user has personal plan with labs enabled and has occupation assignment
                //    a. render labs unit if labs search results have labs (no error) and render course reco unit at index 8
                //    b. In case of error returned from API, hide the unit and let occupation aware course reco unit be displayed at index 6.
                if (
                    labsInPPSearchEnabled &&
                    occupationId &&
                    labSearchRecommendationStore.labs.length == 0
                ) {
                    return null;
                }
                if (labsInPPSearchEnabled && occupationId) showCourseRecoAtIndex8 = true;
                return (
                    <LabSearchRecommendations
                        labs={labSearchRecommendationStore.labs as Partial<Lab>[]}
                        error={labSearchRecommendationStore.error}
                        deviceType={deviceType}
                        searchResultSetTrackingId={labSearchRecommendationStore.trackingId}
                        uiRegion={LABS_DISCOVER_COMPONENTS.LABS_IN_SEARCH}
                        onReload={loadLabSearchResults}
                        labsInProSearchEnabled={labsInProSearchEnabled}
                    />
                );
            }

            return (
                <div className="ud-container ud-page-wrapper" ref={containerRef}>
                    <header styleName="header-container">
                        {showCareerTrackBackLink && <CareerTrackBackLink window={window()} />}
                        {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                        <h1
                            className="ud-heading-xl"
                            styleName="header-title"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'search:query',
                                html: ninterpolate(
                                    '%(count)s result for “%(query)s”',
                                    '%(count)s results for “%(query)s”',
                                    count,
                                    {
                                        count: formatNumber(count),
                                        query: escapeHtml(queryOperation.phrase),
                                    },
                                ),
                            })}
                        />
                        <LearningLanguageSelector />
                        <QuerySwitcher
                            correctedPhrase={queryOperation.phrase}
                            originalPhrase={originalPhrase}
                            suggestedPhrase={suggestion?.phrase}
                        />
                        {analyzedQuery && (
                            <AnalyzedQuery
                                analyzedQuery={analyzedQuery}
                                detectedLanguage={detectedLanguage}
                                isInferredLanguage={isInferredLanguage}
                                inferredProbability={inferredProbability}
                                query={query}
                            />
                        )}
                    </header>
                    {showSRPRefundNotice && !isConsumerSubsSubscriber && (
                        <RefundNotice styleName="refund-notice" />
                    )}
                    <FunnelLogContextProvider
                        data-purpose="course-directory-funnel-log"
                        context={funnelTrackingConstants.searchPage}
                        subcontext={queryOperation.phrase}
                    >
                        <>
                            {isCommonAppContextLoaded && (
                                <Provider
                                    inferredLanguage={inferredLanguage}
                                    isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                                    showPersonalPlanBadge={showPersonalPlanBadge}
                                    showCodingExercisesBadge={showCodingExercisesBadge}
                                    lectureQuickViewStore={lectureQuickviewStore}
                                >
                                    <CourseDirectory {...courseDirectoryProps}>
                                        {isMeasureCompetenceEnabledForSearchQuery && (
                                            <div data-item-index={2}>
                                                <AdvertisingBanner
                                                    title={gettext('Check in on your skills')}
                                                    subtitle={gettext(
                                                        'Take an assessment to get course recommendations and guidance.',
                                                    )}
                                                    submitButtonText={gettext('Get started')}
                                                    submitButtonProps={{
                                                        componentClass: 'a',
                                                        href: '/skills-assessment/',
                                                        udStyle: 'white-solid',
                                                        onClick: onClickAssessmentBanner,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {(Boolean(hasCoursesForOrg) || topic) && (
                                            <div
                                                styleName="unit-injection"
                                                data-item-index={getUnitPosition(
                                                    'top_companies_and_bundle_position',
                                                    3,
                                                )}
                                            >
                                                {Boolean(hasCoursesForOrg) &&
                                                    !isConsumerSubsSubscriber && (
                                                        <CompactUBNotice />
                                                    )}
                                                {!udConfig.brand.has_organization && topic && (
                                                    <FunnelLogContextProvider
                                                        context={funnelTrackingConstants.searchPage}
                                                        subcontext={
                                                            funnelTrackingConstants.learningPack
                                                        }
                                                    >
                                                        <BundleUnit
                                                            pageType="topic-bundle"
                                                            pageObjectId={topic.id}
                                                        />
                                                    </FunnelLogContextProvider>
                                                )}
                                            </div>
                                        )}
                                        <div styleName="unit-injection" data-item-index={3}>
                                            {(isLabsEnabled || showRelatedLectures) &&
                                                renderUnitInjectionAtIndex3()}
                                        </div>
                                        <div styleName="unit-injection" data-item-index={6}>
                                            {isLabsEnabled &&
                                                showRelatedLectures &&
                                                renderUnitInjectionAtIndex6()}
                                        </div>
                                        <div
                                            styleName="unit-injection"
                                            data-item-index={
                                                showCourseRecoAtIndex8
                                                    ? 8
                                                    : getUnitPosition(
                                                          'topic_and_recommendations_position',
                                                          6,
                                                      )
                                            }
                                        >
                                            {showRecommendation && (
                                                <Recommendations
                                                    deviceType={deviceType}
                                                    subsCollectionIds={subsCollectionIds}
                                                    occupationId={occupationId}
                                                    enableLearnerGoalCollection={
                                                        enableLearnerGoalCollection
                                                    }
                                                />
                                            )}
                                        </div>

                                        {paidAlternativeCourse && (
                                            <>
                                                <h2 className="ud-heading-xl">
                                                    {interpolate(
                                                        gettext('Top paid course in "%s"'),
                                                        [queryOperation.phrase],
                                                        false,
                                                    )}
                                                </h2>
                                                <CourseList courses={[paidAlternativeCourse]} />
                                            </>
                                        )}
                                        {!isConsumerSubsSubscriber && (
                                            <MarketplaceOnly>
                                                <RelatedSearches
                                                    searchQuery={queryOperation.phrase}
                                                    searchTrackingId={searchTrackingId}
                                                    boostedLanguage={boostedLanguage}
                                                />
                                            </MarketplaceOnly>
                                        )}
                                    </CourseDirectory>
                                </Provider>
                            )}
                        </>
                    </FunnelLogContextProvider>
                    {(isConsumerSubsSubscriber ||
                        relatedLecturesStore?.lduVariant === LDU_VARIANT.ONLY_BOTTOM_DRAWER) && (
                        <ErrorBoundary
                            captureException={(e) =>
                                Raven.captureException(`Error in Search Lecture QuickView: ${e}`)
                            }
                        >
                            <LectureQuickView
                                store={lectureQuickviewStore}
                                enableLectureRecoForBottomDrawerOnSRP={
                                    enableLectureRecoForBottomDrawerOnSRP
                                }
                                enableInLectureSearchSegments={enableInLectureSearchSegments}
                            />
                        </ErrorBoundary>
                    )}
                </div>
            );
        },
    ),
);
