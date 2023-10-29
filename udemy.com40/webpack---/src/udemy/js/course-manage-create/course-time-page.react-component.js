import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SurveyQuestion from 'survey/survey-question.react-component';

import './create-course-flow.less';

@observer
export default class CourseTimePage extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        if (!this.props.store.surveyLoaded) {
            this.props.store.loadSurvey();
        }
    }

    headerText = gettext('How much time can you spend creating your course per week?');
    subHeadText = gettext(
        "There's no wrong answer. We can help you achieve your goals even if you don't have much time.",
    );

    render() {
        const {surveyLoaded, relatedSurveyQuestion, surveyStore} = this.props.store;
        return (
            <div>
                <h1
                    className="ud-heading-serif-xl"
                    styleName="header-text"
                    data-purpose="header-text"
                >
                    {this.headerText}
                </h1>
                <p styleName="subhead-text" data-purpose="subhead-text">
                    {this.subHeadText}
                </p>
                {surveyLoaded && (
                    <form styleName="response-form">
                        <SurveyQuestion
                            key={relatedSurveyQuestion.id}
                            question={relatedSurveyQuestion}
                            surveyStore={surveyStore}
                            formGroupProps={{labelProps: {className: 'ud-sr-only'}}}
                        />
                    </form>
                )}
            </div>
        );
    }
}
