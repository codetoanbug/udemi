import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, intercept, observable, reaction, set} from 'mobx';

import {showSuccessToast} from 'instructor/toasts';
import arrayMove from 'utils/array-move';
import udApi, {parseError, udParamsSerializer} from 'utils/ud-api';
import udLink from 'utils/ud-link';

import {assetTypes} from '../../../asset-library/constants';
import {
    quizDraftFilterParams,
    quizEditorFilterParams,
    quizFilterParams,
    quizTypes,
    assessmentFilterParams,
    assessmentCreationTypes,
    assessmentTypes,
    maxNumOfAssessments,
    maxLengthOfAnnouncementTitle,
    assessmentSuccessDeleteCopy,
    quizCurriculumItemSuccessDeleteCopy,
} from '../constants';
import CurriculumItemModel from '../curriculum-item.mobx-model';
import ApplyDraftFormModel from './apply-draft-form.mobx-model';
import AssessmentModel from './assessment.mobx-model';
import BulkQuestionUploaderModel from './bulk-question-uploader.mobx-model';
import QuizCreateEventFactory, {ActionsEnum as Actions} from './events';
import FITBAssessmentFormModel from './fitb-assessment-form.mobx-model';
import KnowledgeAreaFormFieldModel from './knowledge-area-form-field.mobx-model';
import MultipleChoiceAssessmentFormModel from './multiple-choice-assessment-form.mobx-model';

export default class CurriculumQuizModel extends CurriculumItemModel {
    // null means API requests have not completed.
    @observable relatedLectureOptions = null;
    @observable assessments = null;

    // These are used to show modals.
    @observable showBatchAssessmentCreationConfirmation = false;
    @observable showDiscardDraftConfirmation = false;
    @observable toBeDeletedAssessmentId = null;
    @observable showApplyDraftModal = false;

    // This is the assessment that is being either created or edited in <AddContent /> view.
    // If it is null, it means the assessment is being created.
    @observable addContentAssessment = null;

    // This is used to apply fancy highlight animation on the most recently updated or created assessment.
    @observable justUpdatedOrCreatedAssessmentId = null;

    // null means API request has not completed.
    @observable announcementRateLimit = null;

    @observable reorderingUi = {isDragging: false};

    constructor(curriculumItem) {
        super(curriculumItem);
        this.applyDraftForm = new ApplyDraftFormModel();
        this.assessmentForms = {
            [assessmentTypes.fitb]: new FITBAssessmentFormModel(),
            [assessmentTypes.multipleChoice]: new MultipleChoiceAssessmentFormModel(
                assessmentTypes.multipleChoice,
            ),
            [assessmentTypes.multipleSelect]: new MultipleChoiceAssessmentFormModel(
                assessmentTypes.multipleSelect,
            ),
        };
        this.bulkQuestionUploader = new BulkQuestionUploaderModel();
        this.knowledgeAreaFormField = new KnowledgeAreaFormFieldModel();

        reaction(this._getNumAssessments, this._setNumAssessments);
        intercept(this, 'selectedContentType', this._clearPreviouslySelectedContent);
    }

    @computed
    get keyClass() {
        return this.type;
    }

    @computed
    get successDeleteMessage() {
        if (this.type in quizCurriculumItemSuccessDeleteCopy) {
            return quizCurriculumItemSuccessDeleteCopy[this.type];
        }
        return null;
    }

    @computed
    get hasAssessmentContent() {
        return this.type !== quizTypes.codingExercise && this.num_assessments > 0;
    }

    /**
     * `num_assessments` is passed in the constructor. It lets us know whether this quiz has
     * assessments before we make the API call to actually fetch the assessments. Once
     * assessments have been fetched, `num_assessments` should always equal `assessments.length`,
     * since we fetch all assessments without pagination.
     */
    @autobind
    _getNumAssessments() {
        return this.assessments ? this.assessments.length : this.num_assessments;
    }

    @autobind
    @action
    _setNumAssessments(value) {
        this.num_assessments = value;
        if (this.num_assessments === 0) {
            this.closeEditContent();
        }
    }

    @computed
    get editCodingExerciseUrl() {
        return `/course/${this.course.id}/manage/coding-exercise/?quizId=${this.id}`;
    }

