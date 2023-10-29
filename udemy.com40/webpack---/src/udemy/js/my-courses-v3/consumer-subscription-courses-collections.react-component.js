import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {withDeviceType} from '@udemy/hooks';
import classNames from 'classnames';
import {observable, runInAction} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import {TrackedLectureProgressCard} from 'browse/components/lecture-progress-card/tracked-lecture-progress-card.react-component';
import {createSaveToListContextMenu} from 'browse/components/save-to-list/create-save-to-list-context-menu';
import loadConsumerSubscriptionCoursesUnit from 'browse/lib/consumer-subscription-courses-unit';
import {UI_REGION} from 'browse/ui-regions';
import {CareerTrackUnit} from 'occupation/components/career-track-unit/career-track-unit.react-component';
import {LearningMapStore} from 'occupation/stores/learning-map/learning-map.mobx-store';
import Raven from 'utils/ud-raven';

import Collections from './collections.react-component';
import {ConsumerSubscriptionWishlistedCourses} from './consumer-subscription-wishlisted-courses.react-component';

import './consumer-subscription-courses-collections.less';

@withMatchMedia({isMdMin: 'md-min', isXlMin: 'xl-min'})
@observer
class ConsumerSubscriptionCoursesCollections extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        careerTrackUnitData: PropTypes.array,
        deviceType: PropTypes.string.isRequired,
        isMdMin: PropTypes.bool,
        isXlMin: PropTypes.bool,
    };

    static defaultProps = {
        careerTrackUnitData: [],
        isMdMin: false,
        isXlMin: false,
    };

    constructor(props) {
        super(props);
        this.saveToListContextMenu = createSaveToListContextMenu();
        this.learningMapStore = new LearningMapStore();

        this.consumerSubscriptionCourses = [];
        this.loadConsumerSubscriptionCourses();
    }

    @observable consumerSubscriptionCourses;

    loadConsumerSubscriptionCourses() {
        const subscribedCoursesOptions = {
            page: 1,
            page_size: 8,
            max_progress: 99.9,
            ordering: '-last_accessed',
            'fields[lecture]':
                '@min,content_details,asset,url,thumbnail_url,last_watched_second,object_index',
            'fields[quiz]': '@min,content_details,asset,url,object_index',
            'fields[practice]':
                '@min,content_details,asset,estimated_duration,learn_url,object_index',
        };

        loadConsumerSubscriptionCoursesUnit(subscribedCoursesOptions)
            .then((data) => {
                this.updateConsumerSubscriptionCoursesData(data);
            })
            .catch((e) => {
                Raven.captureException(e);
            });
    }

    updateConsumerSubscriptionCoursesData(data) {
        runInAction(() => {
            this.consumerSubscriptionCourses = (data && data.consumerSubscriptionCourses) || [];
        });
    }

    renderCareerTrackUnit() {
        const anyShown =
            this.props.careerTrackUnitData.length > 0 &&
            this.props.careerTrackUnitData.some((unit) =>
                this.learningMapStore.shouldShowBySettingForUnitWithTitle(unit.title),
            );
        const readyToShow = this.props.careerTrackUnitData.every((unit) =>
            this.learningMapStore.readyToShowUnitByTitle(unit.title),
        );
        if (anyShown && readyToShow) {
            return (
                <>
                    <h3 className="my-courses__section-heading ud-heading-xl">
                        {gettext('My career guides')}
                    </h3>
                    <CareerTrackUnit
                        careerTrackUnit={this.props.careerTrackUnitData}
                        uiRegion={UI_REGION.CAREER_TRACKS}
                        learningMapStore={this.learningMapStore}
                        showBySetting={true}
                    />
                </>
            );
        }
    }

    renderRecentlyViewedCarousel() {
        const {deviceType, isMdMin, isXlMin} = this.props;
        const isMobile = deviceType === 'mobile';
        const consumerSubscriptionCourses = this.consumerSubscriptionCourses;

        return (
            consumerSubscriptionCourses.length > 0 && (
                <>
                    <h3 className="my-courses__section-heading ud-heading-xl">
                        {gettext('Recently viewed')}
                    </h3>
                    <Carousel
                        data-purpose="recently-viewed-carousel"
                        fullViewport={isMobile}
                        showPager={!isMobile}
                        styleName={classNames({
                            'carousel-mobile': isMobile,
                            'carousel-desktop': !isMobile,
                            'carousel-desktop-xl': !isMobile && isXlMin,
                        })}
                    >
                        {consumerSubscriptionCourses.map((item) => (
                            <TrackedLectureProgressCard
                                course={item}
                                key={item.id}
                                pageType="my_courses_page"
                                size={isMobile || !isMdMin ? 'small' : 'large'}
                                styleName="lecture-card"
                                uiRegion="consumer-subscription"
                            />
                        ))}
                    </Carousel>
                </>
            )
        );
    }

    render() {
        return (
            <FunnelLogContextProvider>
                <>
                    <Provider resourceContextMenu={this.saveToListContextMenu}>
                        {this.renderRecentlyViewedCarousel()}
                    </Provider>
                    {this.renderCareerTrackUnit()}
                    <h3 className="my-courses__section-heading ud-heading-xl">
                        {gettext('My lists')}
                    </h3>
                    <Collections
                        history={this.props.history}
                        location={this.props.location}
                        uiRegion={UI_REGION.PERSONAL_PLAN}
                    />
                    <ConsumerSubscriptionWishlistedCourses />
                </>
            </FunnelLogContextProvider>
        );
    }
}

export default withDeviceType(ConsumerSubscriptionCoursesCollections);
