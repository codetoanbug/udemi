import {AlertBanner} from '@udemy/react-messaging-components';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import udLink from 'utils/ud-link';

import requires from '../../../registry/requires';
import './question-list-warning.less';

@requires('questionAnswerStore')
export default class QuestionListWarning extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.object.isRequired,
    };

    get featureDisabledWarning() {
        if (!this.props.questionAnswerStore.areNewQuestionsDisabled) {
            return null;
        }
        const message = interpolate(
            gettext(
                'Your access to the Q&A feature is temporarily suspended. ' +
                    'Please contact <a href="%(supportLink)s">support</a> for more information.',
            ),
            {supportLink: udLink.toSupportContact()},
            true,
        );
        return (
            <AlertBanner
                styleName="alert-banner"
                udStyle="warning"
                title={gettext('Trust & Safety Alert')}
                body={
                    <p
                        className="ud-text-with-links"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'question-list-warning:message',
                            html: message,
                        })}
                    />
                }
                showCta={false}
            />
        );
    }

    get termsBannedWarning() {
        if (!this.props.questionAnswerStore.isInstructorInactive) {
            return null;
        }
        return (
            <AlertBanner
                styleName="alert-banner"
                udStyle="warning"
                title={gettext('Warning')}
                body={gettext(
                    'The instructor for this course is no longer active on Udemy, but we ' +
                        'encourage you to still post new questions as other students can also ' +
                        'provide helpful answers.',
                )}
                showCta={false}
            />
        );
    }

    render() {
        return (
            <>
                {this.featureDisabledWarning}
                {this.termsBannedWarning}
            </>
        );
    }
}
