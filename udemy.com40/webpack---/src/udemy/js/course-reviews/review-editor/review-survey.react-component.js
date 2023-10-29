import {getUniqueId} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RadioButton from 'survey/radio-button.react-component';
import SurveyStore from 'survey/survey.mobx-store';
import './review-editor.less';

@observer
export default class ReviewSurvey extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.surveyStore = new SurveyStore('review-survey', this.props.store.course.id, null);
        this.id = getUniqueId('review-survey');
    }

    async componentDidMount() {
        await this.surveyStore.getSurvey();
        this.surveyStore.setUserAnswers({});
        this.surveyStore.getUserAnswers();
    }

    @autobind
    onSaveClick() {
        this.surveyStore.saveUserAnswers();
        this.props.store.goForward();
    }

    renderQuestion(questionSet, question) {
        // We don't use SurveyQuestion because we would need a lot of style overrides to display
        // question and answers side-by-side on wide screens.
        const id = `${this.id}-${questionSet.id}-${question.id}`;
        const onChange = (event) => {
            this.surveyStore.updateUserAnswer(question.id, parseInt(event.target.value, 10));
        };
        return (
            <div key={id} role="group" aria-labelledby={id} styleName="survey-form-group">
                <div id={id} className="ud-heading-sm" styleName="survey-question-text">
                    {/* eslint-disable-next-line gettext/no-variable-string */}
                    {gettext(question.text)}
                </div>
                <div styleName="survey-radio-buttons">
                    {question.answer_options.map((answerOption) => (
                        <RadioButton
                            key={answerOption.id}
                            name={`${id}-answers`}
                            value={answerOption.id}
                            checked={answerOption.id === this.surveyStore.userAnswers[question.id]}
                            onChange={onChange}
                        >
                            {/* eslint-disable-next-line gettext/no-variable-string */}
                            {gettext(answerOption.text)}
                        </RadioButton>
                    ))}
                </div>
            </div>
        );
    }

    render() {
        const {store} = this.props;
        return (
            <div>
                {this.surveyStore.isLoaded ? (
                    <form>
                        {this.surveyStore.questionSets.map((questionSet) => {
                            return questionSet.questions.map((question) => {
                                return this.renderQuestion(questionSet, question);
                            });
                        })}
                    </form>
                ) : (
                    <div styleName="survey-loading">
                        <MainContentLoader />
                    </div>
                )}
                <FooterButtons>
                    <Button udStyle="ghost" data-purpose="skip-button" onClick={store.goForward}>
                        {gettext('Skip')}
                    </Button>
                    <Button data-purpose="save-button" onClick={this.onSaveClick}>
                        {gettext('Save and Continue')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
