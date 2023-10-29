import {getUniqueId} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {UFB_TRIAL_EXTENSION_SIGN_UP_URL, UFB_ROUTES} from 'organization-common/constants';
import {RESTRICTED_REGIONS} from 'organization-team-plan-billing/constants';
import {generateDemoURL} from 'organization-team-plan-billing/helpers';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

const udConfig = getConfigData();

export default class ExpiredModalStore {
    constructor(props) {
        this.logoutUrl = props.logoutUrl;
        this.organizationId = props.organizationId;
        this.expirationData = props.expirationData;
        this.window = props.window || window;
        this.isLimitedConsumptionTrial =
            udConfig.brand.has_organization &&
            udConfig.brand.organization.is_limited_consumption_trial;
        this.packageRemainingDays = props.packageRemainingDays;
        this.setModalContent(this.expirationData.modalContent);

        // show modal when payment modal is closed
        // @todo: this is temp solution. Remove this when payment modal
        // is migrated to react
        window.ufbExpiredModal = this;
        window.ufbPaymentModalClosing = () => {
            window.ufbExpiredModal.setShowModal(true);
        };
    }

    @observable showModal = true;
    @observable modalContent = null;
    @observable errorMessage = '';
    @observable loading = false;
    @observable feedbackIcon = 'expired';
    modalTitleId = getUniqueId('expired-modal-title');

    @observable billingCountry;
    @observable loadingBillingCountry = false;

    @autobind
    @action
    setErrorMessage(message) {
        this.errorMessage = message;
    }

    @autobind
    @action
    setLoading(loading) {
        this.loading = loading;
    }

    @autobind
    @action
    setModalContent(step) {
        this.modalContent = step;
    }

    @autobind
    @action
    setShowModal(show) {
        this.showModal = show;
    }

    @autobind
    @action
    setFeedbackIcon(icon) {
        this.feedbackIcon = icon;
    }

    redirectToPayment() {
        this.window.location.href = UFB_ROUTES.orgManageBillingPayment;
    }

    redirectToSignUp() {
        this.window.location.href = UFB_TRIAL_EXTENSION_SIGN_UP_URL;
    }

    @autobind
    redirectToDemoRequest() {
        this.window.location.href = generateDemoURL({ref: 'indupgrade'});
    }

    @autobind
    extendTeamPlan(reasonId) {
        this.setLoading(true);
        this.setErrorMessage('');
        const url = `/team-organizations/${this.organizationId}/extending-team-plan/`;
        return udApi
            .post(url, {marketoListId: reasonId})
            .then(() => {
                // since it is refreshed we don't need to set loading to false
                // refresh
                this.window.location.reload();
            })
            .catch((err) => {
                let error = '';
                if (!err.response) {
                    error = err.message;
                } else {
                    error = err.response.data.detail;
                }
                this.setLoading(false);
                this.setErrorMessage(error);
            });
    }

    @action
    async fetchBillingCountry() {
        this.loadingBillingCountry = true;

        const paymentDetailsUrl = `/team-organizations/${this.organizationId}/payment-details/`;
        try {
            const response = await udApi.get(paymentDetailsUrl);
            runInAction(() => {
                this.billingCountry = response.data.addressCountry;
            });
        } catch (error) {
            this.setErrorMessage(error.message);
        } finally {
            runInAction(() => {
                this.loadingBillingCountry = false;
            });
        }
    }

    @computed
    get isRegionRestricted() {
        return RESTRICTED_REGIONS.has(this.billingCountry);
    }
}
