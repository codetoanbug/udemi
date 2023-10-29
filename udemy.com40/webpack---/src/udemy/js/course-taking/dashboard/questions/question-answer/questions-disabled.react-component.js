import PropTypes from 'prop-types';
import React from 'react';

import {TRIAL_MESSAGES} from 'organization-trial/constants';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import requires from '../../../registry/requires';

import './questions-disabled.less';

@requires('courseTakingStore')
export default class QuestionsDisabled extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            isLimitedConsumptionTrial: PropTypes.bool,
            course: PropTypes.shape({
                isOwnedByInstructorTeam: PropTypes.bool,
            }),
        }).isRequired,
    };

    render() {
        let reason;
        if (this.props.courseTakingStore.isLimitedConsumptionTrial) {
            reason = TRIAL_MESSAGES.CONTENT_LOCKED;
        } else if (this.props.courseTakingStore.course.isOwnedByInstructorTeam) {
            reason = interpolate(
                gettext(
                    'Q&A feature has been disabled. For questions or concerns please contact %(supportLink)s',
                ),
                {
                    supportLink:
                        '<a href="mailto:instructorsupport@udemy.com">instructorsupport@udemy.com</a>',
                },
                true,
            );
        } else {
            reason = gettext('Questions are currently disabled for this course.');
        }
        return (
            <div
                styleName="reason"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'questions-disabled:reason',
                    html: reason,
                })}
            />
        );
    }
}
