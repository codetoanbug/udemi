import autobind from 'autobind-decorator';
import {action, observable, computed, runInAction} from 'mobx';

import Caption from 'caption/caption.mobx-model';
import {CAPTION_STATUS_CHOICES, CAPTION_TYPES} from 'caption/constants';
import S3Uploader, {captionsUrl} from 'caption/s3-uploader';
import udApi from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';

import {
    ALERT_CODES,
    AUTO_TRANSCRIPTION_LANGUAGES,
    AUTO_TRANSLATION_LANGUAGES,
    AVAILABILITY,
    CAPTION_TABS,
    ALLOWED_ASSET_TYPES,
    EMPTY_GROUP,
    PROMO_VIDEO_EMPTY_GROUP,
    CAPTION_REQUEST_FIELDS,
    DRAFT_CAPTION_REQUEST_FIELDS,
    BASE_CURRICULUM_REQUEST_PARAMS,
    BASE_LOCALE_REQUEST_PARAMS,
    DEFAULT_TIMEOUT_FOR_INTERACTION,
    ALLOWED_CURRICULUM_TYPES,
    COURSE_TRANSLATION_TYPE_NAME,
    PROMO_VIDEO_ID,
    CAPTION_SOURCES,
} from './constants';

export function captionsDownloadUrl(courseId, localeId) {
    return `/courses/${courseId}/download-captions/?locale=${localeId}`;
}

export default class CaptionsManageStore {
    @observable activeTab = CAPTION_TABS.ALL;
    @observable currentLanguageLoaded = false;
    @observable lecturesLoaded = false;
    @observable isLanguageCourse = false;
    @observable curriculumList = [];
    @observable localeList = [];
    @observable defaultLocaleId = null;
    @observable currentLocaleId = null;
    @observable translationRecords = {};
    @observable togglingAvailability = false;
    @observable isBulkDownloadModalVisible = false;
    @observable seenSystemMessages = {};

    @observable isEditorFeedbackSurveyVisible = false;

    captions = observable.map();
    relativePath = null;
    initialLocaleId = null;
    // The app can be used from any other React app that also uses React Router. To support this we
    // allow for a custom URL format.
    editorUrlFormat = '/:localeId/edit/:lectureId/';

    constructor(courseId, awsAccessKey, bucketUrl, relativePath) {
        this.courseId = courseId;
        this.fileUploader = new S3Uploader(courseId, {
            key: awsAccessKey,
            bucketUrl,
            sizeLimit: 0,
            acl: 'private',
        });
        this.relativePath = relativePath;
    }

    @action
    _setupUploadStatus(lecture) {
        lecture.uploadStatus = observable.map({});
        return lecture;
    }

    /**
     * Returns the caption object for the given `lecture` and current selected locale.
     */
    getCaptionsFor(lecture) {
        const captions = Array.from(this.captions.values())
            .filter(
                (caption) =>
                    (caption.assetId === lecture.asset_id ||
                        // caption may not be related to main asset but child asset for VideoMashup Lecture
                        lecture.child_assets?.some(
                            (childAsset) => childAsset.id === caption.assetId,
                        )) &&
                    caption.locale === this.currentLocaleId,
            )
            .sort((captionA, captionB) => {
                // We need to sort the captions of a lecture based on caption source priority
                // which is as follows (highest to lowest):
                // managed, manual, auto
                return CAPTION_SOURCES[captionA.source] <= CAPTION_SOURCES[captionB.source]
                    ? -1
                    : 1;
            });

        return captions[0];
    }

    getCaptionsForLocale(localeId) {
        return Array.from(this.captions.values()).filter((caption) => caption.locale === localeId);
    }

    _promoVideoChapter(promoAssetPseudoLecture) {
        const lecture = this._setupUploadStatus(promoAssetPseudoLecture);

        return {
            ...PROMO_VIDEO_EMPTY_GROUP,
            items: [lecture],
        };
    }

