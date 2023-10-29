import {LocalizedHtml} from '@udemy/i18n';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './goals-form.less';

import getConfigData from 'utils/get-config-data';

import {
    QUESTION_LABEL,
    MIN_WHAT_YOU_WILL_LEARN_COUNT,
    MAX_WHAT_YOU_WILL_LEARN_CHAR_COUNT,
} from './constants';
import GoalsFormQuestion from './goals-form-question.react-component';

const udConfig = getConfigData();
const isUFB = udConfig.brand.has_organization;

@inject('store')
@observer
export default class GoalsForm extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    getRequirementsExplanation() {
        return (
            <p>
                {gettext(
                    'List the required skills, experience, tools or equipment learners should have prior to taking your course.',
                )}
                <br />
                {gettext(
                    'If there are no requirements, use this space as an opportunity to lower the barrier for beginners.',
                )}
            </p>
        );
    }

    getWhatYouWillLearnExplanation() {
        return (
            <p>
                <LocalizedHtml
                    html={
                        isUFB
                            ? gettext(
                                  'You should enter <a class="link" ' +
                                      '>learning objectives or outcomes</a> that learners can expect to achieve after completing your course.',
                              )
                            : gettext(
                                  'You must enter at least 4 <a class="link" ' +
                                      '>learning objectives or outcomes</a> that learners can expect to achieve after completing your course.',
                              )
                    }
                    interpolate={{
                        link: (
                            <a
                                className="ud-link-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/udemy-teach-hub/learning_objectives/"
                            />
                        ),
                    }}
                />
            </p>
        );
    }

    getWhoShouldAttendExplanation() {
        return (
            <p>
                <LocalizedHtml
                    html={gettext(
                        'Write a clear description of the <a class="link"' +
                            '>intended learners</a> for your course who will find your course content valuable. <br />' +
                            'This will help you attract the right learners to your course.',
                    )}
                    interpolate={{
                        link: (
                            <a
                                className="ud-link-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/udemy-teach-hub/define_your_audience_and_objectives/"
                            />
                        ),
                    }}
                />
            </p>
        );
    }

    _renderRequirements() {
        const label = QUESTION_LABEL.REQUIREMENTS;
        const placeholders = [
            gettext(
                'Example: No programming experience needed. You will learn everything you need to know',
            ),
        ];
        return (
            <GoalsFormQuestion
                questionId="requirements"
                label={label}
                explanation={this.getRequirementsExplanation()}
                placeholders={placeholders}
                shouldSendPerfMetric={true}
                question={this.props.store.requirements}
                store={this.props.store}
                errors={this.props.store.errors.requirements_data}
            />
        );
    }

    _renderWhoShouldAttend() {
        const label = QUESTION_LABEL.WHO_SHOULD_ATTEND;
        const placeholders = [
            gettext('Example: Beginner Python developers curious about data science'),
        ];
        return (
            <GoalsFormQuestion
                questionId="target-student"
                label={label}
                explanation={this.getWhoShouldAttendExplanation()}
                placeholders={placeholders}
                question={this.props.store.whoShouldAttend}
                store={this.props.store}
                errors={this.props.store.errors.who_should_attend_data}
            />
        );
    }

    _renderWhatYouWillLearn() {
        const label = QUESTION_LABEL.WHAT_YOU_WILL_LEARN;
        const placeholders = [
            gettext('Example: Define the roles and responsibilities of a project manager'),
            gettext('Example: Estimate project timelines and budgets'),
            gettext('Example: Identify and manage project risks'),
            gettext(
                'Example: Complete a case study to manage a project from conception to completion',
            ),
        ];
        return (
            <GoalsFormQuestion
                questionId="learn-goal"
                label={label}
                explanation={this.getWhatYouWillLearnExplanation()}
                placeholders={placeholders}
                question={this.props.store.whatYouWillLearn}
                store={this.props.store}
                errors={this.props.store.errors.what_you_will_learn_data}
                deleteButtonDisabled={
                    !isUFB &&
                    this.props.store.whatYouWillLearn.answerCount <= MIN_WHAT_YOU_WILL_LEARN_COUNT
                }
                maxLength={MAX_WHAT_YOU_WILL_LEARN_CHAR_COUNT}
                withCounter={true}
            />
        );
    }

    _renderSubtitle() {
        return (
            <p styleName="subtitle">
                <LocalizedHtml
                    html={gettext(
                        'The following descriptions will be publicly visible on your <a class="link" ' +
                            '>Course Landing Page</a> and will have a direct impact on your course performance. ' +
                            'These descriptions will help learners decide if your course is right for them.',
                    )}
                    interpolate={{
                        link: (
                            <a
                                className="ud-link-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="/udemy-teach-hub/create_your_course_landing_page/"
                            />
                        ),
                    }}
                />
            </p>
        );
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.store.saveLists();
    }

    render() {
        return (
            <>
                {this._renderSubtitle()}
                <form onSubmit={this.onSubmit}>
                    {this._renderWhatYouWillLearn()}
                    {this._renderRequirements()}
                    {this._renderWhoShouldAttend()}
                </form>
            </>
        );
    }
}
