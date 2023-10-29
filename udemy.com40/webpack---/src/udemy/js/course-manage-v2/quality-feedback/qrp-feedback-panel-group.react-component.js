import {Accordion} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import QRPFeedbackPanel from './qrp-feedback-panel.react-component';
import './qrp-feedback-panel-group.less';

@observer
export default class QRPFeedbackPanelGroup extends React.Component {
    static propTypes = {
        qualityFeedbackStore: PropTypes.object.isRequired,
        feedbacks: PropTypes.array.isRequired,
        rating: PropTypes.oneOf(['needs_fix', 'acceptable', 'exceptional']).isRequired,
    };

    renderNeedsFixHeading() {
        const unresolvedCount = this.props.qualityFeedbackStore.unresolvedNeedsFixFeedbacksCount;
        let subtitle;
        if (unresolvedCount > 0) {
            subtitle = ninterpolate(
                'You have %(count)s item to be addressed afterwhich you can resubmit your course for review.',
                'You have %(count)s items to be addressed afterwhich you can resubmit your course for review.',
                unresolvedCount,
                {count: unresolvedCount},
            );
        } else if (this.props.qualityFeedbackStore.review.status === 'needs_fixes') {
            subtitle = gettext(
                'You have addressed all items. You can resubmit your course for review at the bottom of this page.',
            );
        } else {
            subtitle = gettext('You have addressed all items. Nicely done.');
        }
        return (
            <div>
                <h3 className="ud-heading-md" styleName="panel-group-title">
                    {gettext('Required fixes:')}
                </h3>
                {subtitle && <p styleName="panel-group-subtitle">{subtitle}</p>}
            </div>
        );
    }

    renderAcceptableHeading() {
        const unresolvedCount = this.props.qualityFeedbackStore.unresolvedAcceptableFeedbacksCount;
        let subtitle;
        if (unresolvedCount > 0) {
            subtitle = ninterpolate(
                'You have %(count)s item that could be improved to increase your students’ engagement and conversion rates.',
                'You have %(count)s items that could be improved to increase your students’ engagement and conversion rates.',
                unresolvedCount,
                {count: unresolvedCount},
            );
        } else if (this.props.feedbacks.length > 0) {
            subtitle = gettext('You have addressed all items. Nicely done.');
        } else {
            subtitle = gettext(
                'We don’t have any recommended improvements at this time. Nicely done.',
            );
        }
        return (
            <div>
                <h3 className="ud-heading-md" styleName="panel-group-title">
                    {gettext('Recommended improvements:')}
                </h3>
                {subtitle && <p styleName="panel-group-subtitle">{subtitle}</p>}
            </div>
        );
    }

    renderExceptionalHeading() {
        return (
            <div>
                <h3 className="ud-heading-md" styleName="panel-group-title">
                    {gettext('Completed items:')}
                </h3>
            </div>
        );
    }

    render() {
        const {rating, feedbacks, qualityFeedbackStore} = this.props;
        return (
            <div
                styleName={classNames('panel-group', {
                    'needs-fix': rating === 'needs_fix',
                    acceptable: rating === 'acceptable',
                    exceptional: rating === 'exceptional',
                })}
            >
                {rating === 'needs_fix' && feedbacks.length > 0 && this.renderNeedsFixHeading()}
                {rating === 'acceptable' &&
                    qualityFeedbackStore.review.status !== 'submitted_for_review' &&
                    qualityFeedbackStore.review.status !== 'draft' &&
                    this.renderAcceptableHeading()}
                {rating === 'exceptional' &&
                    feedbacks.length > 0 &&
                    this.renderExceptionalHeading()}
                <Accordion>
                    {feedbacks.map((feedback) => (
                        <QRPFeedbackPanel
                            key={feedback.id}
                            feedback={feedback}
                            qualityFeedbackStore={qualityFeedbackStore}
                        />
                    ))}
                </Accordion>
            </div>
        );
    }
}