    _groupByChapter(curriculumItems) {
        if (curriculumItems.length === 0) {
            return [];
        }

        // Some courses don't have a chapter as the first item
        const curriculum =
            curriculumItems[0]._class === 'chapter' ? [] : [{...EMPTY_GROUP, items: []}];

        return curriculumItems.reduce((acc, curriculumItem) => {
            if (curriculumItem._class === 'chapter') {
                acc.push({
                    id: curriculumItem.id,
                    title: curriculumItem.title,
                    items: [],
                });
            } else if (
                curriculumItem.asset_id &&
                ALLOWED_ASSET_TYPES.includes(curriculumItem.asset.asset_type)
            ) {
                acc[acc.length - 1].items.push(this._setupUploadStatus(curriculumItem));
            }

            return acc;
        }, curriculum);
    }

    _cleanError(lecture, localeId) {
        const uploadStatus = lecture.uploadStatus.get(localeId);
        if (uploadStatus) {
            delete uploadStatus.error;
        }
    }

    @action
    setEditorUrlFormat(format) {
        this.editorUrlFormat = format;
    }

    getEditorUrl(lectureId) {
        return (
            this.relativePath +
            this.editorUrlFormat
                .replace(':localeId', this.currentLocaleId)
                .replace(':lectureId', lectureId)
        );
    }

    @autobind
    @action
    setActiveTab(tab) {
        this.activeTab = tab;
    }

    @autobind
    @action
    _setContentAsLoaded() {
        this.lecturesLoaded = true;
        this.currentLanguageLoaded = true;
    }

    _setLoadingForAWhile() {
        // we fake load time because it is not data to change and the user experience suggest to notify the change to the user. For example
        // with the a loading icon.
        this.lecturesLoaded = false;
        setTimeout(this._setContentAsLoaded, DEFAULT_TIMEOUT_FOR_INTERACTION);
    }

    /**
     * Sets the current Locale to the given LocaleId. It will fetch all the captions beside promo video captions,
     * for the given locale if they don't exists already.
     */
    @autobind
    @action
    setLocale(localeId) {
        const locale = this.localeTitles[localeId] ? localeId : this.defaultLocaleId;

        // Only set the locale if different, otherwise we can get into an infinite loop via
        // App and CaptionsHeader's willReceiveProps.
        if (this.currentLocaleId !== locale) {
            // Since we set the promo video caption separately, `this.captions` might have a single
            // entry for the localeId which is promo caption. So we need to check if it's tha case
            // we still need to load the rest of captions for the localeId
            if (this.getCaptionsForLocale(locale).length <= 1) {
                this.lecturesLoaded = false;
                return this.fetchCaptions(locale).finally(
                    action(() => {
                        this.currentLocaleId = locale;
                        this.lecturesLoaded = true;
                    }),
                );
            }

            // Prevent errors when someone goes to /captions/fake_af/
            this.currentLocaleId = locale;
            return Promise.resolve(this._setLoadingForAWhile());
        }
    }

    @autobind
    addNewLocale(localeId) {
        return udApi
            .post(
                `courses/${this.courseId}/translations/`,
                {
                    locale: localeId,
                },
                {
                    params: {
                        'fields[course_translation]': '@all',
                    },
                },
            )
            .then(
                action((response) => {
                    const translation = response.data;
                    this.translationRecords = Object.assign({}, this.translationRecords, {
                        [translation.locale.locale]: translation,
                    });
                }),
            );
    }

    @autobind
    @action
    removeLocale() {
        const localeId = this.translationRecord.locale.locale;
        this.lecturesLoaded = false;
        return udApi
            .delete(`courses/${this.courseId}/translations/${localeId}/`)
            .then(() => this.removeDraftCaptionsForLocale())
            .then(
                action(() => {
                    this.removeCaptionsForLocale(localeId);
                    this.setLocale(this.defaultLocaleId);

                    delete this.translationRecords[localeId];
                    // Adding this line to update the dropdown menu, reassigning the observable property
                    // Object.assign is necessary because it is not a plain object
                    this.translationRecords = Object.assign({}, this.translationRecords);
                    // We don't restore this.lecturesLoaded automatically to create a UX effect.
                    return this.currentLocaleId;
                }),
            );
    }

    async removeDraftCaptionsForLocale() {
        await udApi.delete(
            `/courses/${this.courseId}/draft-captions/?locale=${this.translationRecord.locale.locale}`,
        );
    }

    @action
    setInitialLocaleId(localeId) {
        this.initialLocaleId = localeId;
        this.currentLocaleId = localeId;
    }

