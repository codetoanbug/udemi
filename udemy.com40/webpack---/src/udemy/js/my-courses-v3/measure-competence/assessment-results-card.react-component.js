import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import FlakyIcon from '@udemy/icons/dist/flaky.ud-icon';
import TodayIcon from '@udemy/icons/dist/today.ud-icon';
import {withUDData} from '@udemy/ud-data';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {AssessmentClickEvent} from 'assessments/events';
import {AssessmentStatusBadge} from 'browse/components/badge/assessment-status-badge.react-component';
import {
    ASSESSMENT_BADGE_EXPIRED,
    ASSESSMENT_BADGE_COMPLETED,
    ASSESSMENT_BADGE_IN_PROGRESS,
} from 'browse/components/badge/constants';
import {isContextMenuAvailable} from 'organization-common/resource-context-menu/helpers';
import {noop} from 'utils/noop';

import './assessment-results-card.less';
import {AssessmentAssignmentBadge} from './assessment-card-components/assessment-assignment-badge.react-component';
import {AssessmentBetaBadge} from './assessment-card-components/assessment-beta-badge.react-component';
import {AssessmentCTA} from './assessment-card-components/assessment-cta.react-component';
import {AssessmentsIcon} from './assessment-card-components/assessment-icon.react-component';

@inject('resourceContextMenu')
@observer
class AssessmentResultsCard extends Component {
    static propTypes = {
        groupId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        dateCompleted: PropTypes.string.isRequired,
        assessmentLinkDestination: PropTypes.string.isRequired,
        testletId: PropTypes.number.isRequired,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        resourceContextMenu: PropTypes.object,
        scaleScore: PropTypes.number,
        scalePercentile: PropTypes.number,
        isBeta: PropTypes.bool,
        isAssigned: PropTypes.bool,
        assignDueDate: PropTypes.string,
        isPersonalPlan: PropTypes.bool,
        assessmentType: PropTypes.string,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
        onClickCallbackFunc: PropTypes.func,
    };

    static defaultProps = {
        size: 'small',
        resourceContextMenu: {},
        scaleScore: null,
        scalePercentile: null,
        isBeta: false,
        isAssigned: false,
        assignDueDate: null,
        isPersonalPlan: false,
        assessmentType: '',
        onClickCallbackFunc: noop,
    };

    @autobind
    onClickCard() {
        this.props.onClickCallbackFunc();
        Tracker.publishEvent(
            new AssessmentClickEvent({
                componentName: 'seeResults',
                assessmentId: String(this.props.groupId),
            }),
        );
    }

    @computed
    get showAssessmentCalibrationResultsText() {
        const {scaleScore} = this.props;
        return scaleScore !== null;
    }

    get learnerLevelText() {
        const {scaleScore, gettext, interpolate} = this.props;
        if (scaleScore >= 150) {
            return interpolate(gettext('Level: Superior (%(scaleScore)s)'), {scaleScore}, true);
        } else if (scaleScore >= 100) {
            return interpolate(gettext('Level: Established (%(scaleScore)s)'), {scaleScore}, true);
        } else if (scaleScore >= 50) {
            return interpolate(gettext('Level: Developing (%(scaleScore)s)'), {scaleScore}, true);
        }
        return interpolate(gettext('Level: Limited (%(scaleScore)s)'), {scaleScore}, true);
    }

    renderCardInfo() {
        const {request} = this.props.udData;
        const {
            title,
            size,
            dateCompleted,
            isBeta,
            isAssigned,
            assignDueDate,
            assessmentLinkDestination,
            gettext,
            interpolate,
        } = this.props;

        const userLocale = request.locale.replace('_', '-') || 'en-US';
        const completed = new Date(dateCompleted).toLocaleDateString(userLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const large = size === 'large';

        /*
        TODO: Need to add logic here to retrieve status of each assessment. Currently set to false as default.
        */
        const isCompleted = false;
        const isExpired = false;
        const isInProgress = false;

        let badgeType = this.props.assessmentType;
        if (isExpired) {
            badgeType = ASSESSMENT_BADGE_EXPIRED;
        } else if (isCompleted) {
            badgeType = ASSESSMENT_BADGE_COMPLETED;
        } else if (isInProgress) {
            badgeType = ASSESSMENT_BADGE_IN_PROGRESS;
        }

        const hasAnyBadge = isBeta || this.props.isPersonalPlan;

        return (
            <div className="ud-assessment-card-info">
                <h3
                    className={classNames(
                        hasAnyBadge
                            ? 'ud-assessment-card-info-title-with-badge'
                            : 'ud-assessment-card-info-title',
                        large ? 'ud-heading-md' : 'ud-heading-sm',
                    )}
                >
                    <a
                        href={assessmentLinkDestination}
                        onClick={this.onClickCard}
                        data-purpose="title-link"
                    >
                        {title}
                    </a>
                </h3>
                <div>
                    <div className="ud-assessment-badge-container">
                        {this.props.isPersonalPlan && (
                            <AssessmentStatusBadge badgeType={badgeType} />
                        )}
                        {isBeta && <AssessmentBetaBadge />}
                        {isAssigned && <AssessmentAssignmentBadge dueDate={assignDueDate} />}
                    </div>

                    {(large || this.props.isPersonalPlan) && (
                        <div className="ud-assessment-card-info-container">
                            <div
                                className={classNames('ud-text-xs', 'ud-assessment-card-info-line')}
                            >
                                <TodayIcon label={false} className="ud-assessment-card-info-icon" />
                                <span className="ud-assessment-card-info-content">
                                    {interpolate(
                                        gettext('Completed %(dateCompleted)s'),
                                        {dateCompleted: completed},
                                        true,
                                    )}
                                </span>
                            </div>

                            {this.showAssessmentCalibrationResultsText && (
                                <div
                                    className={classNames(
                                        'ud-text-xs',
                                        'ud-assessment-card-info-line',
                                    )}
                                    styleName="info-correct-percentage"
                                >
                                    <FlakyIcon
                                        label={false}
                                        className="ud-assessment-card-info-icon"
                                    />
                                    <span className="ud-assessment-card-info-content">
                                        {this.learnerLevelText}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="ud-assessment-card-cta-container">
                        <AssessmentCTA
                            text={gettext('View most recent results')}
                            href={assessmentLinkDestination}
                            onClick={this.onClickCard}
                            data-purpose="assessment-cta"
                        />{' '}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {me, Config} = this.props.udData;
        const {resourceContextMenu} = this.props;

        const card = (
            <div className="ud-assessment-card-container">
                <AssessmentsIcon isCompleted={true} />
                {this.renderCardInfo()}
            </div>
        );

        return (
            <div style={{position: 'relative'}}>
                {card}
                {isContextMenuAvailable({me, Config}) && (
                    <div styleName="more-menu-button">
                        {resourceContextMenu.getActiveAssessmentCardContextMenu({
                            id: this.props.groupId,
                            title: this.props.title,
                            url: this.props.assessmentLinkDestination,
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default withI18n(withUDData(AssessmentResultsCard));
