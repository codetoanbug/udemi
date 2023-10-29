import {Button, Link} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Badge} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer, Provider} from 'mobx-react';
import React from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';
import {SimpleIAResponsiveHeader} from 'instructor/layout/ia-responsive-header.react-component';
import {ADMIN_LAB_ACCESS_LEVELS, LAB_TYPE, USER_TYPES} from 'labs/constants';
import LabLauncher from 'labs/lab-launcher/lab-launcher.react-component';
import Lab from 'labs/lab.mobx-model';
import {LabVerticalSystemEventStore} from 'labs/system-event/lab-vertical-system-event.mobx-store';
import {checkUserLabAccessLevel} from 'labs/utils';

import {trackClick} from '../common/labs-tracking';
import {NEW_DEV_WORKSPACE_EVENT, NEW_IN_COURSE_WORKSPACE_EVENT} from './constants';
import InstructorLabActions from './instructor-lab-actions.react-component';
import LabWorkspaceEditorStore from './lab-workspace-editor.mobx-store';
import LabWorkspaceEditor from './lab-workspace-editor.react-component';
import {InstructorLabListingProps} from './types';

import './labs.less';

@inject('labsStore')
@observer
export class LabsWorkspace extends React.Component<InstructorLabListingProps> {
    async componentDidMount() {
        await this.props.labsStore.loadLabs();
        await this.loadMessages();
    }

    labWorkspaceEditorStore = new LabWorkspaceEditorStore();
    labVerticalSystemEventStore = new LabVerticalSystemEventStore();

    async loadMessages() {
        this.props.labsStore.labs.map(async (lab) => {
            await this.labVerticalSystemEventStore.loadMessages(lab.vertical, lab.id);
        });
    }

    @autobind
    onNewDevWorkspaceClick() {
        trackClick(NEW_DEV_WORKSPACE_EVENT);
        this.props.labsStore
            .createLab(LAB_TYPE.dev_workspace.key)
            .then((labId) => this.labWorkspaceEditorStore.openModalForLab(labId));
    }

    @autobind
    onNewInCourseWorkspaceClick() {
        trackClick(NEW_IN_COURSE_WORKSPACE_EVENT);
        this.props.labsStore
            .createLab(LAB_TYPE.workspace.key)
            .then((labId) => this.labWorkspaceEditorStore.openModalForLab(labId));
    }

    @autobind
    async onNewWorkspaceClose() {
        await this.props.labsStore.loadLabs();
    }

    renderWorkspaces(workspaceType: string, workspaces: Lab[]) {
        if (workspaces.length === 0) {
            return (
                <div className="ud-heading-lg" styleName="no-records" data-purpose="no-records">
                    {gettext('No Labs')}
                </div>
            );
        }
        const isDevWorkspace = workspaceType === LAB_TYPE.dev_workspace.key;
        const styleName = classNames('lab-row', {
            'lab-row--dev-workspace': isDevWorkspace,
        });
        const {labsStore} = this.props;
        return (
            <>
                {isDevWorkspace ? (
                    <div data-purpose="lab-header-row" styleName="lab-row">
                        <div styleName="lab-header">{gettext('Workspace')}</div>
                    </div>
                ) : (
                    <div data-purpose="lab-header-row" styleName="lab-row">
                        <div styleName="lab-header">{gettext('Course')}</div>
                        <div styleName="lab-header">{gettext('Workspace')}</div>
                    </div>
                )}
                {workspaces.map((lab: Lab) => (
                    <div key={`lab-${lab.id}`} data-purpose="lab-row" styleName={styleName}>
                        {!isDevWorkspace && (
                            <div data-purpose="course-info" styleName="course-info">
                                {lab.course ? (
                                    <Link to={`/course/${lab.course.id}/`} disableRouter={true}>
                                        {lab.course.title}
                                    </Link>
                                ) : (
                                    gettext('No Course')
                                )}
                            </div>
                        )}
                        <div styleName="launcher-container">
                            <LabLauncher
                                lab={lab}
                                userType={USER_TYPES.INSTRUCTOR}
                                areActionsHidden={false}
                                isRunningLabLimitExceeded={labsStore.isRunningLabLimitExceeded}
                            />
                        </div>
                        <div styleName="actions-container">
                            <InstructorLabActions lab={lab} />
                        </div>
                    </div>
                ))}
            </>
        );
    }

    render() {
        const {labsStore} = this.props;
        const canCreateInCourseWorkspace = checkUserLabAccessLevel(ADMIN_LAB_ACCESS_LEVELS);
        return (
            <Provider
                labsStore={labsStore}
                labWorkspaceEditorStore={this.labWorkspaceEditorStore}
                labVerticalSystemEventStore={this.labVerticalSystemEventStore}
            >
                <div>
                    <SimpleIAResponsiveHeader
                        title={
                            <>
                                {gettext('Workspaces')}
                                <Badge styleName="beta-label" data-purpose="beta-label">
                                    {gettext('Beta')}
                                </Badge>
                            </>
                        }
                        rightCTA={
                            labsStore.canCreate &&
                            (canCreateInCourseWorkspace ? (
                                <Dropdown
                                    placement="bottom-end"
                                    trigger={
                                        <Dropdown.Button udStyle="brand">
                                            {gettext('New workspace')}
                                        </Dropdown.Button>
                                    }
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.MenuItem
                                            componentClass="button"
                                            onClick={this.onNewDevWorkspaceClick}
                                            data-purpose={'new-dev-workspace'}
                                        >
                                            {gettext('Dev')}
                                        </Dropdown.MenuItem>
                                        <Dropdown.MenuItem
                                            componentClass="button"
                                            onClick={this.onNewInCourseWorkspaceClick}
                                            data-purpose={'new-in-course-workspace'}
                                        >
                                            {gettext('In course')}
                                        </Dropdown.MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Button
                                    udStyle="brand"
                                    data-purpose={'new-dev-workspace'}
                                    onClick={this.onNewDevWorkspaceClick}
                                >
                                    {gettext('New workspace')}
                                </Button>
                            ))
                        }
                    />
                    <LabWorkspaceEditor onClose={this.onNewWorkspaceClose} />
                    {labsStore.isLoading ? (
                        <MainContentLoader styleName="loader" />
                    ) : (
                        <div styleName="labs-container">
                            <Tabs>
                                <Tabs.Tab title={gettext('Dev')}>
                                    {this.renderWorkspaces(
                                        LAB_TYPE.dev_workspace.key,
                                        labsStore.devWorkspaces,
                                    )}
                                </Tabs.Tab>
                                <Tabs.Tab title={gettext('In-course')}>
                                    {this.renderWorkspaces(
                                        LAB_TYPE.workspace.key,
                                        labsStore.inCourseWorkspaces,
                                    )}
                                </Tabs.Tab>
                            </Tabs>
                        </div>
                    )}
                </div>
            </Provider>
        );
    }
}