    @autobind
    @action
    async fetchCaptions(localeId) {
        try {
            const captionsResponse = await udApi.get(`/courses/${this.courseId}/captions/`, {
                params: {
                    ...CAPTION_REQUEST_FIELDS,
                    locale: localeId,
                },
            });
            const draftCaptions = await this.fetchDraftCaptions(localeId);
            runInAction(() => {
                this.captions.clear();
                this._setupPromoCaptions();
                this.groupCaptionsById(captionsResponse.data.results);
                this.updateCaptionStatusByDraftCaptions(draftCaptions);
            });
        } catch (err) {
            if (err.response.status === 404) {
                window.location.href = window.location.href.replace(
                    this.currentLocaleId,
                    this.defaultLocaleId,
                );
                return [];
            }
            throw err;
        }
    }

    @autobind
    @action
    async fetchDraftCaptions(localeId) {
        const response = await udApi.get(`/courses/${this.courseId}/draft-captions/`, {
            params: {
                ...DRAFT_CAPTION_REQUEST_FIELDS,
                locale: localeId,
            },
        });
        return response.data.results;
    }

    @autobind
    @action
    async refreshCaptions() {
        runInAction(async () => {
            if (this.course.promo_asset) {
                await this.fetchCourse();
            }
            this.fetchCaptions(this.currentLocaleId);
        });
    }

    @autobind
    @action
    updateCaptionStatusByDraftCaptions(draftCaptions) {
        draftCaptions.forEach((draftCaption) => {
            if (draftCaption.status !== 0) return;
            const caption = this.captions.get(draftCaption.published_caption_id);
            if (!caption) {
                this.prepareCaptionFromDraftCaption(draftCaption);
            } else if (
                new Date(caption.modified).getTime() > new Date(draftCaption.modified).getTime()
            ) {
                return null;
            } else {
                caption.status = CAPTION_STATUS_CHOICES.PROCESSING;
            }
        });
    }

    @autobind
    @action
    prepareCaptionFromDraftCaption(draftCaption) {
        // create captions that are not already exist in db. This is for un-captioned lectures.
        const caption = new Caption({
            ...draftCaption,
            status: CAPTION_STATUS_CHOICES.PROCESSING,
            id: draftCaption.published_caption_id || draftCaption.id,
        });
        this.captions.set(caption.id, caption);
    }

    @autobind
    @action
    removeCaptionsForLocale(localeId) {
        const captionIds = this.getCaptionsForLocale(localeId).map((x) => x.id);
        return captionIds.map((id) => this.captions.delete(id));
    }

    @autobind
    @action
    groupCaptionsById(captions) {
        return captions.reduce((acc, caption) => {
            acc.set(caption.id, new Caption(caption));
            return acc;
        }, this.captions);
    }

    groupCaptionsByAssetId(captions, baseCaptions = {}) {
        if (captions) {
            return captions.reduce((acc, caption) => {
                acc[caption.assetId] = caption;
                return acc;
            }, baseCaptions);
        }

        return baseCaptions;
    }

