import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';

import {showErrorToast, showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, parseError} from 'utils/ud-api';
import udLink from 'utils/ud-link';

import {BASE_LOCALE_REQUEST_PARAMS} from '../../course-captions/constants';
import LabelManagerStore from './label-manager.mobx-store';

export default class CourseBasicsStore {
    static CATEGORY_DEFAULT_VALUE = gettext('-- Select Category --');
    static SUBCATEGORY_DEFAULT_VALUE = gettext('-- Select Subcategory --');

    static instructionalLevelList = [
        {id: -1, title: gettext('-- Select Level --')},
        {id: 1, title: gettext('Beginner Level')},
        {id: 2, title: gettext('Intermediate Level')},
        {id: 3, title: gettext('Expert Level')},
        {id: 0, title: gettext('All Levels')},
    ];

    constructor(courseId) {
        this.courseId = courseId;
    }

    @observable _dirty = false;
    @observable title = '';
    @observable headline = '';
    @observable description = '';
    @observable localeList = [];
    @observable locale = 'en_US';
    @observable instructionalLevel = -1;
    @observable categoryList = [];
    @observable category = -1;
    @observable subcategoryList = [];
    @observable subcategory = -1;
    @observable anySubcategoryAvailable = false;
    @observable instructorBios = [];
    @observable errors = {};
    @observable courseImage = '';
    @observable promoAsset = null;
    @observable organizationId;
    @observable courseLoaded = false;

    @observable courseImageS3Data = null;
    @observable uploadedCourseImageKey = null;

    initializeForm() {
        this._loadLocaleList();
        this._loadCategoryList();
        this._loadCourse();
        this._loadInstructors();
    }

