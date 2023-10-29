import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Avatar} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udMe from 'utils/ud-me';

import './instructor.less';

export default class Instructor extends Component {
    static propTypes = {
        instructorBio: PropTypes.shape({
            isComplete: PropTypes.bool.isRequired,
            has_valid_description: PropTypes.bool.isRequired,
            hasImage: PropTypes.bool.isRequired,
            user: PropTypes.shape({
                url: PropTypes.string.isRequired,
                display_name: PropTypes.string.isRequired,
            }),
        }).isRequired,
        minSummaryWords: PropTypes.number.isRequired,
    };

    renderSelfCompleteStatus() {
        return (
            <div styleName="instructor-status">
                <a className="ud-link-underline" href="/user/edit-profile/">
                    {gettext('View your instructor profile')}
                </a>
            </div>
        );
    }

    renderIncompleteStatus(body) {
        return (
            <AlertBanner
                showIcon={false}
                showCta={false}
                udStyle="error"
                styleName="instructor-status"
                title={gettext('Incomplete')}
                body={body}
            />
        );
    }

    renderSelfIncompleteStatus() {
        return this.renderIncompleteStatus(
            <ul className="ud-unstyled-list">
                {!this.props.instructorBio.has_valid_description && (
                    <li>
                        {interpolate(
                            gettext(
                                'Your instructor biography must have at least %(minSummaryWords)s words.',
                            ),
                            {minSummaryWords: this.props.minSummaryWords},
                            true,
                        )}
                    </li>
                )}
                {!this.props.instructorBio.hasImage && (
                    <li>{gettext('Your instructor image is required.')}</li>
                )}
                <li>
                    <a className="ud-link-underline" href="/user/edit-profile/" target="_blank">
                        {gettext('Update your profile.')}
                    </a>
                </li>
            </ul>,
        );
    }

    renderPeerIncompleteStatus() {
        return this.renderIncompleteStatus(
            <ul className="ud-unstyled-list">
                <li>
                    {interpolate(
                        gettext(
                            'Your co-instructor %(instructorName)s has not completed the ' +
                                'instructor profile. Ask %(instructorName)s to update.',
                        ),
                        {instructorName: this.props.instructorBio.user.display_name},
                        true,
                    )}
                </li>
            </ul>,
        );
    }

    render() {
        const {instructorBio} = this.props;

        let icon, status;
        const isSelf = udMe.id === instructorBio.user.id;
        if (instructorBio.isComplete) {
            icon = <SuccessIcon label={gettext('Completed')} color="positive" />;
            status = isSelf ? this.renderSelfCompleteStatus() : null;
        } else {
            icon = <WarningIcon label={gettext('Incomplete')} color="negative" />;
            status = isSelf ? this.renderSelfIncompleteStatus() : this.renderPeerIncompleteStatus();
        }

        return (
            <div styleName="instructor">
                <a href={instructorBio.user.url} styleName="instructor-profile">
                    {icon}
                    <Avatar
                        user={instructorBio.user}
                        alt="NONE"
                        size="medium"
                        srcKey="image_50x50"
                    />
                    {instructorBio.user.display_name}
                </a>
                {status}
            </div>
        );
    }
}