    @computed
    get editPracticeTestUrl() {
        return `/course/${this.course.id}/manage/practice-test/?quizId=${this.id}`;
    }

    @computed
    get previewAsInstructorUrl() {
        const path = this.type === quizTypes.practiceTest ? 'start' : '';
        return udLink.toCourseTaking(this.course.url, `quiz/${this.id}/${path}`, {
            instructorPreviewMode: 'instructor_v4',
        });
    }

    @computed
    get announcementTitle() {
        const template = gettext('New update to "%(title)s"');
        const title = interpolate(template, {title: this.title}, true);
        const truncateLength = title.length - maxLengthOfAnnouncementTitle;
        if (truncateLength > 0) {
            const ellipsis = '...';
            return interpolate(
                template,
                {
                    title: `${this.title.slice(
                        0,
                        this.title.length - truncateLength - ellipsis.length,
                    )}${ellipsis}`,
                },
                true,
            );
        }
        return title;
    }

    @computed
    get isPublishedAndCourseWasPublished() {
        return this.is_published && !!this.course.published_title;
    }

    /***********************************************************************************************
     * Begin "ensure editable" draft/versioning logic. The `_ensureEditable` method creates a
     * new draft of this (practice test) quiz if `this.isEditable` returns false.
     * A new quiz draft has its own set of assessment ids.
     * We use `this._currentToOriginalAssessmentId` and `this._originalToCurrentAssessmentId`
     * to figure out the assessment ids corresponding to the new quiz draft.
     *
     * Example:
     * Suppose we create an unpublished test having one assessment with id:10, and no draft yet.
     * We publish the test, then edit the assessment.
     *
     * Before calling `_ensureEditable`, we have:
     *     assessments: [{ id: 10, original_assessment_id: 0 }]
     *     _currentToOriginalAssessmentId: { 10: 10 }
     *     _originalToCurrentAssessmentId: { 10: 10 }
     *
     * `_ensureEditable` creates a draft for the test.
     *
     * After calling `_ensureEditable`, we have:
     *     assessments: [{ id: 11, original_assessment_id: 10 }]
     *     _currentToOriginalAssessmentId: { 11: 10 }
     *     _originalToCurrentAssessmentId: { 10: 11 }
     *
     * We need to send id:11 to API in order to edit the correct assessment.
     * We figure this out by using `this._currentToOriginalAssessmentId` to
     * map id:10 to id:10 before calling `_ensureEditable`, and then using
     * `this._originalToCurrentAssessmentId` to map id:10 to id:11 in the `.then()` callback.
     **********************************************************************************************/
    _ensureEditable() {
        if (this.isEditable) {
            return Promise.resolve();
        }
        return udApi
            .post(
                `/courses/${this.course.id}/quizzes/`,
                {
                    quiz_id: this.id,
                    draft_action: 'create',
                },
                {
                    params: {'fields[quiz]': quizEditorFilterParams.join(',')},
                },
            )
            .then((response) => this.refresh(response.data));
    }

    @computed
    get isEditable() {
        return (
            this.type !== quizTypes.practiceTest ||
            this.is_draft ||
            !(this.requires_draft || this.isPublishedAndCourseWasPublished)
        );
    }

    @computed
    get _currentToOriginalAssessmentId() {
        const map = {};
        (this.assessments || []).forEach((assessment) => {
            const originalId = assessment.original_assessment_id || assessment.id;
            map[assessment.id] = originalId;
        });
        return map;
    }

    @computed
    get _originalToCurrentAssessmentId() {
        const map = {};
        Object.entries(this._currentToOriginalAssessmentId).forEach(([currentId, originalId]) => {
            map[originalId] = parseInt(currentId, 10);
        });
        return map;
    }

    /***********************************************************************************************
     * End "ensure editable" draft/versioning logic.
     **********************************************************************************************/

    @autobind
    @action
    _clearPreviouslySelectedContent(change) {
        if (this.selectedContentType !== change.newValue) {
            this.addContentAssessment = null;
            this.bulkQuestionUploader.clearFile();
        }
        return change;
    }

    @autobind
    openAddContentForAssessment(assessment) {
        return udApi
            .get(`/quizzes/${this.id}/assessments/${assessment.id}/`, {
                params: {draft: true, 'fields[assessment]': assessmentFilterParams.join(',')},
            })
            .then(
                action((response) => {
                    set(assessment, response.data);
                    this.setSelectedContentType(assessment.assessment_type);
                    this.addContentAssessment = assessment;
                    this.openAddContent();
                }),
            )
            .catch(this._standardErrorHandler);
    }

