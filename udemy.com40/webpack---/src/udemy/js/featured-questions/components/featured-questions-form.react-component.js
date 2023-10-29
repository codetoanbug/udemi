import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import udApiStat from 'utils/ud-api-stat';

import {DATADOG_METRICS, QUESTION_TITLE_MAX_LENGTH} from '../constants';
import FeaturedQuestionFormModal from './featured-question-form-modal.react-component';
import FeaturedQuestionsCurriculumItemsSearch from './featured-questions-curriculum-items-search.react-component';
import FeaturedQuestionFormStore from './featured-questions-form.mobx-store';
import '../featured-questions.less';

@inject('featuredQuestionsStore')
@observer
export default class FeaturedQuestionsForm extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        featuredQuestionsStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new FeaturedQuestionFormStore(
            this.props.courseId,
            this.props.featuredQuestionsStore,
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.courseId !== this.props.courseId) {
            this.store.setCourseId(this.props.courseId);
        }
    }

    @autobind
    handleSelectCurriculumItem(curriculumItemId, curriculumItemType) {
        if (curriculumItemId && curriculumItemType) {
            this.store.setCurriculumItemId(curriculumItemId);
            this.store.setCurriculumItemType(curriculumItemType);
        } else {
            this.store.setCurriculumItemId(null);
            this.store.setCurriculumItemType(null);
        }
    }

    @autobind
    handleTitleChange({target}) {
        this.store.setTitle(target.value);
    }

    @autobind
    handleDetailsChange(value) {
        this.store.setDetails(value);
    }

    @autobind
    handleAnswerChange(value) {
        this.store.setAnswer(value);
    }

    @autobind
    toggleShowCreateFeaturedQuestion() {
        this.props.featuredQuestionsStore.toggleShowCreateFeaturedQuestion();
    }

    @autobind
    @action
    onSubmit(e) {
        e.preventDefault();
        if (this.store.validateForm()) {
            this.store.toggleShowConfirmationModal();
        }
        udApiStat.increment(
            DATADOG_METRICS.FEATURED_QUESTION_SUBMIT,
            {},
            () => true,
            () => false,
        );
    }

    render() {
        return (
            <Provider featuredQuestionFormStore={this.store}>
                <form onSubmit={this.onSubmit} styleName="featured-question-form">
                    <div className="ud-heading-xl">{gettext('New Featured Question')}</div>
                    <div styleName="featured-question-form-info">
                        {gettext(
                            'This question will be added to the Featured Questions section of your course.',
                        )}
                    </div>
                    <FeaturedQuestionsCurriculumItemsSearch
                        formLabel={gettext('Select Lecture')}
                        onCurriculumItemSelect={this.handleSelectCurriculumItem}
                        onCurriculumItemDeselect={this.handleSelectCurriculumItem}
                        selectedCourseId={this.props.courseId}
                        validationState={this.store.formValidationState.curriculumItemId}
                    />
                    <FormGroup
                        label={gettext('Question Title or Summary')}
                        note={
                            this.store.formValidationState.title === 'error'
                                ? gettext('This field is required.')
                                : null
                        }
                        validationState={this.store.formValidationState.title}
                    >
                        <TextInputWithCounter
                            onChange={this.handleTitleChange}
                            placeholder={gettext(
                                "e.g. Why don't you need to remove duplicates from the sample data?",
                            )}
                            maxLength={QUESTION_TITLE_MAX_LENGTH}
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Details')}
                        note={
                            this.store.formValidationState.details === 'error'
                                ? gettext('This field is required.')
                                : null
                        }
                        validationState={this.store.formValidationState.details}
                    >
                        <RichTextEditor
                            contentEditable={true}
                            theme={RichTextEditor.THEMES.FEATURED_QUESTIONS}
                            placeholder={gettext(
                                'Details: e.g. At 05:28, my query produced a different result than the example shown',
                            )}
                            onValueChange={this.handleDetailsChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Answer')}
                        note={
                            this.store.formValidationState.answer === 'error'
                                ? gettext('This field is required.')
                                : null
                        }
                        validationState={this.store.formValidationState.answer}
                    >
                        <RichTextEditor
                            contentEditable={true}
                            theme={RichTextEditor.THEMES.FEATURED_QUESTIONS}
                            placeholder={gettext(
                                "e.g. Ensure you're running the latest version of the software.",
                            )}
                            onValueChange={this.handleAnswerChange}
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button udStyle="secondary" onClick={this.toggleShowCreateFeaturedQuestion}>
                            {gettext('Cancel')}
                        </Button>
                        <Button type="submit">{gettext('Publish new Featured Question')}</Button>
                        <FeaturedQuestionFormModal />
                    </FooterButtons>
                </form>
            </Provider>
        );
    }
}
