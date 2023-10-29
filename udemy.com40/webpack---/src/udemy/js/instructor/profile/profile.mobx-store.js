import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {showErrorToast, showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage, parseError} from 'utils/ud-api';

const udConfig = getConfigData();

export default class ProfileStore {
    constructor(window) {
        this.window = window;
    }

    @observable _dirty = false;
    @observable languageList = [];
    @observable isUFBProfileVisible = true;
    @observable isUFBProfileEditable = true;
    @observable userImage = '';
    @observable errors = {};
    @observable uploadedUserImageKey = null;
    @observable hasLoadedPrivacySettings = false;
    @observable userImageS3Data = null;
    @observable isSubmitting = false;
    @observable isPublishedInstructor = false;
    @observable isUserProfileLoaded = false;
    @observable
    data = {
        name: '',
        surname: '',
        locale: '',
        description: '',
        jobTitle: '',
        urlPersonalWebsite: '',
        twitterProfile: '',
        facebookProfile: '',
        linkedInProfile: '',
        youtubeProfile: '',
        profileVisible: false,
        courseListVisible: false,
        isSCIMManaged: false,
    };

    originalLocale = '';

    get allowChangePrivacySettings() {
        return !udConfig.brand.has_organization || udConfig.brand.is_profile_functions_enabled;
    }

    get allowChangeUserProfile() {
        return (
            (!udConfig.brand.has_organization || udConfig.brand.is_profile_functions_enabled) &&
            !this.isSCIMManaged &&
            this.isUFBProfileEditable
        );
    }

    @autobind
    @action
    setData(fieldName, fieldValue) {
        this.data[fieldName] = fieldValue;
        this._dirty = true;
    }

    @autobind
    @action
    setDescription(value) {
        this.data.description = value;
        this._dirty = true;
    }

    @computed
    get imageCropRequiredBeforeSubmit() {
        if (!this.uploadedUserImageKey) {
            return false;
        }
        if (!this.userImageS3Data) {
            return true;
        }
        return this.uploadedUserImageKey !== this.userImageS3Data.key;
    }

    @computed
    get canSubmit() {
        return (this.isWarning || this._dirty) && !this.imageCropRequiredBeforeSubmit;
    }

    @autobind
    initializeUserProfile() {
        this.getUserProfile();
        this._getLanguages();
    }

    @autobind
    @action
    async getUserProfile() {
        const response = await udApi.get('/users/instructor-profile/me/', {
            params: {
                'fields[user]':
                    'name,surname,description,locale,job_title,url_personal_website,twitter_profile,' +
                    'facebook_profile,linkedin_profile,youtube_profile,is_ufb_profile_visible,is_ufb_profile_editable,is_scim_managed,' +
                    'is_published_instructor',
            },
        });
        runInAction(() => {
            const data = this.data;
            data.name = response.data.name;
            data.surname = response.data.surname;
            data.locale = response.data.locale;
            data.jobTitle = response.data.job_title;
            data.description = response.data.description;
            data.urlPersonalWebsite = response.data.url_personal_website;
            data.twitterProfile = response.data.twitter_profile;
            data.facebookProfile = response.data.facebook_profile;
            data.linkedInProfile = response.data.linkedin_profile;
            data.youtubeProfile = response.data.youtube_profile;
            this.isPublishedInstructor = response.data.is_published_instructor;
            this.isUFBProfileVisible = response.data.is_ufb_profile_visible;
            this.isUFBProfileEditable = response.data.is_ufb_profile_editable;
            this.originalLocale = response.data.locale;
            this.isSCIMManaged = response.data.is_scim_managed;
            this.isUserProfileLoaded = true;
        });
    }

    @autobind
    @action
    async updateUserProfile() {
        this.isSubmitting = true;
        const submitData = {
            name: this.data.name,
            surname: this.data.surname,
            description: this.data.description,
            locale: this.data.locale,
            job_title: this.data.jobTitle,
            url_personal_website: this.data.urlPersonalWebsite,
            twitter_profile: this.data.twitterProfile,
            facebook_profile: this.data.facebookProfile,
            linkedin_profile: this.data.linkedInProfile,
            youtube_profile: this.data.youtubeProfile,
            ignore_warnings: this.isWarning,
        };
        this.errors = {};
        try {
            await udApi.patch('/users/instructor-profile/me/', submitData);
            runInAction(() => {
                showSuccessToast(gettext('Your changes have been successfully saved.'));
                this._dirty = false;
                this.isSubmitting = false;
            });
        } catch (error) {
            runInAction(() => {
                const errorFields = Object.keys(error.response.data);
                this.errors = this._filterWarnings(parseError(error), errorFields);
                if (
                    error.response &&
                    error.response.data &&
                    Object.keys(error.response.data).length > 0
                ) {
                    showErrorToast(
                        gettext('Your changes have not been saved. Please address the issues.'),
                    );
                    this._dirty = false;
                } else {
                    showReloadPageErrorToast(defaultErrorMessage);
                }
                this.isSubmitting = false;
            });
        }
    }

    @computed
    get isWarning() {
        return Boolean(
            this.errors && this.errors.description && this.errors.description[0].type === 'warning',
        );
    }

    _filterWarnings(errors, errorFields) {
        // we remove warning if another real errors are involve.
        if (!errors.description) {
            return errors;
        }
        const isWarning = errors.description[0].type === 'warning';
        if (errorFields.length > 1 && isWarning) {
            delete errors.description;
        }
        return errors;
    }

    @autobind
    @action
    async getUserProfilePhoto() {
        const response = await udApi.get('/users/me/', {
            params: {
                'fields[user]': 'image_200_H',
            },
        });
        runInAction(() => {
            this.userImage = response.data.image_200_H;
        });
    }

    @autobind
    @action
    setUserImage(s3Data) {
        this.userImageS3Data = s3Data;
        this.userImage = s3Data.url;
        this._dirty = true;
    }

    @autobind
    @action
    setUploadedImageKey(imageData) {
        this.uploadedUserImageKey = imageData.key;
    }

    @autobind
    @action
    async updateUserImage() {
        this.isSubmitting = true;
        const submitData = {
            image_file: this.userImageS3Data ? this.userImageS3Data : undefined,
        };
        this.errors = {};
        try {
            await udApi.patch('/users/me/', submitData);
            runInAction(() => {
                showSuccessToast(gettext('Your changes have been successfully saved.'));
                this._dirty = false;
                this.isSubmitting = false;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @autobind
    @action
    async getUserPrivacySettings() {
        const response = await udApi.get('/users/me/', {
            params: {
                'fields[user]': 'profile_visible,course_list_visible',
            },
        });
        runInAction(() => {
            const data = this.data;
            data.profileVisible = response.data.profile_visible;
            data.courseListVisible = response.data.course_list_visible;
            this.hasLoadedPrivacySettings = true;
        });
    }

    @autobind
    @action
    async updateUserPrivacySetting() {
        this.isSubmitting = true;
        const submitData = {
            profile_visible: this.data.profileVisible,
            course_list_visible: this.data.courseListVisible,
        };
        this.errors = {};
        try {
            await udApi.patch('/users/me/', submitData);
            runInAction(() => {
                showSuccessToast(gettext('Your changes have been successfully saved.'));
                this._dirty = false;
                this.isSubmitting = false;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @action
    async _getLanguages() {
        const response = await udApi.get('/locales/', {
            params: {
                supported_languages: true,
                page_size: 999, // default pagination returns a truncated list of supported locales
                ordering: 'title',
            },
        });
        runInAction(() => {
            this.languageList = response.data.results;
        });
    }
}
