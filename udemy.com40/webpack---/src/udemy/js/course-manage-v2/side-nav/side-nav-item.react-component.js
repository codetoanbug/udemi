import {Tracker} from '@udemy/event-tracking';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Link} from '@udemy/react-core-components';
import {NotificationBadge} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import {noop} from 'utils/noop';
import './side-nav.less';

const StudentsCounter = ({action, numInvitationRequests}) => {
    if (action === 'students' && numInvitationRequests > 0) {
        return (
            <span styleName="counter-container">
                <NotificationBadge
                    data-purpose="students-counter"
                    styleName="counter"
                    label={ninterpolate(
                        '%(count)s student invitation request',
                        '%(count)s student invitation requests',
                        numInvitationRequests,
                        {count: numInvitationRequests},
                    )}
                >
                    {numInvitationRequests}
                </NotificationBadge>
            </span>
        );
    }
    return null;
};

StudentsCounter.propTypes = {
    action: PropTypes.string.isRequired,
    numInvitationRequests: PropTypes.number,
};

StudentsCounter.defaultProps = {
    numInvitationRequests: null,
};

@withRouter
export default class SideNavItem extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onNavClick: PropTypes.func,
        numInvitationRequests: PropTypes.number,
        withCompletion: PropTypes.bool.isRequired,
        courseId: PropTypes.number.isRequired,
    };

    static defaultProps = {
        onNavClick: noop,
        numInvitationRequests: null,
    };

    isActive(itemUrl) {
        return this.props.location.pathname.startsWith(itemUrl);
    }

    @autobind
    clickLink() {
        this.props.onNavClick();
        const {withCompletion, item, courseId} = this.props;
        if (!withCompletion || !item.action || item.completed === undefined) {
            return;
        }
        const action = item.subaction ? `${item.action}-${item.subaction}` : item.action;
        Tracker.publishEvent(
            new CourseManageActionEvent({
                courseId,
                category: action,
                action: 'click',
                objectType: 'course',
                objectId: courseId,
            }),
        );
    }

    render() {
        const {item, numInvitationRequests, withCompletion} = this.props;
        return (
            <li styleName={classNames('nav-item', {'nav-item-active': this.isActive(item.url)})}>
                <Link
                    className="ud-link-neutral"
                    styleName="nav-item-link"
                    data-purpose={`react-nav-link-${item.action}`}
                    to={item.url}
                    onClick={this.clickLink}
                >
                    {withCompletion && (
                        <span
                            styleName="completion"
                            aria-label={
                                item.completed ? gettext('Completed') : gettext('Incomplete')
                            }
                        >
                            {item.completed && <TickIcon label={false} size="xsmall" />}
                        </span>
                    )}
                    <span>{item.title}</span>
                    <StudentsCounter
                        action={item.action}
                        numInvitationRequests={numInvitationRequests}
                    />
                </Link>
            </li>
        );
    }
}
