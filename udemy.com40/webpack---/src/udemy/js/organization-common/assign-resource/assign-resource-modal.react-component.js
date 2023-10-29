import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore as toasterStore, AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {safelySetInnerHTML} from '@udemy/shared-utils/dist/esm/escape/safely-set-inner-html';
import {withUDData} from '@udemy/ud-data';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {getAssignResourceModalFields} from 'organization-common/assign-resource/constants';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {RETIREMENT_ALERT_MODAL_TYPES} from 'organization-common/course-retirement/constants';
import CourseRetirementModalAlert from 'organization-common/course-retirement/course-retirement-modal-alert.react-component';
import ResourcePreview from 'organization-common/resource-preview/resource-preview.react-component';
import {ASSIGN_MODAL} from 'organization-common/user-and-group-autocomplete/constants';
import UserAndGroupAutocomplete from 'organization-common/user-and-group-autocomplete/user-and-group-autocomplete.react-component';

import styles from './assign-resource-modal.less';
import AssignResourceStore from './assign-resource.mobx-store';
import AutoAssignToggle from './auto-assign-toggle.react-component';
import Due from './due.react-component';

@observer
class InternalAssignResourceModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        resourceId: PropTypes.number.isRequired,
        shareData: PropTypes.object.isRequired,
        resourceType: PropTypes.string.isRequired,
        /* where the modal was rendered */
        context: PropTypes.string.isRequired,
        isAutoAssignedEnabled: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        isAutoAssignedEnabled: true,
    };

    constructor(props) {
        super(props);
        const {udData} = this.props;
        this.assignStore = new AssignResourceStore(
            udData.Config.brand.organization.id,
            props.resourceId,
            this.props.resourceType,
            props.context,
            {
                Config: udData.Config,
                me: udData.me,
                gettext: props.gettext,
            },
        );
        this.isAutoAssignedEnabled = props.isAutoAssignedEnabled;
    }

    onClose = () => {
        this.assignStore.resetModalValues();
        return this.props.onClose();
    };

    get shouldDisplayAutoAssignToggle() {
        const {isAllUsersSelected, selectedGroups} = this.assignStore;

        return this.isAutoAssignedEnabled && (isAllUsersSelected || selectedGroups.length >= 1);
    }

    get notificationTitle() {
        const {gettext, ninterpolate} = this.props;
        if (this.assignStore.isAllUsersSelected) {
            return gettext('Auto-assign rule created for all users.');
        }

        const numSelectedGroups = this.assignStore.selectedGroups.length;

        return ninterpolate(
            'Auto-assign rule created for %(numSelectedGroups)s group.',
            'Auto-assign rule created for %(numSelectedGroups)s groups.',
            numSelectedGroups,
            {numSelectedGroups},
        );
    }

    renderAutoAssignAlertBanner = (successMessage, messageClass) => {
        const successMessageComponent = (
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'assign-resource-modal:auto-assign-alert-banner-toast',
                    html: successMessage,
                })}
            ></div>
        );

        const bannerAlertProps = {
            udStyle: messageClass,
            title: this.notificationTitle,
            body: successMessageComponent,
            ctaText: this.props.gettext('Manage auto-assign rules'),
            onAction: () => {
                window.location.href = '/organization-manage/assigned/auto-assign-rules/';
            },
        };
        toasterStore.addAlertBannerToast(bannerAlertProps);
        this.onClose();
    };

    renderAlertBannerToast = (successMessage, messageClass) => {
        const successMessageComponent = (
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'assign-resource-modal:alert-banner-toast',
                    html: successMessage,
                })}
            ></div>
        );

        const bannerAlertProps = {
            udStyle: messageClass,
            title: successMessageComponent,
            showCta: false,
        };
        toasterStore.addAlertBannerToast(bannerAlertProps, {
            autoDismiss: true,
        });
        this.onClose();
    };

    assignResource = () => {
        return this.assignStore.assignResource().then(([successMessage, messageClass]) => {
            if (successMessage) {
                if (this.assignStore.isAutoAssignEnabled) {
                    return this.renderAutoAssignAlertBanner(successMessage, messageClass);
                }
                return this.renderAlertBannerToast(successMessage, messageClass);
            }
        });
    };

    onChangeMessage = (event) => {
        this.assignStore.setSenderMessage(event.target.value);
    };

    onOpen = () => {
        this.assignStore.getHasActiveAutoAssignRule();
        this.assignStore.getTotalNumberOfLicensedUsers();
        this.assignStore.checkCanAutoAssignCourse();
    };

    renderUserAndGroupInput() {
        return (
            <>
                {this.assignStore.errorMessage && (
                    <AlertBanner
                        className={styles.alert}
                        udStyle="error"
                        showCta={false}
                        title={this.assignStore.errorMessage}
                    />
                )}
                <Provider store={this.assignStore}>
                    <UserAndGroupAutocomplete context={ASSIGN_MODAL} />
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
                onOpen={this.onOpen}
                title={
                    getAssignResourceModalFields(gettext)[this.assignStore.resourceType].modalTitle
                }
            >
                {this.props.resourceType === RESOURCE_TYPES.COURSE && (
                    <CourseRetirementModalAlert
                        courseId={this.props.resourceId}
                        modalType={RETIREMENT_ALERT_MODAL_TYPES.ASSIGN}
                        isSubmitting={this.assignStore.isAssigning}
                    />
                )}
                {this.renderUserAndGroupInput()}

                {this.shouldDisplayAutoAssignToggle && (
                    <AutoAssignToggle assignStore={this.assignStore} />
                )}

                <ResourcePreview
                    resourceId={this.props.resourceId}
                    resourceType={this.props.resourceType}
                    shareData={this.props.shareData}
                    onChangeMessageCallback={this.onChangeMessage}
                    defaultMessage={this.assignStore.defaultAssignMessage}
                    className="modal--resource-preview"
                />

                <Due
                    className={styles['form-group']}
                    store={this.assignStore}
                    data-purpose="due-component"
                />

                <FooterButtons>
                    <Button onClick={this.onClose} udStyle="ghost">
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        disabled={
                            this.assignStore.disableSubmitButton ||
                            !this.assignStore.hasSelectedAnyValue ||
                            this.assignStore.isAssigning
                        }
                        udStyle="primary"
                        data-purpose="assign-button"
                        onClick={this.assignResource}
                    >
                        {this.assignStore.isAssigning ? gettext('Assigning...') : gettext('Assign')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}

const AssignResourceModal = withUDData(withI18n(InternalAssignResourceModal));
export default AssignResourceModal;