    @autobind
    @action
    openBatchAssessmentCreationConfirmation() {
        this.showBatchAssessmentCreationConfirmation = true;
    }

    @autobind
    @action
    closeBatchAssessmentCreationConfirmation() {
        this.showBatchAssessmentCreationConfirmation = false;
    }

    @autobind
    @action
    confirmBatchAssessmentCreationConfirmation() {
        this.closeBatchAssessmentCreationConfirmation();
        this.setSelectedContentType(assessmentCreationTypes.batch);
    }

    @autobind
    @action
    openDeleteAssessmentConfirmation(assessmentId) {
        this.toBeDeletedAssessmentId = assessmentId;
    }

    @autobind
    @action
    closeDeleteAssessmentConfirmation() {
        this.toBeDeletedAssessmentId = null;
    }

    @action
    deleteAssessment() {
        const assessmentId = this.toBeDeletedAssessmentId;
        if (assessmentId === null) {
            return Promise.resolve();
        }
        this.closeDeleteAssessmentConfirmation();
        this.isSaving = true;
        const originalAssessmentId = this._currentToOriginalAssessmentId[assessmentId];
        return this._ensureEditable()
            .then(() => {
                const currentAssessmentId = this._originalToCurrentAssessmentId[
                    originalAssessmentId
                ];
                return udApi.delete(`/quizzes/${this.id}/assessments/${currentAssessmentId}/`).then(
                    action(() => {
                        showSuccessToast(assessmentSuccessDeleteCopy);
                        this.assessments = this.assessments.filter(
                            (assessment) => assessment.id !== currentAssessmentId,
                        );
                        this.isSaving = false;
                        return this._updateAssessmentSortOrders();
                    }),
                );
            })
            .catch(this._standardFinalEditErrorHandler);
    }

    @action
    clearJustUpdatedOrCreatedAssessmentId() {
        this.justUpdatedOrCreatedAssessmentId = null;
    }

    @autobind
    @action
    openDiscardDraftConfirmation() {
        this.showDiscardDraftConfirmation = true;
    }

    @autobind
    @action
    closeDiscardDraftConfirmation() {
        this.showDiscardDraftConfirmation = false;
    }

    @autobind
    @action
    confirmDiscardDraftConfirmation() {
        this.closeDiscardDraftConfirmation();
        this.isSaving = true;
        return udApi
            .post(
                `/courses/${this.course.id}/quizzes/`,
                {
                    quiz_id: this.id,
                    draft_action: 'discard',
                },
                {
                    params: {'fields[quiz]': quizEditorFilterParams.join(',')},
                },
            )
            .then((response) => {
                return this.refresh(response.data);
            })
            .then(
                action(() => {
                    this.isSaving = false;
                }),
            )
            .catch(this._standardFinalEditErrorHandler);
    }

    @autobind
    @action
    openApplyDraftModal() {
        this.showApplyDraftModal = true;
    }

    @autobind
    @action
    closeApplyDraftModal() {
        this.showApplyDraftModal = false;
    }

    @action
    applyDraft() {
        this.isSaving = true;
        const formData = this.applyDraftForm.data;
        return udApi
            .post(
                `/courses/${this.course.id}/quizzes/`,
                {
                    quiz_id: this.id,
                    draft_action: 'apply',
                    version_description: formData.description,
                },
                {
                    params: {'fields[quiz]': quizEditorFilterParams.join(',')},
                },
            )
            .then((response) => {
                const quiz = response.data;
                if (!formData.sendAnnouncement) {
                    return quiz;
                }
                return udApi
                    .post('/announcement-groups/', {
                        title: this.announcementTitle,
                        content: formData.description,
                        data: {
                            includes: [this.course.id],
                        },
                    })
                    .then(() => quiz)
                    .catch(
                        action((error) => {
                            this.error = parseError(error);
                            this.error.isAnnouncementError = true;
                            throw this.error;
                        }),
                    );
            })
            .catch(this._standardErrorHandler)
            .then(this.refresh)
            .then(
                action(() => {
                    this.isSaving = false;
                }),
            )
            .catch(this._standardFinalEditErrorHandler);
    }

