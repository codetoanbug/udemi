import {Button, Link} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import React, {MouseEvent} from 'react';

import {SimpleIAResponsiveHeader} from 'instructor/layout/ia-responsive-header.react-component';
import {
    LAB_PREVIEWABLE_STATUSES,
    LAB_STATUS,
    LAB_TYPE,
    LABS_MODULAR_URL_PATTERN,
    USER_TYPES,
} from 'labs/constants';
import {InstructorOwnerBadge} from 'labs/instructor-owner-badge.react-component';
import LabLauncher from 'labs/lab-launcher/lab-launcher.react-component';

import {trackClick} from '../common/labs-tracking';
import {LAB_PREVIEW_EVENT, modularLabManageUrl} from './constants';
import InstructorLabActions from './instructor-lab-actions.react-component';
import LabWorkspaceEditorStore from './lab-workspace-editor.mobx-store';
import {InstructorLabListingProps} from './types';

import './labs.less';

@inject('labsStore')
@observer
export class LabsModular extends React.Component<InstructorLabListingProps> {
    async componentDidMount() {
        await this.props.labsStore.loadLabs();
    }

    labWorkspaceEditorStore = new LabWorkspaceEditorStore();

    @autobind
    async onNewModularLabClick() {
        const labId = await this.props.labsStore.createLab(LAB_TYPE.modular.key);
        labId && window.open(modularLabManageUrl(labId), '_blank');
    }

    @autobind
    onModularLabLaunch(event: MouseEvent<HTMLButtonElement>) {
        trackClick(LAB_PREVIEW_EVENT);
        window.open(
            `${LABS_MODULAR_URL_PATTERN}${event.currentTarget.dataset.labId}/?version=head`,
            '_blank',
        );
    }

    render() {
        const {labsStore} = this.props;
        return (
            <Provider labsStore={labsStore} labWorkspaceEditorStore={this.labWorkspaceEditorStore}>
                <div>
                    <SimpleIAResponsiveHeader
                        title={
                            <>
                                {gettext('Labs')}
                                <Badge styleName="beta-label" data-purpose="beta-label">
                                    {gettext('Beta')}
                                </Badge>
                            </>
                        }
                        rightCTA={
                            labsStore.canCreate && (
                                <Button
                                    udStyle="brand"
                                    data-purpose="new-modular-lab"
                                    onClick={this.onNewModularLabClick}
                                >
                                    {gettext('New lab')}
                                </Button>
                            )
                        }
                    />
                    {labsStore.isLoading ? (
                        <MainContentLoader styleName="loader" />
                    ) : labsStore.modularLabs.length === 0 ? (
                        <div
                            className="ud-heading-lg"
                            styleName="no-records"
                            data-purpose="no-records"
                        >
                            {gettext('No Labs')}
                        </div>
                    ) : (
                        <div styleName="labs-container">
                            <div data-purpose="lab-header-row" styleName="lab-row">
                                <div styleName="lab-header">{gettext('Lab name')}</div>
                                <div styleName="lab-header">{gettext('Workspace')}</div>
                            </div>
                            {labsStore.modularLabs.map((lab) => (
                                <div
                                    key={`lab-${lab.id}`}
                                    data-purpose="lab-row"
                                    styleName="lab-row lab-row-modular"
                                >
                                    <div data-purpose="lab-info">
                                        <Link
                                            to={`/labs/${lab.id}/${
                                                lab.status === LAB_STATUS.draft
                                                    ? '?version=head'
                                                    : ''
                                            }`}
                                            disableRouter={true}
                                        >
                                            {lab.title}
                                        </Link>
                                        <div>
                                            {lab.instructorHasLab?.isOwner && (
                                                <InstructorOwnerBadge styleName="owner-label" />
                                            )}
                                            {lab.status === LAB_STATUS.draft && (
                                                <Badge
                                                    styleName="draft-label"
                                                    data-purpose="draft-label"
                                                >
                                                    {gettext('Draft')}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div styleName="launcher-container">
                                        <LabLauncher
                                            lab={lab}
                                            userType={USER_TYPES.INSTRUCTOR}
                                            areActionsHidden={true}
                                            isRunningLabLimitExceeded={
                                                labsStore.isRunningLabLimitExceeded
                                            }
                                        />
                                    </div>
                                    <div styleName="preview-container">
                                        <Button
                                            data-lab-id={lab.id}
                                            udStyle="primary"
                                            data-purpose="modular-lab-launch"
                                            disabled={
                                                !LAB_PREVIEWABLE_STATUSES.includes(lab.status)
                                            }
                                            onClick={this.onModularLabLaunch}
                                        >
                                            {gettext('Preview')}
                                        </Button>
                                    </div>
                                    <div styleName="actions-container">
                                        <InstructorLabActions lab={lab} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Provider>
        );
    }
}
