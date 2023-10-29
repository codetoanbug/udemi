import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import {showErrorToast, showSuccessToast} from 'organization-common/toasts';
import udLink from 'utils/ud-link';

import {
    LEARNING_PATH_ERROR_MESSAGES,
    LEARNING_PATH_SUCCESS_MESSAGES,
} from '../learning-path-page/constants';
import ListPathEditors from '../learning-path-page/list-path-editors.react-component';
import pageEventTracker from '../learning-path-page/page-event-tracker';
import PathEditorsStore from '../learning-path-page/path-editors.mobx-store';
import LearningPath from '../learning-path.mobx-model';
import LearningPathStore from '../learning-path.mobx-store';
import UserSelector from './user-selector.react-component';

import './path-editors-modals.less';

/**
 * A modal component that allows users to add/remove path editors and change their permissions
 */

@inject('resourceContext', 'learningPathStore')
@observer
export default class EditPathEditorsModal extends React.Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        window: PropTypes.object,
        resourceContext: PropTypes.string.isRequired,
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    static defaultProps = {
        window,
    };

    constructor(props) {
        super(props);
        this.store = new PathEditorsStore(this.props.learningPath);
    }

    @autobind
    async onSubmit() {
        try {
            await this.props.learningPath.setPathEditorPermissions(
                false,
                this.store.editorsUpdates,
            );
            if (!this.props.learningPath.userHasEditPermissions) {
                // if the modal is opened in the list page, we don't want to redirect the user.
                if (this.props.resourceContext === CONTEXT_TYPES.LEARNING_PATH) {
                    this.props.window.location.href = udLink.to(
                        this.props.learningPath.resourceUrl,
                    );
                }
            }
            this.props.onHide();
            showSuccessToast(LEARNING_PATH_SUCCESS_MESSAGES.UPDATED_EDITORS);
            pageEventTracker.changedEditors(
                this.props.learningPathStore.isEditModeEnabled,
                this.store.editorsUpdates.added.length,
                this.store.editorsUpdates.removed.length,
                this.store.editorsUpdates.featured_editor?.id,
                this.props.learningPath.id,
            );
        } catch (e) {
            showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_UPDATE_PERMISSION);
        }
    }

    @autobind
    onModalClose() {
        this.store.discardEditorsUpdates();
        this.store.setEditableEditors(this.props.learningPath.editors);
        this.store.setPathOwner(this.props.learningPath.owner);
        this.store.clearInputValue();
        this.props.onHide();
    }

    render() {
        const {
            pathOwner,
            editableEditors,
            removePathEditor,
            makeEditorFeatured,
            areEditorUpdatesAvailable,
        } = this.store;
        return (
            <Modal
                title={gettext('Editors')}
                isOpen={this.props.isVisible}
                onClose={this.onModalClose}
            >
                <p>
                    {gettext(
                        'Invite colleagues to help you build this path to achieve your teams outcomes. All editors have the ability to add content and invite additional editors.',
                    )}
                </p>
                <UserSelector store={this.store} />
                <ListPathEditors
                    owner={pathOwner}
                    editors={editableEditors}
                    removePathEditor={removePathEditor}
                    makeEditorFeatured={makeEditorFeatured}
                    isEditable={true}
                />
                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={this.onModalClose}
                        data-purpose="cancel-button"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        disabled={!areEditorUpdatesAvailable}
                        onClick={this.onSubmit}
                        data-purpose="save-button"
                    >
                        {gettext('Save changes')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