    static create(course, data) {
        return udApi
            .post(`/courses/${course.id}/quizzes/`, data, {
                params: {
                    'fields[quiz]': quizFilterParams.join(','),
                },
            })
            .then((response) => {
                const event = QuizCreateEventFactory.create(data.type, Actions.SUCCESS, {
                    ...response.data,
                    ...{courseId: course.id},
                });
                event && Tracker.publishEvent(event);
                return new CurriculumQuizModel({...response.data, course});
            })
            .catch((error) => {
                const event = QuizCreateEventFactory.create(data.type, Actions.FAIL, {
                    message: error.message,
                    courseId: course.id,
                });
                event && Tracker.publishEvent(event);

                throw parseError(error);
            });
    }

    /**
     * @param extraFields: an array of extra fields to be updated on this quiz.
     * For example, the `requires_draft` field is derived from the `is_published` field,
     * so if we update `is_published` field, we specify `requires_draft` in `extraFields`.
     * @param ensureEditable: whether we should first call `this._ensureEditable` before
     * making the update call.
     * Some updates, such as `is_published`, do not create new drafts, so we pass
     * ensureEditable = false.
     */
    @action
    partialUpdate(data, extraFields = quizDraftFilterParams, ensureEditable = true) {
        this.isSaving = true;
        const ensureEditablePromise = ensureEditable ? this._ensureEditable() : Promise.resolve();
        return ensureEditablePromise
            .then(() => {
                return this._partialUpdate(
                    `/courses/${this.course.id}/quizzes/${this.id}/`,
                    data,
                    Object.keys(data).concat(extraFields),
                );
            })
            .catch(this._standardFinalEditErrorHandler);
    }

    delete() {
        return this._delete(`/courses/${this.course.id}/quizzes/${this.id}/`);
    }

    _createAssessment(postData) {
        return this._ensureEditable()
            .then(() => {
                return udApi.post(`/quizzes/${this.id}/assessments/`, postData, {
                    params: {
                        draft: this.is_draft,
                        'fields[assessment]': assessmentFilterParams.join(','),
                    },
                });
            })
            .then(
                action((response) => {
                    const assessment = new AssessmentModel(response.data);
                    this.justUpdatedOrCreatedAssessmentId = assessment.id;
                    this.assessments.push(assessment);
                    return assessment;
                }),
            );
    }

    _editAssessment(postData) {
        const originalAssessmentId = this._currentToOriginalAssessmentId[
            this.addContentAssessment.id
        ];
        return this._ensureEditable().then(() => {
            const currentAssessmentId = this._originalToCurrentAssessmentId[originalAssessmentId];
            return udApi
                .put(`/quizzes/${this.id}/assessments/${currentAssessmentId}/`, postData, {
                    params: {
                        draft: this.is_draft,
                        'fields[assessment]': assessmentFilterParams.join(','),
                    },
                })
                .then(
                    action((response) => {
                        const currentAssessment = this.assessments.find(
                            (a) => a.id === currentAssessmentId,
                        );
                        set(currentAssessment, response.data);
                        this.justUpdatedOrCreatedAssessmentId = currentAssessment.id;
                        return currentAssessment;
                    }),
                );
        });
    }

    @action
    updateOrCreateAssessment(postData) {
        this.isSaving = true;
        let promise;
        if (this.addContentAssessment) {
            promise = this._editAssessment(postData);
        } else {
            promise = this._createAssessment(postData);
        }
        return promise
            .then(
                action((assessment) => {
                    this.isSaving = false;
                    return assessment;
                }),
            )
            .catch(this._standardFinalEditErrorHandler);
    }