    @action
    _loadCourse() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'title,headline,description,locale,instructional_level_id,' +
                        'primary_category,primary_subcategory,all_course_has_labels,image_750x422,promo_asset,' +
                        'intended_category,category_locked,label_locked,category_applicable,' +
                        'label_applicable,min_summary_words,landing_preview_as_guest_url,organization_id,',
                    'fields[course_label]': '@min',
                },
            })
            .then(
                action((response) => {
                    this.title = response.data.title || '';
                    this.headline = response.data.headline || '';
                    this.description = response.data.description || '';
                    this.locale = response.data.locale.locale;
                    this.courseImage =
                        response.data.image_750x422 ||
                        udLink.toStorageStaticAsset('course/480x270/placeholder.jpg');
                    this.promoAsset = response.data.promo_asset;
                    const instructionalLevel = CourseBasicsStore.instructionalLevelList.find(
                        (item) => item.id === response.data.instructional_level_id,
                    );
                    if (instructionalLevel) {
                        this.instructionalLevel = instructionalLevel.id;
                    } else {
                        this.instructionalLevel = -1;
                    }
                    if (response.data.primary_category) {
                        this.category = response.data.primary_category.id;
                    } else if (response.data.intended_category) {
                        this.category = response.data.intended_category.id;
                    } else {
                        this.category = -1;
                    }
                    if (this.category !== -1) {
                        this._loadSubcategoryList(this.category);
                        this.subcategory = response.data.primary_subcategory
                            ? response.data.primary_subcategory.id
                            : -1;
                    }
                    this.courseHasLabels = response.data.all_course_has_labels || [];
                    this.categoryApplicable = response.data.category_applicable || false;
                    this.categoryLocked = response.data.category_locked || false;
                    this.labelApplicable = response.data.label_applicable || false;
                    this.labelLocked = response.data.label_locked || false;
                    this.minSummaryWords = response.data.min_summary_words;
                    this.labelManagerStore = new LabelManagerStore(
                        this.courseId,
                        this.courseHasLabels,
                        this.labelLocked,
                    );
                    this.previewUrl = response.data.landing_preview_as_guest_url;
                    this.organizationId = response.data.organization_id;
                    this.courseLoaded = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    _loadInstructors() {
        return udApi
            .get(`/courses/${this.courseId}/course-has-instructors/`, {
                params: {
                    'fields[course_has_instructor]': 'user,visible,has_valid_description',
                    'fields[user]': '@min,has_valid_description,image_50x50,url',
                    visible: 'True',
                    page_size: 200,
                },
            })
            .then(
                action(({data}) => {
                    this.instructorBios = data.results;
                    this.instructorBios.forEach((instructorBio) => {
                        instructorBio.hasImage = !instructorBio.user.image_50x50.includes(
                            'anonymous',
                        );
                        instructorBio.isComplete =
                            instructorBio.hasImage && instructorBio.has_valid_description;
                    });
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    _loadLocaleList() {
        return udApi
            .get('/locales/', {
                params: BASE_LOCALE_REQUEST_PARAMS,
            })
            .then(
                action((response) => {
                    this.localeList = response.data.results;
                    return response.data.results;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    _loadCategoryList() {
        return udApi
            .get('/course-categories/')
            .then(
                action((response) => {
                    this.categoryList = response.data.results;
                    this.categoryList.unshift({
                        id: -1,
                        title: CourseBasicsStore.CATEGORY_DEFAULT_VALUE,
                    });
                    return response.data.results;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    _loadSubcategoryList(category) {
        if (category > 0) {
            return udApi
                .get(`/course-categories/${category}/subcategories/`)
                .then(
                    action((response) => {
                        this.subcategoryList = response.data.results;
                        this.subcategoryList.unshift({
                            id: -1,
                            title: CourseBasicsStore.SUBCATEGORY_DEFAULT_VALUE,
                        });
                        this.anySubcategoryAvailable = true;
                        return this.subcategoryList;
                    }),
                )
                .catch(() => {
                    showReloadPageErrorToast(defaultErrorMessage);
                });
        }
        this.subcategoryList = [];
        this.anySubcategoryAvailable = false;
    }

    @autobind
    @action
    setTitle(title) {
        this.title = title;
        this._dirty = true;
    }

    @autobind
    @action
    setHeadline(headline) {
        this.headline = headline;
        this._dirty = true;
    }

    @autobind
    @action
    setDescription(description) {
        this.description = description;
        this._dirty = true;
    }

    @autobind
    @action
    setLocale(locale) {
        this.locale = locale;
        this._dirty = true;
    }

    @autobind
    @action
    setInstructionalLevel(instructionalLevel) {
        this.instructionalLevel = instructionalLevel;
        this._dirty = true;
    }

    @autobind
    @action
    setCategory(category) {
        this.category = category;
        this.subcategory = -1;
        this._loadSubcategoryList(category);
        this._dirty = true;
    }

    @autobind
    @action
    setSubcategory(subcategory) {
        this.subcategory = subcategory;
        this._dirty = true;
    }

    @autobind
    @action
    setDirty(dirty) {
        this._dirty = dirty;
    }

    @autobind
    savePromoAsset(assetData) {
        return udApi
            .post('users/me/video-assets/', {captions: [], ...assetData})
            .then((response) => {
                this.setPromoAsset(response.data);
            })
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    setPromoAsset(asset) {
        this.promoAsset = asset;
        this._dirty = true;
    }

    @autobind
    @action
    setCourseImage(s3Data) {
        this.courseImageS3Data = s3Data;
        this.courseImage = s3Data.url;
        this._dirty = true;
    }

    @autobind
    @action
    setUploadedImageKey(imageData) {
        this.uploadedCourseImageKey = imageData.key;
    }

    @computed
    get imageCropRequiredBeforeSubmit() {
        if (!this.uploadedCourseImageKey) {
            return false;
        }
        if (!this.courseImageS3Data) {
            return true;
        }
        return this.uploadedCourseImageKey !== this.courseImageS3Data.key;
    }

    @computed
    get dirty() {
        return Boolean(this._dirty || (this.labelManagerStore && this.labelManagerStore.dirty));
    }

    @computed
    get canSave() {
        return this.dirty && !this.imageCropRequiredBeforeSubmit;
    }

    @autobind
    @action
    saveForm() {
        if (this.dirty) {
            const data = {
                title: this.title || '',
                headline: this.headline || '',
                description: this.description || '',
                locale: this.locale,
                instructional_level_id:
                    this.instructionalLevel === -1 ? null : this.instructionalLevel,
                category_id: this.category === -1 ? null : this.category,
                subcategory_id: this.subcategory === -1 ? null : this.subcategory,
                labels_json: this.labelManagerStore.labelsJSON,
                promo_asset: this.promoAsset ? this.promoAsset.id : undefined,
                image_file: this.courseImageS3Data ? this.courseImageS3Data : undefined,
            };

            this.errors = {};
            return udApi
                .patch(`/courses/${this.courseId}/?category=course-basics`, data)
                .then(
                    action(() => {
                        showSuccessToast(gettext('Your changes have been successfully saved.'));
                        this._dirty = false;
                        this.labelManagerStore.captureOriginalLabelsJSON();
                        this._loadCourse();
                    }),
                )
                .catch(
                    action((error) => {
                        this.errors = parseError(error);
                        if (
                            error.response &&
                            error.response.data &&
                            Object.keys(error.response.data).length > 0
                        ) {
                            showErrorToast(
                                gettext(
                                    'Your changes have not been saved. Please address the issues.',
                                ),
                            );
                        } else {
                            showReloadPageErrorToast(defaultErrorMessage);
                        }
                    }),
                );
        }
        showSuccessToast(gettext('There are no changes to save.'));
    }
}
