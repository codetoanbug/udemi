import {LocalizedHtml} from '@udemy/i18n';
import WorkspaceIcon from '@udemy/icons/dist/workspace.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import TeachImage from 'labs/Teach_2.png';
import SystemMessage from 'utils/ud-system-message';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class WorkspaceEnabledModal extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
        courseId: PropTypes.number.isRequired,
    };

    @autobind
    onConfirmTryWorkspaces() {
        this.props.labsStore.setTryWorkspacesClicked(true);
        this.markWorkspaceEnabledLecturePromptAsSeen();
    }

    @autobind
    onCloseWorkspaceDialog() {
        this.markWorkspaceEnabledLecturePromptAsSeen();
    }

    @autobind
    markWorkspaceEnabledLecturePromptAsSeen() {
        SystemMessage.seen(SystemMessage.ids.hasSeenWorkspaceEnabledLecturesPrompt, {
            obj_id: this.props.courseId,
            obj_type: 'course',
        }).then(
            action((response) => {
                if (response && response.status === 201) {
                    this.props.labsStore.setHasSeenWorkspaceEnabledLecturesPrompt(true);
                    this.props.labsStore.setShowWorkspaceEnabledLecturesPrompt(false);
                }
            }),
        );
    }

    get workspaceDialogTitle() {
        return (
            <div
                styleName="workspace-dialog-title"
                className="ud-heading-lg"
                id="workspace-dialog-title"
            >
                <span>{gettext('Workspace available')}</span>
                <ProBadge styleName="pro-badge" />
            </div>
        );
    }

    get compatibleLectures() {
        return (
            <span styleName="compatible-lectures">
                <WorkspaceIcon label={false} />
                {gettext('compatible lectures')}
            </span>
        );
    }

    render() {
        const {
            allWorkspaceEnabledLectures,
            hasSeenWorkspaceEnabledLecturesPrompt,
            showWorkspaceEnabledLecturesPrompt,
        } = this.props.labsStore;
        return (
            <Modal
                isOpen={
                    !hasSeenWorkspaceEnabledLecturesPrompt && showWorkspaceEnabledLecturesPrompt
                }
                renderTitle={() => ['workspace-dialog-title', null]}
                title=""
                data-purpose="workspace-dialog"
                onClose={this.onCloseWorkspaceDialog}
            >
                <div styleName="workspace-dialog-content">
                    <div>
                        <Image src={TeachImage} alt="" height={270} width={360} />
                    </div>
                    {this.workspaceDialogTitle}
                    <p>
                        {allWorkspaceEnabledLectures?.length > 0 ? (
                            <LocalizedHtml
                                dataPurpose="wel-message"
                                html={gettext(
                                    'Udemy Workspaces allow you to get hands-on in a risk-free environment, with no set-up required during <span class="compatibleLectures"><span class="icon"></span>compatible lectures</span> of this course.',
                                )}
                                interpolate={{
                                    compatibleLectures: <span styleName="compatible-lectures" />,
                                    icon: (
                                        <WorkspaceIcon styleName="workspace-icon" label={false} />
                                    ),
                                }}
                            />
                        ) : (
                            <span data-purpose="non-wel-message">
                                {gettext(
                                    'Udemy Workspaces allow you to get hands-on in a risk-free environment, with no set-up required during portions of this course.',
                                )}
                            </span>
                        )}
                    </p>
                    <FooterButtons styleName="wel-modal-button">
                        <Button
                            data-purpose="wel-try-workspaces"
                            onClick={this.onConfirmTryWorkspaces}
                        >
                            {gettext('Try Workspaces')}
                        </Button>
                    </FooterButtons>
                </div>
            </Modal>
        );
    }
}
