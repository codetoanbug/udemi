import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {NEW_WORKSPACE_LAUNCH_MODAL_CONTENT} from '../constants';
import HighFiveImage from './high-five.png';
import LabLauncherStore from './lab-launcher.mobx-store';
import './lab-launcher.less';

@inject('labLauncherStore')
@observer
export default class NewWorkspaceLaunchModal extends React.Component {
    static propTypes = {
        labLauncherStore: PropTypes.instanceOf(LabLauncherStore).isRequired,
    };

    @autobind
    onCancel() {
        this.props.labLauncherStore.setShowNewWorkspaceModal(false);
    }

    @autobind
    onTerminate() {
        this.props.labLauncherStore.terminateRunningLabs();
    }

    @autobind
    onLaunch() {
        this.props.labLauncherStore.setShowNewWorkspaceModal(false);
        this.props.labLauncherStore.startLab();
    }

    @computed
    get modalAttributes() {
        const {newWorkspaceLaunchModalContent} = this.props.labLauncherStore;
        if (
            newWorkspaceLaunchModalContent === NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.RUNNING_INSTANCES
        ) {
            return {
                title: gettext('Confirm new Workspace launch'),
            };
        }
        return {
            title: '',
            renderTitle: () => ['empty-title', null],
        };
    }

    @computed
    get runningInstances() {
        const labs = this.props.labLauncherStore.runningLabs?.map((instance) => {
            return <li key={instance.uuid}>{instance.lab.title}</li>;
        });
        return <ul>{labs}</ul>;
    }

    runningInstancesInfo() {
        return (
            <div>
                <div>
                    <p>
                        {gettext(
                            'Please note that starting a new Workspace will disrupt all in-progress labs.',
                        )}
                    </p>
                    <p>
                        {interpolate(
                            gettext('You currently have %(numLabs)s active lab(s):'),
                            {numLabs: this.props.labLauncherStore.runningLabs?.length || 0},
                            true,
                        )}
                    </p>
                    {this.runningInstances}
                    <p>
                        {gettext(
                            "If you proceed, all data will be cleared and the instances listed above will be terminated. This action can't be undone.",
                        )}
                    </p>
                </div>
                <FooterButtons>
                    <Button udStyle="ghost" onClick={this.onCancel} data-purpose="cancel-button">
                        {gettext('Cancel')}
                    </Button>
                    <Button onClick={this.onTerminate} data-purpose="terminate-all-button">
                        {gettext('Terminate all labs')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }

    terminatingExistingLabs() {
        return (
            <div styleName="new-workspace-modal-content" data-purpose="terminating-labs-content">
                <div>
                    <Loader size="xxlarge" />
                    <h1 className="ud-heading-serif-xl">
                        {gettext('Terminating all in-progress labs')}
                    </h1>
                    <h2 className="ud-heading-serif-md">
                        {gettext(
                            'This may take a few minutes. Grab a snack and get ready to learn.',
                        )}
                    </h2>
                </div>
            </div>
        );
    }

    terminateDone() {
        return (
            <div styleName="new-workspace-modal-content">
                <div>
                    <Image
                        alt={gettext('high five')}
                        src={HighFiveImage}
                        height={211}
                        width={154}
                    />
                    <h1 className="ud-heading-serif-xl">
                        {gettext("All set, you're ready to go!")}
                    </h1>
                    <h2 className="ud-heading-serif-md">
                        {gettext('Your new Workspace is ready to be launched.')}
                    </h2>
                </div>
                <FooterButtons styleName="center-button">
                    <Button onClick={this.onLaunch} data-purpose="launch-button">
                        {gettext('Launch')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }

    @computed
    get modalContent() {
        const {newWorkspaceLaunchModalContent} = this.props.labLauncherStore;

        switch (newWorkspaceLaunchModalContent) {
            case NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.RUNNING_INSTANCES:
                return this.runningInstancesInfo();
            case NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.TERMINATING_EXISTING_INSTANCES:
                return this.terminatingExistingLabs();
            case NEW_WORKSPACE_LAUNCH_MODAL_CONTENT.TERMINATE_DONE:
                return this.terminateDone();
            default:
                return null;
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.labLauncherStore.showNewWorkspaceLaunchModal}
                requireExplicitAction={true}
                data-purpose="workspace-launch-prompt"
                {...this.modalAttributes}
            >
                <div id="empty-title"></div>
                {this.modalContent}
            </Modal>
        );
    }
}
