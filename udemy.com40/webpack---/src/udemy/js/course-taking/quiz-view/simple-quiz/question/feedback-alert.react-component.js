import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import unescapeHtml from 'utils/escape/unescape-html';

import './feedback-alert.less';

@inject('simpleQuizStore')
@observer
export default class FeedbackAlert extends Component {
    static propTypes = {
        simpleQuizStore: PropTypes.object.isRequired,
    };

    render() {
        const checkedAnswer = this.props.simpleQuizStore.checkedAnswer;
        if (!checkedAnswer) {
            return null;
        }

        const feedback = unescapeHtml(checkedAnswer.feedback);
        if (this.props.simpleQuizStore.isRevisitingQuestionPage) {
            if (feedback) {
                return <AlertBanner showCta={false} title={feedback} styleName="alert-banner" />;
            }
        } else if (checkedAnswer.isCorrect) {
            return (
                <AlertBanner
                    udStyle="success"
                    showCta={false}
                    title={gettext('Good job!')}
                    body={feedback}
                    styleName="alert-banner"
                />
            );
        } else {
            return (
                <AlertBanner
                    udStyle="error"
                    showCta={false}
                    title={gettext('Incorrect answer. Please try again.')}
                    body={feedback}
                    styleName="alert-banner"
                />
            );
        }

        return null;
    }
}
