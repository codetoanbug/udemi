import {Tracker} from '@udemy/event-tracking';
import {Button, Link} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {InstructorMenuActionEvent, PerformanceCourseEngagementClickEvent} from 'instructor/events';

import {BASE_INSTRUCTOR_APP_URL, PERFORMANCE_MENU_ITEM_TYPES} from './constants';

@observer
export default class SecondaryMenuItem extends Component {
    static propTypes = {
        to: PropTypes.string.isRequired,
        resource: PropTypes.string.isRequired,
        primaryResource: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        children: PropTypes.node,
        useHttpLinks: PropTypes.bool,
        renderMenuItem: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        useHttpLinks: false,
        renderMenuItem: (menuItem) => menuItem,
    };

    @autobind
    onClick() {
        Tracker.publishEvent(
            new InstructorMenuActionEvent({
                selection: `secondary.${this.props.primaryResource}.${this.props.resource}`,
                action: 'click',
            }),
        );
        if (this.props.resource === PERFORMANCE_MENU_ITEM_TYPES.engagement) {
            Tracker.publishEvent(new PerformanceCourseEngagementClickEvent());
        }
    }

    render() {
        const {useHttpLinks, to, className, text, children, renderMenuItem} = this.props;
        return (
            <li>
                {renderMenuItem(
                    <Button
                        udStyle="link"
                        typography="ud-text-md"
                        componentClass={useHttpLinks ? 'a' : Link}
                        href={useHttpLinks ? `${BASE_INSTRUCTOR_APP_URL}${to}` : null}
                        to={useHttpLinks ? null : to}
                        onClick={this.onClick}
                        className={className}
                    >
                        {text}
                        {children}
                    </Button>,
                )}
            </li>
        );
    }
}
