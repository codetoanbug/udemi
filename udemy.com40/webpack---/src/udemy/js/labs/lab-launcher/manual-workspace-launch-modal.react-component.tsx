import {LocalizedHtml} from '@udemy/i18n';
import CopyIcon from '@udemy/icons/dist/copy.ud-icon';
import HelpSupportIcon from '@udemy/icons/dist/help-support.ud-icon';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import Clipboard from 'clipboard';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {
    AZURE_CLI_DOCUMENTATION_LINK,
    LABS_SUPPORT_ARTICLES,
    LAB_CLICK_TRACKING_ACTIONS,
} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';

import {sendLabClickEvent} from '../utils';
import LabLauncherStore from './lab-launcher.mobx-store';

import './manual-workspace-launch-modal.less';

interface ManualWorkspaceLaunchModalProps {
    labLauncherStore: LabLauncherStore;
}

type CopyableItem = 'username' | 'password' | 'resourceGroup';

@observer
export class ManualWorkspaceLaunchModal extends React.Component<ManualWorkspaceLaunchModalProps> {
    static defaultProps: ManualWorkspaceLaunchModalProps;

    componentDidUpdate(): void {
        this.clipboardUsername.destroy();
        this.clipboardPassword.destroy();
        this.clipboardResourceGroup.destroy();
        this.clipboardUsername = new Clipboard('.copy-username-button');
        this.clipboardPassword = new Clipboard('.copy-password-button');
        this.clipboardResourceGroup = new Clipboard('.copy-resource-group-button');
        const {lab} = this.props.labLauncherStore;
        this.clipboardUsername.on('success', () => {
            sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_COPY_USERNAME_CLICK);
            this.setCopied('username');
        });
        this.clipboardPassword.on('success', () => {
            sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_COPY_PASSWORD_CLICK);
            this.setCopied('password');
        });
        this.clipboardResourceGroup.on('success', () => {
            sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_COPY_RESOURCE_GROUP_CLICK);
            this.setCopied('resourceGroup');
        });
    }

    componentWillUnmount(): void {
        this.clipboardUsername.destroy();
        this.clipboardPassword.destroy();
        this.clipboardResourceGroup.destroy();
    }

    @observable copiedItems: Record<CopyableItem, boolean> = {
        username: false,
        password: false,
        resourceGroup: false,
    };

    @observable clipboardUsername = new Clipboard('.copy-username-button');
    @observable clipboardPassword = new Clipboard('.copy-password-button');
    @observable clipboardResourceGroup = new Clipboard('.copy-resource-group-button');

    @action
    setCopied(item: CopyableItem) {
        this.setCopiedItems(item, true);
        setTimeout(() => {
            this.setCopiedItems(item, false);
        }, 3000);
    }

    @action
    setCopiedItems(item: CopyableItem, value: boolean) {
        this.copiedItems[item] = value;
    }

    @autobind
    closeWorkspaceLoginPopup() {
        const {lab, setShowWorkspaceLoginPopup} = this.props.labLauncherStore;
        sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_MODAL_CLOSE);
        setShowWorkspaceLoginPopup(false);
    }

    @autobind
    openWorkspaceLoginUrl() {
        const {lab, openWorkspace} = this.props.labLauncherStore;
        sendLabClickEvent(lab, LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_OPEN_WORKSPACE_CLICK);
        openWorkspace();
    }

    @autobind
    toggleLoginPanel(open: boolean) {
        const clickEvent = open
            ? LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_ACCORDION_EXPAND
            : LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_ACCORDION_COLLAPSE;
        sendLabClickEvent(this.props.labLauncherStore.lab, clickEvent);
    }

    @autobind
    toggleAdvancedPanel(open: boolean) {
        const clickEvent = open
            ? LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_ADVANCED_ACCORDION_EXPAND
            : LAB_CLICK_TRACKING_ACTIONS.WORKSPACE_LOGIN_ADVANCED_ACCORDION_COLLAPSE;
        sendLabClickEvent(this.props.labLauncherStore.lab, clickEvent);
    }

    _renderCopyButton() {
        return (
            <div styleName="copy-button" data-purpose="copy-button">
                <CopyIcon styleName="copy-icon" label={false} />
                <span>{gettext('Copy')}</span>
            </div>
        );
    }

    _renderCopiedButton() {
        return (
            <div styleName="copy-button" data-purpose="copy-button">
                <TickIcon styleName="copy-icon" label={false} />
                <span>{gettext('Copied!')}</span>
            </div>
        );
    }

    _renderLoginContent() {
        const {labLauncherStore} = this.props;
        const labInstance = (labLauncherStore.lab as Lab)?.myLatestInstance;

        return (
            <div>
                <div>
                    {interpolate(
                        gettext(
                            'To access your %(verticalName)s workspace click the button below to open the environment in a new window and log in with the credentials provided.',
                        ),
                        {verticalName: labLauncherStore.verticalName},
                        true,
                    )}
                </div>
                <div styleName="section open-workspace">
                    <Button
                        data-purpose="open-workspace"
                        styleName="open-workspace-btn"
                        udStyle="primary"
                        size="medium"
                        onClick={this.openWorkspaceLoginUrl}
                    >
                        {gettext('Open workspace')}
                        <OpenInNewIcon styleName="open-icon" size="xsmall" label={false} />
                    </Button>
                    <div styleName="login-new-user-info">
                        <InfoOutlineIcon styleName="info-icon" label={false} />
                        <span>
                            {interpolate(
                                gettext(
                                    'If you have previously signed in to a %(accountName)s account, make sure to log in as a new user.',
                                ),
                                {accountName: labLauncherStore.isAzureLab ? 'Microsoft' : 'Google'},
                                true,
                            )}
                        </span>
                    </div>
                </div>
                <div styleName="section credentials">
                    <FormGroup
                        styleName="credentials-form-group"
                        label="Username"
                        formControlId="clipboard-username"
                    >
                        <TextInputForm
                            id="clipboard-username"
                            styleName="input-form"
                            defaultValue={labInstance?.workspaceUsername}
                            readOnly={true}
                            size="medium"
                            submitButtonContent={
                                this.copiedItems.username
                                    ? this._renderCopiedButton()
                                    : this._renderCopyButton()
                            }
                            submitButtonProps={{
                                udStyle: 'secondary',
                                className: 'copy-username-button',
                                'data-clipboard-target': '#clipboard-username',
                            }}
                        />
                    </FormGroup>
                    <FormGroup
                        styleName="credentials-form-group"
                        label="Password"
                        formControlId="clipboard-password"
                    >
                        <TextInputForm
                            id="clipboard-password"
                            styleName="input-form"
                            defaultValue={labInstance?.workspacePassword}
                            readOnly={true}
                            size="medium"
                            submitButtonContent={
                                this.copiedItems.password
                                    ? this._renderCopiedButton()
                                    : this._renderCopyButton()
                            }
                            submitButtonProps={{
                                udStyle: 'secondary',
                                className: 'copy-password-button',
                                'data-clipboard-target': '#clipboard-password',
                            }}
                        />
                    </FormGroup>
                </div>
                {labLauncherStore.isAzureLab && (
                    <div styleName="section">
                        {gettext(
                            'For access to the workspace via Azure command-line interface (CLI), use the above credentials with az login.',
                        )}
                    </div>
                )}
            </div>
        );
    }

    _renderAdvancedContent() {
        const {labLauncherStore} = this.props;
        const labInstance = (labLauncherStore.lab as Lab)?.myLatestInstance;

        return (
            <div>
                <div>
                    {interpolate(
                        gettext(
                            'Some %(verticalName)s CLI commands may require a %(parameterName)s parameter.',
                        ),
                        {
                            verticalName: labLauncherStore.verticalName,
                            parameterName: labLauncherStore.isAzureLab
                                ? 'resource group'
                                : 'employee id',
                        },
                        true,
                    )}
                </div>
                <FormGroup
                    styleName="section"
                    label={labLauncherStore.isGCPLab ? 'Employee ID' : 'Resource Group'}
                    formControlId="clipboard-resource-group"
                >
                    <TextInputForm
                        id="clipboard-resource-group"
                        styleName="input-form"
                        defaultValue={labInstance?.workspaceResource}
                        readOnly={true}
                        size="medium"
                        submitButtonContent={
                            this.copiedItems.resourceGroup
                                ? this._renderCopiedButton()
                                : this._renderCopyButton()
                        }
                        submitButtonProps={{
                            udStyle: 'secondary',
                            className: 'copy-resource-group-button',
                            'data-clipboard-target': '#clipboard-resource-group',
                        }}
                    />
                </FormGroup>
                {labLauncherStore.isAzureLab && (
                    <div styleName="section">
                        <LocalizedHtml
                            html={interpolate(
                                gettext(
                                    "For more information about Azure CLI, consult Azure's <a class='azureDocLink'>%(linkText)s</a>",
                                ),
                                {
                                    linkText: 'documentation',
                                },
                                true,
                            )}
                            interpolate={{
                                azureDocLink: (
                                    <a
                                        href={AZURE_CLI_DOCUMENTATION_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    render() {
        const {labLauncherStore} = this.props;
        return (
            <Modal
                isOpen={labLauncherStore.showWorkspaceLoginPopup}
                onClose={this.closeWorkspaceLoginPopup}
                title={interpolate(
                    gettext('%(verticalName)s workspace credentials'),
                    {verticalName: labLauncherStore.verticalName},
                    true,
                )}
                data-purpose="workspace-login"
            >
                <div>
                    <Accordion>
                        <Accordion.Panel
                            title={gettext('Login')}
                            defaultExpanded={labLauncherStore.showAzureLoginExpanded}
                            onToggle={this.toggleLoginPanel}
                            data-purpose="login-panel"
                        >
                            {this._renderLoginContent()}
                        </Accordion.Panel>
                        <Accordion.Panel
                            title={gettext('Advanced (CLI)')}
                            onToggle={this.toggleAdvancedPanel}
                            data-purpose="advanced-panel"
                        >
                            {this._renderAdvancedContent()}
                        </Accordion.Panel>
                    </Accordion>
                    <div styleName="help-labs">
                        <HelpSupportIcon styleName="help-icon" label={false} />
                        <span styleName="help-text">
                            <LocalizedHtml
                                styleName="help-text"
                                html={interpolate(
                                    gettext(
                                        'Need help? Check our <a class="supportLink">%(supportLinkText)s</a>.',
                                    ),
                                    {supportLinkText: 'support article'},
                                    true,
                                )}
                                interpolate={{
                                    supportLink: (
                                        <a
                                            href={
                                                labLauncherStore.isAzureLab
                                                    ? LABS_SUPPORT_ARTICLES.AZURE
                                                    : LABS_SUPPORT_ARTICLES.GCP
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                }}
                            />
                        </span>
                    </div>
                </div>
            </Modal>
        );
    }
}
