import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import ListAltIcon from '@udemy/icons/dist/list-alt.ud-icon';
import {SuspenseUntilInView, Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {AssessmentClickEvent, AssessmentPresentedEvent} from 'assessments/events';
import {AssessmentStatusBadge} from 'browse/components/badge/assessment-status-badge.react-component';
import {
    ASSESSMENT_BADGE_EXPIRED,
    ASSESSMENT_BADGE_COMPLETED,
    ASSESSMENT_BADGE_IN_PROGRESS,
} from 'browse/components/badge/constants';
import {noop} from 'utils/noop';

import {AssessmentBetaBadge} from './assessment-card-components/assessment-beta-badge.react-component';
import {AssessmentCTA} from './assessment-card-components/assessment-cta.react-component';
import {AssessmentsIcon} from './assessment-card-components/assessment-icon.react-component';
import styles from './take-assessment-card.less';

const AssessmentCardContextMenuLazy = React.lazy(() =>
    import('./assessment-card-context-menu-lazy.react-component'),
);

@observer
export class InternalTakeAssessmentCard extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        minCompletionTime: PropTypes.number.isRequired,
        maxCompletionTime: PropTypes.number.isRequired,
        equivalentNumberOfQuestions: PropTypes.number.isRequired,
        assessmentLinkDestination: PropTypes.string.isRequired,
        isBeta: PropTypes.bool,
        isPersonalPlan: PropTypes.bool,
        className: PropTypes.string,
        uiRegion: PropTypes.string,
        sourcePageType: PropTypes.string,
        sourcePageId: PropTypes.number,
        description: PropTypes.string,
        gettext: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
        onClickCallbackFunc: PropTypes.func,
    };

    static defaultProps = {
        isBeta: false,
        isPersonalPlan: false,
        className: '',
        uiRegion: null,
        sourcePageType: null,
        sourcePageId: null,
        description: '',
        onClickCallbackFunc: noop,
    };

    onClick = () => {
        const {id, uiRegion, sourcePageId, sourcePageType, onClickCallbackFunc} = this.props;
        onClickCallbackFunc();
        Tracker.publishEvent(
            new AssessmentClickEvent({
                componentName: 'takeAssessment',
                assessmentId: String(id),
                status: 'none',
                uiRegion,
                sourcePageType,
                sourcePageId,
            }),
        );
    };

    trackImpression = () => {
        const {id, uiRegion, sourcePageId, sourcePageType} = this.props;

        Tracker.publishEvent(
            new AssessmentPresentedEvent({
                assessmentId: String(id),
                status: 'none',
                uiRegion,
                sourcePageId,
                sourcePageType,
            }),
        );
    };

    render() {
        const {title, equivalentNumberOfQuestions, assessmentLinkDestination, isBeta} = this.props;
        // TODO: Need to add logic here to retrieve status of each assessment. Currently set to false as default. Update status prop of AssessmentClickEvent.
        const isCompleted = false;
        const isExpired = false;
        const isInProgress = false;

        let badgeType = '';
        if (isExpired) {
            badgeType = ASSESSMENT_BADGE_EXPIRED;
        } else if (isCompleted) {
            badgeType = ASSESSMENT_BADGE_COMPLETED;
        } else if (isInProgress) {
            badgeType = ASSESSMENT_BADGE_IN_PROGRESS;
        }

        const uniqueHeaderId = `${this.props.id}-header`;
        const card = (
            <div
                className={classNames(
                    this.props.className,
                    styles['take-assessment-card-container'],
                    {
                        [styles['take-assessment-card-container-pp']]: this.props.isPersonalPlan,
                    },
                )}
                data-purpose="take-assessment-card"
            >
                <AssessmentsIcon />
                <div className={styles['take-assessment-info']}>
                    <h3
                        className={classNames(
                            'ud-heading-md',
                            styles['take-assessment-card-info-title'],
                        )}
                    >
                        <span id={uniqueHeaderId} className="ud-sr-only">
                            {title}
                        </span>
                        <a
                            tabIndex={-1}
                            aria-hidden={true}
                            href={assessmentLinkDestination}
                            onClick={this.onClick}
                            data-purpose="title-link"
                        >
                            {title}
                        </a>
                    </h3>
                    <div>
                        <div className={styles['ud-assessment-badge-container']}>
                            {this.props.isPersonalPlan && (
                                <AssessmentStatusBadge badgeType={badgeType} />
                            )}
                            {isBeta && <AssessmentBetaBadge />}
                        </div>
                        <div className={styles['take-assessment-card-info-container']}>
                            <div
                                className={classNames(
                                    'ud-text-xs',
                                    styles['take-assessment-card-info-line'],
                                    styles['info-number-of-questions'],
                                )}
                            >
                                <ListAltIcon label={false} className={styles['info-icon']} />
                                <span className={styles['info-content']}>
                                    {ninterpolate(
                                        '~%(count)s question',
                                        '~%(count)s questions',
                                        equivalentNumberOfQuestions,
                                        {count: equivalentNumberOfQuestions},
                                        true,
                                    )}
                                </span>
                            </div>
                        </div>
                        <AssessmentCTA
                            text={gettext('Take assessment')}
                            onClick={this.onClick}
                            href={assessmentLinkDestination}
                            data-purpose="assessment-cta"
                            id={this.props.id}
                            ariaLabelledBy={[this.props.id, uniqueHeaderId].join(' ')}
                        />
                    </div>
                </div>
            </div>
        );

        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <div style={{position: 'relative'}}>
                    {card}
                    {!this.props.isPersonalPlan && (
                        <SuspenseUntilInView fallback={<Loader />}>
                            <AssessmentCardContextMenuLazy
                                id={this.props.id}
                                title={this.props.title}
                                url={this.props.assessmentLinkDestination}
                                description={this.props.description}
                            ></AssessmentCardContextMenuLazy>
                        </SuspenseUntilInView>
                    )}
                </div>
            </TrackImpression>
        );
    }
}

const TakeAssessmentCard = withI18n(InternalTakeAssessmentCard);
export default TakeAssessmentCard;
