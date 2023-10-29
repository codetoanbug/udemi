import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {withUDData} from '@udemy/ud-data';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {AssessmentClickEvent} from 'assessments/events';
import {GetStartedCard} from 'browse/components/get-started-card/get-started-card.react-component';
import {noop} from 'utils/noop';

import AssessmentActiveCard from './assessment-active-card.react-component';
import AssessmentResultsCard from './assessment-results-card.react-component';
import handImage from './hand-write.png';

import './assessment-card.less';

@observer
class AssessmentCard extends Component {
    static propTypes = {
        assessment: PropTypes.oneOfType([
            PropTypes.shape({
                type: PropTypes.oneOf(['inProgress']),
                ...AssessmentActiveCard.propTypes,
            }),
            PropTypes.shape({
                type: PropTypes.oneOf(['completed']),
                ...AssessmentResultsCard.propTypes,
            }),
            PropTypes.shape({
                type: PropTypes.oneOf(['getStarted']),
            }),
        ]),
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        isPersonalPlan: PropTypes.bool,
        className: PropTypes.string,
        udData: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
        onClickCallbackFunc: PropTypes.func,
    };

    static defaultProps = {
        assessment: null,
        size: 'large',
        isPersonalPlan: false,
        className: undefined,
        onClickCallbackFunc: noop,
    };

    @autobind
    onGetStartedCardClick() {
        this.props.onClickCallbackFunc();
        Tracker.publishEvent(
            new AssessmentClickEvent({
                componentName: 'getStarted',
            }),
        );
    }

    renderChild(type, assessmentProps) {
        const {Config} = this.props.udData;
        const {size, gettext} = this.props;

        if (type === 'getStarted') {
            return (
                <GetStartedCard
                    cta={gettext('Explore Assessments')}
                    text={
                        Config.brand.has_organization
                            ? gettext(
                                  'Take an assessment and get content recommendations to hone in on your learning needs.',
                              )
                            : gettext('Test your skills with an assessment.')
                    }
                    title={gettext('Evaluate your skills')}
                    link={'/skills-assessment/'}
                    size={size}
                    icon={
                        <Image
                            alt={gettext('Hand writing')}
                            src={handImage}
                            width={120}
                            height={90}
                        />
                    }
                    styleName="get-started-card"
                    onCardClick={() => this.onGetStartedCardClick()}
                />
            );
        }
        if (type === 'inProgress') {
            return (
                <AssessmentActiveCard
                    isPersonalPlan={this.props.isPersonalPlan}
                    assessmentType={'progress'}
                    {...assessmentProps}
                    onClickCallbackFunc={this.props.onClickCallbackFunc}
                />
            );
        }
        return (
            <AssessmentResultsCard
                isPersonalPlan={this.props.isPersonalPlan}
                assessmentType={'completed'}
                {...assessmentProps}
                onClickCallbackFunc={this.props.onClickCallbackFunc}
            />
        );
    }

    render() {
        const {size, assessment} = this.props;
        const {type, ...originalAssessmentProps} = assessment;

        const assessmentProps = {size, ...originalAssessmentProps};

        return (
            <div
                className={this.props.className}
                styleName={classNames('card-container', {
                    'card-container-large': size === 'large' && !this.props.isPersonalPlan,
                    'card-container-medium': size === 'medium' && !this.props.isPersonalPlan,
                    'card-container-pp': this.props.isPersonalPlan,
                })}
            >
                {this.renderChild(type, assessmentProps)}
            </div>
        );
    }
}

export default withI18n(withUDData(AssessmentCard));
