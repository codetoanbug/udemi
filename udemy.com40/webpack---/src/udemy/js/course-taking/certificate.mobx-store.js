import autobind from 'autobind-decorator';
import {action, computed, observable, when} from 'mobx';

import {showErrorToast} from 'course-taking/toasts';
import udApi from 'utils/ud-api';

import Certificate from './certificate.mobx-model';
import * as constants from './constants';

export default class CertificateStore {
    // Assign props to make them observable so component can react on re-assignment
    @observable certificates = constants.CERTIFICATES_TYPES.reduce((acc, type) => {
        acc[type] = null;
        return acc;
    }, {});

    @computed
    get certificate() {
        return this.certificates[constants.CERTIFICATE_TYPE_UDEMY];
    }

    @computed
    get cpeCertificate() {
        return this.certificates[constants.CERTIFICATE_TYPE_NASBA];
    }

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;

        when(() => courseTakingStore.isCourseCompleted, this.loadCertificate);
    }

    get isCertificateEnabled() {
        // Course certificates may be disabled due to the following reasons:
        // 1. Disabled by instructor - UFB-internal courses only
        // 2. Free course that is enrolled after March 17, 2020
        const {enrollment, course} = this.courseTakingStore;

        let availableFeatures = [];
        if (enrollment) {
            availableFeatures = enrollment.availableFeatures;
        } else {
            availableFeatures = course.availableFeatures;
        }
        return availableFeatures.includes(constants.AVAILABLE_FEATURES.CERTIFICATE);
    }

    @computed
    get availableCertificateTypes() {
        const types = [constants.CERTIFICATE_TYPE_UDEMY];
        if (this.courseTakingStore.course.isCpeCompliant) {
            types.push(constants.CERTIFICATE_TYPE_NASBA);
        }
        return types;
    }

    @computed
    get areCertificatesLoaded() {
        return this.availableCertificateTypes.every((type) => !!this.certificates[type]);
    }

    @computed
    get isCertificateReady() {
        return this.availableCertificateTypes.every(
            (type) => this.certificates[type] && this.certificates[type].isReady,
        );
    }

    @autobind
    loadCertificate(shouldRetry = true) {
        if (!this.courseTakingStore.course.hasCertificate || this.areCertificatesLoaded) {
            return;
        }
        this.checkCertificateReady(shouldRetry);
    }

    @autobind
    checkCertificateReady(shouldRetry = true) {
        return udApi
            .get('/users/me/certificates/', {
                params: {
                    course: this.courseTakingStore.courseId,
                },
            })
            .then(({data}) => {
                if (data.results === undefined) {
                    showErrorToast(
                        gettext(
                            'There was a problem generating your certificate, please contact Support for assistance.',
                        ),
                    );
                    return;
                }

                data.results.forEach((certificateData) => {
                    this.attachCertificate(certificateData);
                });

                if (shouldRetry && !this.isCertificateReady) {
                    this.scheduleNextCertificateCheck();
                }
            });
    }

    scheduleNextCertificateCheck() {
        setTimeout(this.checkCertificateReady, constants.CERTIFICATE_READY_POLLING_INTERVAL);
    }

    @action
    attachCertificate(apiData) {
        this.certificates[apiData.type] = new Certificate(apiData);
    }
}