    @action
    bulkCreateAssessments(uploadData) {
        this.isSaving = true;
        return this._ensureEditable()
            .then(() => {
                return udApi.patch(
                    `/courses/${this.course.id}/quizzes/${this.id}/`,
                    {
                        bulk_question_file: JSON.stringify(uploadData),
                    },
                    {
                        params: {
                            'fields[quiz]': quizEditorFilterParams
                                .concat('num_assessments')
                                .join(','),
                        },
                    },
                );
            })
            .then((response) => {
                return this.refresh(response.data);
            })
            .then(
                action(() => {
                    this.isSaving = false;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    @action
    setReorderingUi(reorderingUi) {
        Object.keys(this.reorderingUi).forEach((key) => {
            if (key in reorderingUi) {
                this.reorderingUi[key] = reorderingUi[key];
            }
        });
    }

    @action
    reorderAssessment(oldIndex, newIndex) {
        if (oldIndex === newIndex) {
            return Promise.resolve();
        }
        if (!this.isEditable) {
            this.isSaving = true;
        }
        return this._ensureEditable()
            .then(
                action(() => {
                    // We don't set `this.isSaving = true;` when making API call to update assessment
                    // sort orders because we want the action to appear instantaneous. Hence, we do
                    // optimistic `arrayMove` update here, and revert it if API call fails.
                    this.assessments = arrayMove(this.assessments, oldIndex, newIndex);
                    this.isSaving = false;
                    return this._updateAssessmentSortOrders().catch(
                        action((error) => {
                            this.assessments = arrayMove(this.assessments, newIndex, oldIndex);
                            this._standardErrorHandler(error);
                        }),
                    );
                }),
            )
            .catch(this._standardFinalEditErrorHandler);
    }

    _updateAssessmentSortOrders() {
        if (this.assessments.length === 0) {
            return Promise.resolve();
        }
        return udApi.patch(
            `/courses/${this.course.id}/quizzes/${this.id}/`,
            {
                assessment_ids: JSON.stringify(this.assessments.map((a) => a.id)),
            },
            {params: {'fields[quiz]': '@min'}},
        );
    }

    @autobind
    @action
    refresh(quiz) {
        if (quiz) {
            set(this, quiz);
        }
        if (this.num_assessments > 0) {
            return this._refreshAssessments();
        }
        this.assessments = [];
        this.knowledgeAreaFormField.setOptions([]);
        return Promise.resolve();
    }

    _refreshAssessments() {
        return udApi
            .get(`/quizzes/${this.id}/assessments/`, {
                params: {
                    page_size: maxNumOfAssessments,
                    'fields[assessment]': assessmentFilterParams
                        .concat('original_assessment_id')
                        .join(','),
                    draft: true,
                },
            })
            .then(
                action((response) => {
                    this.assessments = response.data.results.map(
                        (assessment) => new AssessmentModel(assessment),
                    );

                    const knowledgeAreas = new Set();
                    this.assessments.forEach((assessment) => {
                        if (assessment.knowledgeArea) {
                            knowledgeAreas.add(assessment.knowledgeArea);
                        }
                    });
                    this.knowledgeAreaFormField.setOptions(Array.from(knowledgeAreas));
                }),
            )
            .catch(this._standardErrorHandler);
    }

    @action
    getRelatedLectureOptions(filterVideoOnly = false) {
        this.relatedLectureOptions = null;
        const config = {
            params: {
                'fields[lecture]': 'id,title',
                page_size: 9999,
                is_published: 'true',
            },
        };
        if (filterVideoOnly) {
            config.params.asset_type = [assetTypes.video, assetTypes.videoMashup];
            // See paramsSerializer in AssetLibraryStore.
            config.paramsSerializer = (params) =>
                udParamsSerializer(params, {arrayBrackets: false});
        }
        return udApi
            .get(`/users/me/subscribed-courses/${this.course.id}/lectures/`, config)
            .then(
                action((response) => {
                    this.relatedLectureOptions = response.data.results;
                    return this.relatedLectureOptions;
                }),
            )
            .catch(this._standardErrorHandler);
    }

    @autobind
    getNumAllowedAnnouncements() {
        return udApi
            .get(`/courses/${this.course.id}/allowed-announcements/`)
            .then(
                action((response) => {
                    this.announcementRateLimit = {
                        numRemaining: response.data.count,
                        maxAllowed: response.data.max_count,
                    };
                }),
            )
            .catch(this._standardErrorHandler);
    }

    @autobind
    @action
    resetNumAllowedAnnouncements() {
        this.announcementRateLimit = null;
    }

    @autobind
    @action
    _standardErrorHandler(error) {
        this.error = parseError(error);
        throw this.error;
    }

    @autobind
    @action
    _standardFinalEditErrorHandler(error) {
        this.error = parseError(error);
        this.isSaving = false;
        throw this.error;
    }
}
