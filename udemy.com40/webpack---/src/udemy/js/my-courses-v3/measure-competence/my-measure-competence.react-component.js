import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {withUDData} from '@udemy/ud-data';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {AssessmentClickEvent, AssessmentDiscoverTabImpressionEvent} from 'assessments/events';
import {AssessmentsCarousel} from 'browse/components/assessments-carousel/assessments-carousel.react-component';
import {LearningBanner} from 'browse/components/learning-banner/learning-banner.react-component';
import handImage from 'my-courses-v3/measure-competence/hand-write.png';

import AssessmentCard from './assessment-card.react-component';
import MyMeasureCompetenceStore from './my-measure-competence.mobx-store';

import './my-measure-competence.less';

@observer
export class InternalMyMeasureCompetence extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(MyMeasureCompetenceStore),
        isConsumerSubsSubscriber: PropTypes.bool,
        udData: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        store: undefined,
        isConsumerSubsSubscriber: false,
    };

    constructor(props) {
        super(props);
        this.store =
            this.props.store || new MyMeasureCompetenceStore(props.isConsumerSubsSubscriber);
    }

    componentDidMount() {
        this.store.fetchLatestAttempts();

        // This event is triggered when the assessments tab is rendered in MyCoursesV3
        Tracker.publishEvent(
            new AssessmentDiscoverTabImpressionEvent({
                componentVisited: 'showMyCoursesAssessmentsTab',
            }),
        );
    }

    handleBannerClickEvent() {
        Tracker.publishEvent(
            new AssessmentClickEvent({
                componentName: 'getStarted',
            }),
        );
    }

    renderAssessmentCards(assessmentsToDisplay) {
        const {request} = this.props.udData;
        const {gettext} = this.props;
        const isMobile = request.isMobile;
        const isConsumerSubsSubscriber = this.props.isConsumerSubsSubscriber;

        if (!isConsumerSubsSubscriber) {
            return (
                <div className="my-courses__wide-card-grid">
                    {assessmentsToDisplay.map((result, index) => (
                        <AssessmentCard
                            key={index}
                            isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                            assessment={result}
                            size={isMobile ? 'small' : 'medium'}
                        />
                    ))}
                </div>
            );
        }

        const inProgressAssessments = assessmentsToDisplay.filter(
            (item) => item.type === 'inProgress',
        );
        const completedAssessments = assessmentsToDisplay.filter(
            (item) => item.type === 'completed',
        );

        return (
            <>
                {inProgressAssessments.length > 0 && (
                    <AssessmentsCarousel
                        title={gettext('In progress')}
                        subtitle={gettext(
                            'Assessments must be completed within 24 hours of starting',
                        )}
                        assessments={inProgressAssessments}
                        isMobile={isMobile}
                        isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                        styleName="assessment-unit"
                        cardSize={isMobile ? 'small' : 'medium'}
                    />
                )}
                {completedAssessments.length > 0 && (
                    <AssessmentsCarousel
                        title={gettext('Completed')}
                        assessments={completedAssessments}
                        isMobile={isMobile}
                        isConsumerSubsSubscriber={isConsumerSubsSubscriber}
                        styleName="assessment-unit"
                        cardSize={isMobile ? 'small' : 'medium'}
                    />
                )}
            </>
        );
    }

    render() {
        const {gettext} = this.props;
        if (this.store.isLoading) {
            return <MainContentLoader />;
        }
        const assessments = this.store.latestTestletAttempts;
        /**
         * Slicing the assessments array here in order to remove the Getting Started card when in personal plan.
         * Personal plan uses the Learning Banner rather than the Getting Started card.
         */
        const assessmentsToDisplay = this.props.isConsumerSubsSubscriber
            ? assessments.slice(1)
            : assessments;
        return (
            <div>
                {this.props.isConsumerSubsSubscriber && (
                    <LearningBanner
                        cta={gettext('Browse all assessments')}
                        text={gettext(
                            'Take an assessment and get content recommendations to hone in on your learning needs.',
                        )}
                        title={gettext('Evaluate your skills')}
                        link={'/skills-assessment/'}
                        imgSrc={handImage}
                        onBannerClick={this.handleBannerClickEvent}
                        compact={true}
                    />
                )}
                {this.renderAssessmentCards(assessmentsToDisplay)}
            </div>
        );
    }
}

export default withI18n(withUDData(InternalMyMeasureCompetence));
