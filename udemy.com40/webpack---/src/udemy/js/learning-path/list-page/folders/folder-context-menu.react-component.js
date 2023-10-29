import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import withMatchMediaClientOnly from 'base-components/responsive/match-media.react-component';
import {showSuccessToast} from 'organization-common/toasts';

import {BASE_PATH} from '../../constants';
import {FOLDER_LIST_TYPE, LIST_PAGE_SUCCESS_MESSAGES} from '../constants';
import ListPageStore from '../list-page.mobx-store';
import '../list-page.less';

@withMatchMediaClientOnly({isDesktop: 'lg-min'})
@inject('listPageStore')
@withRouter
@observer
export default class FolderContextMenu extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        folder: PropTypes.object.isRequired,
        size: PropTypes.string,
        isDesktop: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        // we need default for the button size but it does not have default as prop
        size: undefined,
    };

    @observable isDeleteConfirmationModalVisible = false;

    @autobind
    @action
    showDeleteConfirmationModal() {
        this.isDeleteConfirmationModalVisible = true;
    }

    @autobind
    @action
    hideDeleteConfirmationModal() {
        this.isDeleteConfirmationModalVisible = false;
    }

    @autobind
    async onDeleteConfirm() {
        await this.props.listPageStore.deleteFolder(this.props.folder.id);
        showSuccessToast(LIST_PAGE_SUCCESS_MESSAGES.DELETED_FOLDER);
        this.hideDeleteConfirmationModal();
        this.props.history.push({
            pathname: BASE_PATH,
        });
    }

    @autobind
    editFolder() {
        this.props.history.push({
            pathname: `${BASE_PATH}${FOLDER_LIST_TYPE}/${this.props.folder.id}/edit`,
        });
    }

    get dropdownTriggerSize() {
        return this.props.isDesktop ? 'small' : 'large';
    }

    render() {
        const {isFolderEditModeEnabled} = this.props.listPageStore;

        return (
            <>
                <Dropdown
                    placement="bottom-end"
                    trigger={
                        <IconButton udStyle="secondary" size={this.dropdownTriggerSize}>
                            <MoreIcon label={gettext('Options')} />
                        </IconButton>
                    }
                >
                    <Dropdown.Menu>
                        {!isFolderEditModeEnabled && (
                            <Dropdown.MenuItem
                                icon={<EditIcon label={false} />}
                                onClick={this.editFolder}
                                data-purpose="folder-edit"
                            >
                                {gettext('Edit')}
                            </Dropdown.MenuItem>
                        )}
                        <Dropdown.MenuItem
                            icon={<DeleteIcon label={false} />}
                            onClick={this.showDeleteConfirmationModal}
                            data-purpose="folder-delete"
                        >
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                </Dropdown>

                <Modal
                    isOpen={this.isDeleteConfirmationModalVisible}
                    requireExplicitAction={true}
                    data-purpose="submit-confirm-modal"
                    title={interpolate(
                        gettext('Delete - %(folderTitle)s'),
                        {folderTitle: this.props.folder.title},
                        true,
                    )}
                >
                    <AlertBanner
                        udStyle="warning"
                        showCta={false}
                        title={interpolate(
                            gettext("You are about to delete '%(folderTitle)s'"),
                            {folderTitle: this.props.folder.title},
                            true,
                        )}
                    />
                    <p styleName="mt-sm">
                        {gettext(
                            'Deleting this folder will remove it from the side navigation, the paths inside the folder can still be found in all paths.',
                        )}
                    </p>

                    <FooterButtons>
                        <Button udStyle="ghost" onClick={this.hideDeleteConfirmationModal}>
                            {gettext('Cancel')}
                        </Button>
                        <Button data-purpose="submit-confirm-button" onClick={this.onDeleteConfirm}>
                            {gettext('Delete')}
                        </Button>
                    </FooterButtons>
                </Modal>
            </>
        );
    }
}
