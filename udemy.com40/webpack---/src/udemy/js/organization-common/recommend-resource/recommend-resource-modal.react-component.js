import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore, AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {withUDData} from '@udemy/ud-data';
import {action} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ORGANIZATION_GROUP_CLASS} from 'organization-common/constants';
import ResourcePreview from 'organization-common/resource-preview/resource-preview.react-component';
import UserAndGroupAutocomplete from 'organization-common/user-and-group-autocomplete/user-and-group-autocomplete.react-component';

import {getRecommendResourceModalFields} from './constants';
import styles from './recommend-resource-modal.less';
import RecommendResourceModalStore from './recommend-resource-modal.mobx-store';

@observer
class InternalRecommendResourceModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        resourceId: PropTypes.number.isRequired,
        shareData: PropTypes.object.isRequired,
        resourceType: PropTypes.string.isRequired,
        /* where the modal was rendered */
        context: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const {resourceType, resourceId, context, udData, gettext} = this.props;
        this.recommendStore = new RecommendResourceModalStore(
            udData.Config.brand.organization.id,
            resourceType,
            resourceId,
            context,
            {
                gettext,
                me: udData.me,
            },
        );
    }

    get resourceTitle() {
        return this.props.shareData.map((data) => {
            return data.title;
        });
    }

    get numberOfSelectedUsers() {
        const {
            isAllUsersSelected,
            totalNumberOfLicensedUsers,
            selectedUsersAndGroups,
        } = this.recommendStore;

        if (isAllUsersSelected) {
            return totalNumberOfLicensedUsers;
        }
        return selectedUsersAndGroups.reduce(
            (acc, obj) => (obj._class === ORGANIZATION_GROUP_CLASS ? acc + obj.num_users : acc + 1),
            0,
        );
    }

    get notificationTitle() {
        return this.props.ninterpolate(
            'You recommended %(resourceTitle)s to %(usersCount)s user',
            'You recommended %(resourceTitle)s to %(usersCount)s users',
            this.numberOfSelectedUsers,
            {
                resourceTitle: this.resourceTitle,
                usersCount: this.numberOfSelectedUsers,
            },
        );
    }

    get notificationBodyContent() {
        return this.props.ninterpolate(
            'The user will be notified by email.',
            'The users will be notified by email.',
            this.numberOfSelectedUsers,
        );
    }

    showNotification() {
        return ToasterStore.addAlertBannerToast(
            {
                udStyle: 'success',
                title: this.notificationTitle,
                body: this.notificationBodyContent,
                showCta: false,
            },
            {
                autoDismiss: true,
            },
        );
    }

    recommendResource = async () => {
        const message = await this.recommendStore.recommendResource();
        if (message === 'success') {
            this.showNotification();
            this.onClose();
        }
    };

    onChangeMessage = () => {
        this.recommendStore.setSenderMessage(event.target.value);
    };

    @action
    onClose = () => {
        this.recommendStore.resetModalValues();
        this.props.onClose();
    };

    renderUserAndGroupInput() {
        return (
            <>
                {this.recommendStore.errorMessage && (
                    <AlertBanner
                        className={styles.alert}
                        udStyle="error"
                        showCta={false}
                        title={this.recommendStore.errorMessage}
                    />
                )}
                <Provider store={this.recommendStore}>
                    <UserAndGroupAutocomplete />
                </Provider>
            </>
        );
    }

    render() {
        const {gettext} = this.props;
        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={this.onClose}
                onOpen={this.recommendStore.getTotalNumberOfLicensedUsers}
                title={getRecommendResourceModalFields(gettext)[this.props.resourceType].modalTitle}
            >
                {this.renderUserAndGroupInput()}
                <ResourcePreview
                    resourceId={this.props.resourceId}
                    resourceType={this.props.resourceType}
                    shareData={this.props.shareData}
                    onChangeMessageCallback={this.onChangeMessage}
                    defaultMessage={this.recommendStore.defaultRecommendMessage}
                    className="modal--resource-preview"
                />

                <FooterButtons>
                    <Button onClick={this.onClose} udStyle="ghost">
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        udStyle="primary"
                        data-purpose="recommend-button"
                        disabled={!this.recommendStore.hasSelectedAnyValue}
                        onClick={this.recommendResource}
                    >
                        {this.recommendStore.isRecommending
                            ? gettext('Recommending...')
                            : gettext('Recommend')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}

const RecommendResourceModal = withI18n(withUDData(InternalRecommendResourceModal));

export default RecommendResourceModal;
