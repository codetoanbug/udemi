import {Tracker, TrackingContextProvider} from '@udemy/event-tracking';
import React, {useEffect, useState, useReducer} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import Carousel from 'base-components/carousel/carousel.react-component';
import AsyncPriceCourseCard from 'browse/components/course-card/async-price-course-card.react-component';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import {DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {DeviceTypeProps} from 'browse/lib/device-type-props';
import {attachFrontendTrackingIds, discoveryTracker} from 'browse/tracking';
import {OccupationModalButton} from 'occupation/components/occupation-modal-button/occupation-modal-button.react-component';
import {OccupationFlowProgressionEvent} from 'occupation/events';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import styles from './recommendations.less';

interface Data {
    courses: {
        id: number;
        frontendTrackingId?: string;
    }[];
}

interface State {
    isLoading: boolean;
    isError: boolean;
    data: Data;
    error?: string;
}

type Action =
    | {type: 'FETCH_REQUEST'}
    | {type: 'FETCH_SUCCESS'; payload: Data}
    | {type: 'FETCH_FAILURE'; payload: string};

const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...prevState, isLoading: true};
        case 'FETCH_SUCCESS': {
            const data = action.payload;
            attachFrontendTrackingIds(data.courses);
            return {...prevState, isLoading: false, data};
        }
        case 'FETCH_FAILURE':
            return {...prevState, isLoading: false, error: action.payload};
        default:
            Raven.captureException('API fetch error');
            return prevState;
    }
};

interface ApiParams {
    course_badge?: string;
    page_size?: number;
    skip_price?: boolean;
    q: string | null;
    reco_params?: RecoParams;
}

interface RecoParams {
    subs_coll_id?: number;
    subs_filter_type?: string;
    occupation_id?: string;
}

interface RecommendationsProps extends DeviceTypeProps {
    initialData?: Data;
    subsCollectionIds?: number;
    occupationId?: number;
    enableLearnerGoalCollection?: boolean;
}

export const Recommendations = withRouter(
    ({
        initialData,
        location,
        deviceType,
        subsCollectionIds,
        occupationId,
        enableLearnerGoalCollection,
    }: RecommendationsProps & RouteComponentProps) => {
        const [state, dispatch] = useReducer(reducer, {
            isLoading: false,
            isError: false,
            data: initialData ?? {courses: []},
        });
        const [title, setTitle] = useState('Recommended Courses');
        const [isOccupationEnabled, setOccupationEnabled] = useState(false);
        const query = new URLSearchParams(location.search).get('q');

        useEffect(() => {
            const controller = new AbortController();
            const recoParams: RecoParams = {};
            const subsFilterType = new URLSearchParams(location.search).getAll('subs_filter_type');
            if (subsCollectionIds && subsFilterType.length) {
                recoParams.subs_coll_id = subsCollectionIds;
                recoParams.subs_filter_type = subsFilterType.join('|');
            }
            if (occupationId) {
                recoParams.occupation_id = occupationId.toString();
            }
            const fallbackParams: ApiParams = {
                course_badge: 'beginners_choice',
                page_size: 5,
                skip_price: true,
                q: query,
                ...recoParams,
            };
            const params: ApiParams = {
                page_size: 8,
                skip_price: true,
                q: query,
                ...recoParams,
            };

            const isAborted = (err: Error) => {
                return err.message === 'canceled';
            };

            const fetchRecommendations = async () => {
                const signal = controller.signal;
                dispatch({type: 'FETCH_REQUEST'});
                return udApi
                    .get('/search-courses/recommendation/', {params, signal})
                    .then((response) => {
                        if (!response.data.courses.length) {
                            return udApi
                                .get('/search-courses/recommendation/', {
                                    params: fallbackParams,
                                    signal,
                                })
                                .then((response) => {
                                    if (response.data.reco_unit_info) {
                                        setTitle(response.data.reco_unit_info.title);
                                        setOccupationEnabled(
                                            response.data.reco_unit_info.is_occupation_enabled,
                                        );
                                    }
                                    return response;
                                })
                                .catch((err) => {
                                    !isAborted(err) &&
                                        dispatch({type: 'FETCH_FAILURE', payload: err.message});
                                    return Promise.reject(err);
                                });
                        }
                        setTitle(response.data.reco_unit_info.title);
                        setOccupationEnabled(response.data.reco_unit_info.is_occupation_enabled);

                        // If call is successful, dispatch success action
                        dispatch({type: 'FETCH_SUCCESS', payload: {...response.data}});
                    })
                    .catch((err) => {
                        !isAborted(err) && dispatch({type: 'FETCH_FAILURE', payload: err.message});
                        return Promise.reject(err);
                    });
            };

            fetchRecommendations().catch((err) => !isAborted(err) && Raven.captureException(err));

            return () => {
                controller.abort();
            };
        }, [location.search, occupationId, query, subsCollectionIds]);
        const handleOccupationEditButtonClick = () => {
            Tracker.publishEvent(
                new OccupationFlowProgressionEvent({
                    progression: 0,
                    selection: 'edit',
                    selectionType: 'edit',
                }),
            );
        };
        if (!state.data || !state.data.courses.length) {
            return null;
        }

        const isMobile = deviceType === DEVICE_TYPE_MOBILE;
        return (
            <div>
                <div styleName="title-container">
                    <h2 className="ud-heading-xl" styleName="title">
                        {title}
                    </h2>
                    {isOccupationEnabled && occupationId && (
                        <OccupationModalButton
                            buttonText={
                                enableLearnerGoalCollection
                                    ? gettext('Edit occupation and interests')
                                    : gettext('Edit occupation')
                            }
                            onClickCallback={
                                enableLearnerGoalCollection
                                    ? undefined
                                    : handleOccupationEditButtonClick
                            }
                            nextUrl={location.search}
                            enableLearnerGoalCollection={enableLearnerGoalCollection}
                        />
                    )}
                </div>
                <Carousel
                    id="search-carousel"
                    showPager={!isMobile}
                    fullViewport={isMobile}
                    styleName="grid"
                    pagerButtonClassName={styles['pager-button']}
                >
                    {state.data.courses.map((course, i) => (
                        <TrackingContextProvider
                            key={course.id}
                            trackingContext={{
                                trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                                index: i,
                                backendSource:
                                    DiscoveryItemImpressionEvent.backendSourceOptions
                                        .SEARCH_RECOMMENDATIONS,
                            }}
                        >
                            <AsyncPriceCourseCard className="course-card" course={course} />
                        </TrackingContextProvider>
                    ))}
                </Carousel>
            </div>
        );
    },
);
