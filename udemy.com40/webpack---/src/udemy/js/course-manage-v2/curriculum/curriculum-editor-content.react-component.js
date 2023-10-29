import {LocalizedHtml} from '@udemy/i18n';
import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observe} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS} from 'course-manage-v2/constants';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import Loader from 'course-manage-v2/loader.react-component';
import {showReloadPageErrorToast} from 'instructor/toasts';
import getConfigData from 'utils/get-config-data';
import {getQueryParams} from 'utils/query-params';

import AddItemForms from './add-item-forms.react-component';
import AlertFirstSectionCreation from './alert-first-section-creation.react-component';
import AlertFreeCourseContentLength from './alert-free-course-content-length.react-component';
import AlertInlineEditorWelcome from './alert-inline-editor-welcome.react-component';
import AlertPracticeTest from './alert-practice-test.react-component';
import AlertPreviewLength from './alert-preview-length.react-component';
import {CurriculumBetaBanner} from './curriculum-beta-banner.react-component';
import CurriculumList from './curriculum-list.react-component';
import InfoTip from './info-tip.react-component';
import {curriculumItemTypes, quizTypes, loadingState} from './item/constants';
import UploadBulk from './upload-bulk/upload-bulk.react-component';

import './curriculum-editor.less';

const udConfig = getConfigData();
@inject('store')
@observer
export default class CurriculumEditor extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        const store = props.store;
        super(props, context);
        store.setInitialFocusOn(this.getCurriculumItemFromQuery());
        observe(store, 'isUpdateOrderErrorShown', this.showUpdateOrderError);
    }

    componentDidMount() {
        this.props.store.fetchCurriculum().catch(handleUnexpectedAPIError);
    }

    getCurriculumItemFromQuery() {
        const queryParams = getQueryParams(window.location);
        const lectureId = Number(queryParams.lectureId);
        if (lectureId) {
            return {_class: curriculumItemTypes.lecture, id: lectureId};
        }
        const quizId = Number(queryParams.quizId);
        if (quizId) {
            return {_class: curriculumItemTypes.quiz, type: quizTypes.simpleQuiz, id: quizId};
        }
        const practiceTestId = Number(queryParams.practiceTestId);
        if (practiceTestId) {
            return {
                _class: curriculumItemTypes.quiz,
                type: quizTypes.practiceTest,
                id: practiceTestId,
            };
        }
        const codingExerciseId = Number(queryParams.codingExerciseId);
        if (codingExerciseId) {
            return {
                _class: curriculumItemTypes.quiz,
                type: quizTypes.codingExercise,
                id: codingExerciseId,
            };
        }
        const assignmentId = Number(queryParams.assignmentId);
        if (assignmentId) {
            return {_class: curriculumItemTypes.assignment, id: assignmentId};
        }
        return null;
    }

    @autobind
    showUpdateOrderError() {
        const store = this.props.store;
        if (store.isUpdateOrderErrorShown) {
            showReloadPageErrorToast(
                gettext(
                    'There was an error saving the numbering of the curriculum. ' +
                        'Please reload the page at your earliest convenience.',
                ),
            );
        }
    }

    @autobind
    onDeleteCurriculumItemConfirm() {
        this.props.store.deleteCurriculumItem().catch(handleUnexpectedAPIError);
    }

    render() {
        const store = this.props.store;
        if (store.loadingState !== loadingState.loaded) {
            return <Loader />;
        }
        /*  Display the free course content length alert when the content of
         *  the video exceeds 3 hours
         */
        const hasOrganization = this.props.store.course.organization_id;
        const isUFB = udConfig.brand.has_organization;
        const isCourseVersionEnabled = this.props.store.pageStore.isCourseVersionEnabled;
        return (
            <Provider store={store}>
                <div>
                    <div styleName="alert-container">
                        {!hasOrganization && <AlertFreeCourseContentLength styleName="alert" />}
                        <AlertPreviewLength styleName="alert" />
                        <AlertInlineEditorWelcome styleName="alert" />
                        <AlertPracticeTest styleName="alert" />
                        <AlertFirstSectionCreation styleName="alert" />
                        <InfoTip styleName="info" />
                        {!hasOrganization && (
                            <p styleName="info" data-purpose="free-course-message">
                                <LocalizedHtml
                                    html={gettext(
                                        'Start putting together your course by creating sections, lectures ' +
                                            'and practice activities (<a class="practice">quizzes, coding exercises and assignments</a>). ' +
                                            'Use your <a class="outline">course outline</a> to structure your content ' +
                                            'and label your sections and lectures clearly.',
                                    )}
                                    interpolate={{
                                        practice: (
                                            <a
                                                className="ud-link-underline"
                                                href="/udemy-teach-hub/course_creation_practice_activities/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        outline: (
                                            <a
                                                className="ud-link-underline"
                                                href="/udemy-teach-hub/course_creation_outline_course/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                    }}
                                />{' '}
                                {ninterpolate(
                                    'If you’re intending to offer your course for free, the total length of video content must be less than %(hours)s hour.',
                                    'If you’re intending to offer your course for free, the total length of video content must be less than %(hours)s hours.',
                                    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                                    {hours: FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS},
                                )}
                            </p>
                        )}
                        {store.course.isDevelopmentCourse && <CurriculumBetaBanner />}
                    </div>
                    {isCourseVersionEnabled && (
                        <div styleName="bulk-container">
                            <UploadBulk acceptAudio={isUFB} acceptPresentation={isUFB} />
                        </div>
                    )}
                    <CurriculumList />
                    {!store.inlineInsertEnabled && (
                        <div styleName="add-item-forms">
                            <AddItemForms />
                        </div>
                    )}
                    <ConfirmModal
                        onCancel={store.closeDeleteCurriculumItemConfirmation}
                        onConfirm={this.onDeleteCurriculumItemConfirm}
                        isOpen={!!store.toBeDeletedCurriculumItem}
                    >
                        {gettext(
                            'You are about to remove a curriculum item. Are you sure you want to continue?',
                        )}
                    </ConfirmModal>
                </div>
            </Provider>
        );
    }
}