    @autobind
    @action
    fetchCourse() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    ...CAPTION_REQUEST_FIELDS,
                    // Promot assets fields.
                    'fields[asset]': 'asset_type,id,captions',
                    'fields[course]':
                        'can_edit,primary_subcategory,promo_asset,locale,is_published,' +
                        'organization_id,is_in_any_ufb_content_collection,is_language_course',
                    'fields[locale]': '@default',
                },
            })
            .then(
                action(({data}) => {
                    this.course = data;
                    return data;
                }),
            );
    }

    @autobind
    @action
    fetchSeenMessages() {
        return udApi
            .get(`/users/me/system-messages/localization-messages/${this.courseId}/seen/`)
            .then(
                action(({data}) => {
                    this.seenSystemMessages = data;
                }),
            );
    }

    @autobind
    @action
    fetchTranslations() {
        return udApi
            .get(`/courses/${this.courseId}/translations/`, {
                params: {
                    ...BASE_LOCALE_REQUEST_PARAMS,
                    'fields[course_translation]': '@all',
                },
            })
            .then(
                action((response) => {
                    this.translationRecords = response.data.results.reduce((items, item) => {
                        items[item.locale.locale] = item;
                        return items;
                    }, {});
                }),
            );
    }

    @autobind
    @action
    fetchCurriculumItems() {
        const curriculumParams = {
            params: {
                ...BASE_CURRICULUM_REQUEST_PARAMS,
                page_size: 999,
                asset_types: ALLOWED_ASSET_TYPES.join(','),
                curriculum_types: ALLOWED_CURRICULUM_TYPES.join(','),
                'fields[lecture]':
                    'title,type,object_index,sort_order,is_published,asset_id,asset,child_assets',
            },
        };

        return udApi
            .get(`/courses/${this.courseId}/instructor-curriculum-items/`, curriculumParams)
            .then((response) => response.data.results);
    }

    @autobind
    @action
    loadCaptionsAndCurriculumItems() {
        return Promise.all([
            this.fetchCaptions(this.currentLocaleId),
            this.fetchCurriculumItems(),
            this.fetchTranslations(),
            this.fetchSeenMessages(),
        ]);
    }

    @autobind
    @action
    fetchLocales() {
        return udApi
            .get('/locales/', {
                params: BASE_LOCALE_REQUEST_PARAMS,
            })
            .then(
                action(({data}) => {
                    this.localeList = data.results;
                    return data.results;
                }),
            );
    }

    @autobind
    @action
    _setupLocale([course]) {
        this.isLanguageCourse = course.is_language_course;

        this.defaultLocaleId = course.locale.locale;
        if (!this.currentLocaleId) {
            this.currentLocaleId = this.localeTitles[this.initialLocaleId]
                ? this.initialLocaleId
                : this.defaultLocaleId;
        }
    }

    @autobind
    @action
    _setupPromoCaptions() {
        if (this.course.promo_asset) {
            this.course.promo_asset.captions.map((captionData) => {
                const caption = new Caption({asset_id: this.course.promo_asset.id, ...captionData});
                const draftCaption = this.captions.get(caption.id);
                if (draftCaption) {
                    caption.status = draftCaption.status;
                }
                this.captions.set(caption.id, caption);
                return caption;
            });
        }
    }

    @autobind
    @action
    _createPromoLecture() {
        if (this.course.promo_asset) {
            const promoAssetPseudoLecture = {
                isPromoVideo: true,
                is_published: true,
                title: gettext('Promotional video'),
                id: PROMO_VIDEO_ID,
                asset_id: this.course.promo_asset.id,
                asset: {
                    ...this.course.promo_asset,
                },
            };

            return this._promoVideoChapter(promoAssetPseudoLecture);
        }
    }

    @autobind
    _setupTranslationRecord() {
        if (!this.translationRecord) {
            // No translation record exists for the selected locale -> create it.
            this.addNewLocale(this.currentLocaleId).then(() => {
                this._setContentAsLoaded();
            });
        } else {
            this._setContentAsLoaded();
        }
    }

    @autobind
    @action
    _createCurriculumItems([, curriculumItems]) {
        // Note: This methods should be called AFTER setting the current and default
        // locale id.
        this._setupPromoCaptions();

        const curriculumList = this._groupByChapter(curriculumItems);
        const promoLecture = this._createPromoLecture();

        if (promoLecture) {
            curriculumList.unshift(promoLecture);
        }

        return curriculumList;
    }

    /**
     * Sets up the initial state of the store by fetching all the locales, the course, course lectures
     * and captions for the current selected locale. It sets `this.carriculumList` which contains chapters
     * and lectures entries and `this.captions` which contains a nested hashmap of localeId to a map of
     * asset_id to captions for that localeId.
     */
    @autobind
    @action
    loadLecturesAndCaptions() {
        return Promise.all([this.fetchCourse(), this.fetchLocales()])
            .then(this._setupLocale)
            .then(this.loadCaptionsAndCurriculumItems)
            .then(this._createCurriculumItems)
            .then(action((curriculumList) => (this.curriculumList = curriculumList)))
            .then(this._setupTranslationRecord);
    }

    @autobind
    @action
    toggleAvailability() {
        this.togglingAvailability = true;
        const availability =
            this.translationRecord.availability === AVAILABILITY.PUBLIC
                ? AVAILABILITY.RESTRICTED
                : AVAILABILITY.PUBLIC;
        // we will mark the "automatically disabled because of low quality" alert as "seen"
        // if a user decides to hit "Enable" while in that state anyway
        this.dismissSystemMessageAlertNotifyingServer(
            SystemMessage.ids.courseTranslationLowConfidence,
            this.translationRecord.id,
            COURSE_TRANSLATION_TYPE_NAME,
        );
        return udApi
            .patch(
                `courses/${this.courseId}/translations/${this.translationRecord.locale.locale}/`,
                {
                    availability,
                },
            )
            .then(
                action((response) => {
                    const localeId = response.data.locale.locale;
                    this.translationRecords[localeId].availability = response.data.availability;
                    this.togglingAvailability = false;
                }),
            );
    }

    hasSeenAlert(messageId) {
        if (!this.translationRecord) {
            return false;
        }
        if (!this.seenSystemMessages[messageId]) {
            return false;
        }
        return this.seenSystemMessages[messageId].includes(this.translationRecord.locale.locale);
    }

    @autobind
    @action
    dismissSystemMessageAlert(messageId) {
        if (!this.hasSeenAlert(messageId)) {
            this.seenSystemMessages[messageId].push(this.currentLocaleId);
        }
    }

    dismissSystemMessageAlertNotifyingServer(messageId, objId, objType) {
        this.dismissSystemMessageAlert(messageId);
        SystemMessage.seen(messageId, {
            obj_id: objId,
            obj_type: objType,
        });
    }

    @autobind
    @action
    deleteCaption(lecture) {
        const currentLocaleId = this.currentLocaleId;
        const oldCaption = this.getCaptionsFor(lecture);
        const id = oldCaption.id;
        oldCaption.status = CAPTION_STATUS_CHOICES.DELETING;

        this._cleanError(lecture, this.currentLocaleId);

        return new Promise((resolve, reject) => {
            udApi
                .delete(captionsUrl(this.courseId, lecture.asset.id, id, CAPTION_TYPES.PUBLISHED))
                .then(() => {
                    return udApi
                        .get(
                            captionsUrl(
                                this.courseId,
                                lecture.asset.id,
                                undefined,
                                CAPTION_TYPES.PUBLISHED,
                            ),
                            {
                                params: {
                                    ...CAPTION_REQUEST_FIELDS,
                                    locale: currentLocaleId,
                                },
                            },
                        )
                        .then(
                            action((response) => {
                                const captionData = response.data.results.shift();

                                if (captionData) {
                                    const caption = new Caption(captionData);
                                    this._addCaptionToLecture(lecture, caption);
                                }

                                this._removeCaption(id);
                                resolve();
                            }),
                        )
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     * Not all instructors that can edit captions, can edit the course.
     * This impacts the functionality surrounding deleting captions and languages.
     *
     * @returns {boolean}
     */
    get canUserEditCourse() {
        return this.course && this.course.can_edit;
    }

    @autobind
    @action
    openBulkDownloadModal() {
        this.isBulkDownloadModalVisible = true;
    }

    @autobind
    @action
    closeBulkDownloadModal() {
        this.isBulkDownloadModalVisible = false;
    }

    @autobind
    @action
    triggerBulkDownload() {
        return udApi
            .get(captionsDownloadUrl(this.courseId, this.currentLocaleId))
            .then(this.closeBulkDownloadModal);
    }

    @autobind
    _createDelayCompleteFn(lecture, localeId) {
        return action(() => {
            const uploadStatus = lecture.uploadStatus.get(localeId);
            uploadStatus.onProcess = false;
        });
    }

    _addCaptionToLecture(lecture, captionData) {
        let caption = captionData;

        if (caption) {
            if (!(caption instanceof Caption)) {
                caption = new Caption({asset_id: lecture.asset_id, ...caption});
            } else {
                caption.assetId = lecture.asset_id;
            }
            this.captions.set(caption.id, caption);
        }
    }

    _removeCaption(id) {
        this.captions.delete(id);
    }

    @autobind
    _createUploadCompleteFn(lecture, localeId) {
        return action((data) => {
            const newCaption = new Caption({
                ...data,
                source: 'manual',
                filteringTags: this.getFilteringTags(this.getCaptionsFor(lecture)),
                // TODO: Fix this to use locale_id on caption model instead
                locale: {locale: localeId},
            });

            this._addCaptionToLecture(lecture, newCaption);
            setTimeout(
                this._createDelayCompleteFn(lecture, localeId),
                DEFAULT_TIMEOUT_FOR_INTERACTION,
            );
        });
    }

    getFilteringTags(oldCaption) {
        if (oldCaption === undefined) return ['un-captioned'];
        const tags = [oldCaption.source];
        if (!oldCaption.confidenceThreshold) tags.push('low-quality');
        return tags;
    }

    @autobind
    _createProcessCompleteFn(lecture) {
        return action((status, publishedCaptionId) => {
            // After uploading the caption. We get the draft caption and the main
            // caption gets generated by a background job. So will get the
            // id of the published caption via the same api call which checks for
            // the status of the caption. That is why we are replacing the draft
            // caption with the published caption here.
            const caption = this.getCaptionsFor(lecture);
            const oldId = caption.id;

            caption.id = publishedCaptionId;
            caption.status = status;
            caption.filteringTags = null;
            this._removeCaption(oldId);
            this._addCaptionToLecture(lecture, caption);
        });
    }

    @autobind
    _createOnErrorFn(lecture, localeId) {
        return action((data) => {
            const uploadStatus = lecture.uploadStatus.get(localeId);
            uploadStatus.onProcess = false;
            uploadStatus.error = data;
        });
    }

    @autobind
    _createOnProgressFn(lecture, localeId) {
        return action((progress) => {
            const uploadStatus = lecture.uploadStatus.get(localeId);
            uploadStatus.progress = progress;
        });
    }

    @autobind
    startUpload(lecture, file) {
        return action(() => {
            this.fileUploader.upload(file, lecture.asset, this.currentLocaleId, {
                onUploadComplete: this._createUploadCompleteFn(lecture, this.currentLocaleId),
                onError: this._createOnErrorFn(lecture, this.currentLocaleId),
                onProgress: this._createOnProgressFn(lecture, this.currentLocaleId),
                onProcessComplete: this._createProcessCompleteFn(lecture, this.currentLocaleId),
            });
        });
    }

    @autobind
    @action
    replaceCaption(lecture, file) {
        lecture.uploadStatus.set(this.currentLocaleId, {
            onProcess: true,
            progress: 0,
            fileName: file.name,
        });
        setTimeout(this.startUpload(lecture, file));
    }

    @autobind
    @action
    refreshCaption(caption, lectureId) {
        const lecture = this.curriculumList
            .reduce((acc, group) => acc.concat([...group.items]), [])
            // We do == here explicitly because we don't care about type coercion, 1 == '1' should yield true
            .find((lecture) => lecture.id == lectureId);
        this._addCaptionToLecture(lecture, caption);
    }

    @autobind
    uncaptionedVideoFilter(lecture) {
        const caption = this.getCaptionsFor(lecture);
        const filterTags = caption?.filteringTags || [];
        return !caption || filterTags.includes('un-captioned');
    }

    @autobind
    autocaptionedFilter(lecture) {
        const caption = this.getCaptionsFor(lecture);
        const filterTags = caption?.filteringTags || [];
        return caption && (caption.source === 'auto' || filterTags.includes('auto'));
    }

    @autobind
    lowQualityFilter(lecture) {
        const caption = this.getCaptionsFor(lecture);
        const filterTags = caption?.filteringTags || [];
        return (
            caption &&
            ((caption.status === 1 && !caption.confidenceThreshold) ||
                filterTags.includes('low-quality'))
        );
    }

    @autobind
    addControlledEditorCloseFn(exitEditorFn) {
        this.exitEditorFn = exitEditorFn;
    }

    @autobind
    openSurvey(exitAfterSurvey) {
        this.isPreExit = exitAfterSurvey;
        this.showEditorFeedbackSurvey();
    }

    @autobind
    @action
    showEditorFeedbackSurvey() {
        this.isEditorFeedbackSurveyVisible = true;
        // When the user manually clicks the "give feedback" button, we don't want to prompt them again
        // even if they didn't complete the survey.
        SystemMessage.seen(SystemMessage.ids.captionEditorSurveyPopup);
        this.seenSystemMessages[SystemMessage.ids.captionEditorSurveyPopup] = true;
    }

    @autobind
    @action
    hideEditorFeedbackSurvey() {
        this.isEditorFeedbackSurveyVisible = false;
        if (this.isPreExit) {
            this.exitEditorFn && this.exitEditorFn();
        }
    }

    @autobind
    @action
    onEditorFeedbackSurveySubmit() {
        SystemMessage.seen(SystemMessage.ids.captionEditorSurvey);
        this.seenSystemMessages[SystemMessage.ids.captionEditorSurvey] = true;
        if (this.isPreExit) {
            this.exitEditorFn && this.exitEditorFn();
        }
    }

    @computed
    get publishedLectureCount() {
        return this.curriculumList.reduce((acc, section) => {
            return (
                acc +
                section.items.filter((lecture) => lecture.is_published && !lecture.isPromoVideo)
                    .length
            );
        }, 0);
    }

    @computed
    get lectureCount() {
        return this.curriculumList.reduce((acc, section) => {
            return acc + section.items.length;
        }, 0);
    }

    @computed
    get uncaptionedVideosCount() {
        return this.curriculumList.reduce((acc, section) => {
            return acc + section.items.filter(this.uncaptionedVideoFilter).length;
        }, 0);
    }

    @computed
    get lowQualityCount() {
        return this.curriculumList.reduce((acc, section) => {
            return acc + section.items.filter(this.lowQualityFilter).length;
        }, 0);
    }

    @computed
    get autocaptionedCount() {
        return this.curriculumList.reduce((acc, section) => {
            return acc + section.items.filter(this.autocaptionedFilter).length;
        }, 0);
    }

    @computed
    get uncaptionedPublishedLectureCount() {
        return this.curriculumList.reduce((acc, section) => {
            return (
                acc +
                section.items.filter((lecture) => {
                    return (
                        lecture.is_published &&
                        !lecture.isPromoVideo &&
                        !(
                            this.getCaptionsFor(lecture) &&
                            this.getCaptionsFor(lecture).status === CAPTION_STATUS_CHOICES.SUCCESS
                        )
                    );
                }).length
            );
        }, 0);
    }

    @computed
    get uncaptionedPublishedLectureProgress() {
        return `${this.completedLecturesCount}/${this.publishedLectureCount}`;
    }

    @computed
    get localeTitles() {
        return this.localeList.reduce((acc, locale) => {
            // eslint-disable-next-line gettext/no-variable-string
            acc[locale.locale] = gettext(locale.english_title);
            return acc;
        }, {});
    }

    @computed
    get captionedLocaleList() {
        return Object.keys(this.translationRecords)
            .reduce((acc, localeId) => {
                acc.push(localeId);
                return acc;
            }, [])
            .sort((a, b) => {
                const x = this.localeTitles[a];
                const y = this.localeTitles[b];
                return x < y ? -1 : x > y ? 1 : 0;
            });
    }

    @computed
    get isDefaultLocale() {
        return this.currentLocaleId === this.defaultLocaleId;
    }

    @computed
    get translationRecord() {
        return this.translationRecords && this.translationRecords[this.currentLocaleId];
    }

    @computed
    get translatedRecordAlertCode() {
        if (!this.translationRecord) {
            return;
        }
        if (this.translationRecord.availability === AVAILABILITY.RESTRICTED) {
            if (this.isLanguageCourse) {
                if (!this.hasSeenAlert(SystemMessage.ids.courseTranslationDisabledLanguageCat)) {
                    return ALERT_CODES.DISABLED_LANGUAGE_CATEGORY;
                }
            } else if (!this.translationRecord.caption_confidence_above_threshold) {
                if (!this.hasSeenAlert(SystemMessage.ids.courseTranslationLowConfidence)) {
                    return ALERT_CODES.LOW_QUALITY;
                }
            }
            return ALERT_CODES.DISABLED;
        }

        if (this.translationRecord.availability === AVAILABILITY.PUBLIC) {
            if (this.translationRecord.manual_caption_coverage === 1.0) {
                if (!this.hasSeenAlert(SystemMessage.ids.courseTranslationManualCoverage)) {
                    return ALERT_CODES.MANUAL_COVERAGE;
                }
            } else if (this.translationRecord.auto_caption_coverage === 1.0) {
                if (!this.hasSeenAlert(SystemMessage.ids.courseTranslationAutoCoverage)) {
                    return ALERT_CODES.AUTO_COVERAGE;
                }
            }
        }
    }

    get translationStatus() {
        return this.translationRecords[this.currentLocaleId] || {};
    }

    @computed
    get autoTranslatedCaptionMessage() {
        if (this.translationStatus.has_autogenerated_captions && !this.isDefaultLocale) {
            return ALERT_CODES.AUTO_TRANSLATED_CAPTIONS;
        }
    }

    @computed
    get autoTranslatedCaptionFailedMessage() {
        if (
            !this.isDefaultLocale &&
            this.isAutoTranslateLocale &&
            this.translationStatus.has_autogenerated_captions &&
            this.translationStatus.auto_caption_coverage < 1
        ) {
            return ALERT_CODES.INCOMPLETE_AUTO_TRANSLATED_CAPTIONS;
        }
    }

    @computed
    get autoGeneratedCaptionInstructions() {
        if (
            this.course &&
            !this.course.is_published &&
            !this.isUfbCourse &&
            this.isDefaultLocale &&
            this.isAutoTranscriptLocale &&
            this.completedLecturesCount < this.publishedLectureCount
        ) {
            return ALERT_CODES.AUTO_GENERATED_CAPTION_INSTRUCTIONS;
        }
        return null;
    }

    @computed
    get nonAutoCaptionedInstructions() {
        if (
            this.course &&
            this.isDefaultLocale &&
            (!this.isAutoTranscriptLocale || this.isUfbCourse)
        ) {
            return ALERT_CODES.REACH_MORE_STUDENT_WITH_CAPTIONS;
        }
        return null;
    }

    get newlyAddedLanguageMessage() {
        if (
            this.course &&
            !this.isDefaultLocale &&
            this.completedLecturesCount === 0 &&
            !this.isAutoTranscriptLocale
        ) {
            return ALERT_CODES.REACH_MORE_STUDENT_WITH_TRANSLATED_CAPTIONS;
        }
    }

    get alertCodes() {
        return [
            this.autoGeneratedCaptionInstructions,
            this.nonAutoCaptionedInstructions,
            this.autoTranslatedCaptionMessage,
            this.autoTranslatedCaptionFailedMessage,
            this.translatedRecordAlertCode,
            this.newlyAddedLanguageMessage,
        ].filter((x) => x);
    }

    @computed
    get filteredLocaleList() {
        return this.localeList.filter(
            (locale) =>
                !this.captionedLocaleList.find(
                    (captionedLocale) => captionedLocale === locale.locale,
                ),
        );
    }

    @computed
    get filteredCounts() {
        return {
            [CAPTION_TABS.UNCAPTIONED]: this.uncaptionedVideosCount,
            [CAPTION_TABS.LOW_QUALITY]: this.lowQualityCount,
            [CAPTION_TABS.AUTOCAPTIONED]: this.autocaptionedCount,
        };
    }

    @computed
    get isLoaded() {
        return this.currentLanguageLoaded && this.lecturesLoaded;
    }

    @computed
    get lecturesById() {
        return this.curriculumList.reduce((acc, section) => {
            section.items.forEach((lecture) => {
                acc[lecture.id] = lecture;
            });
            return acc;
        }, {});
    }

    @computed
    get completedLecturesCount() {
        return this.publishedLectureCount - this.uncaptionedPublishedLectureCount;
    }

    @computed
    get currentCountryCode() {
        return this.currentLocaleId.split('_')[0];
    }

    @computed
    get isAutoTranscriptLocale() {
        return AUTO_TRANSCRIPTION_LANGUAGES.includes(this.currentCountryCode);
    }

    @computed
    get isAutoTranslateLocale() {
        return AUTO_TRANSLATION_LANGUAGES.includes(this.currentCountryCode);
    }

    @computed
    get currentLocaleTitle() {
        return this.localeTitles[this.currentLocaleId];
    }

    @computed
    get isUfbCourse() {
        return this.course && this.course.organization_id;
    }
}
