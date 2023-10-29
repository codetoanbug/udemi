import {NotificationBadge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import LabsStore from 'instructor/labs/labs.mobx-store';
import {ALL_INSTRUCTOR_LAB_ACCESS_LEVELS} from 'labs/constants';
import {checkUserLabAccessLevel} from 'labs/utils';
import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';

import SecondaryMenuItem from './secondary-menu-item.react-component';

import './side-nav.less';

@withRouter
@observer
export default class SecondaryMenuLabs extends Component {
    static propTypes = {
        useHttpLinks: PropTypes.bool,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
        }).isRequired,
        labsStore: PropTypes.instanceOf(LabsStore),
    };

    static defaultProps = {
        useHttpLinks: false,
        labsStore: null,
    };

    getActiveClass(url) {
        const location = this.props.location.pathname;
        return classNames('subnav-button', {active: location.startsWith(url)});
    }

    render() {
        const {useHttpLinks, labsStore} = this.props;
        const primaryResource = 'labs';
        const basePath = `/${primaryResource}`;

        const isReportIssuesExperimentEnabled = getVariantValueFromUdRequest(
            'lab_taking',
            'reported_issues_instructor_panel_enabled',
            false,
        );

        const isInstructorLabAccessLevel = checkUserLabAccessLevel(
            ALL_INSTRUCTOR_LAB_ACCESS_LEVELS,
        );

        return (
            <ul className="ud-unstyled-list" styleName="menu secondary-menu">
                <SecondaryMenuItem
                    useHttpLinks={useHttpLinks}
                    to={`${basePath}/modular/`}
                    resource="labs"
                    primaryResource={primaryResource}
                    text={gettext('Labs')}
                    styleName={this.getActiveClass('/labs/modular')}
                />
                <SecondaryMenuItem
                    useHttpLinks={useHttpLinks}
                    to={`${basePath}/workspaces/`}
                    resource="workspaces"
                    primaryResource={primaryResource}
                    text={gettext('Workspaces')}
                    styleName={this.getActiveClass('/labs/workspaces')}
                />
                {isReportIssuesExperimentEnabled && isInstructorLabAccessLevel && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to={`${basePath}/reported-issues/`}
                        resource="reported-issues"
                        primaryResource={primaryResource}
                        text={gettext('Reported issues')}
                        styleName={this.getActiveClass('/labs/reported-issues')}
                    >
                        <NotificationBadge
                            label={ninterpolate(
                                '%(count)s unread reported issue',
                                '%(count)s unread reported issues',
                                labsStore?.numUnreadReports,
                                {count: labsStore?.numUnreadReports},
                            )}
                            styleName="secondary-menu-badge"
                        >
                            {labsStore?.numUnreadReports}
                        </NotificationBadge>
                    </SecondaryMenuItem>
                )}
            </ul>
        );
    }
}
