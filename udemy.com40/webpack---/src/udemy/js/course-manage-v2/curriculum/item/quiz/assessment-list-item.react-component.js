import autobind from 'autobind-decorator';
import {observe} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {assessmentLabels, assessmentTypes} from '../constants';
import {
    draggableAssessmentCSSClass,
    assessmentHandleCSSClass,
} from '../create-options-for-sortable';
import ItemIconButton from '../item-icon-button.react-component';
import styles from './assessment-list.less';
import AssessmentModel from './assessment.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import {parseFITBAssessmentAsTemplate} from './parsers';

const highlightClassName = styles.highlight;

@observer
export default class AssessmentListItem extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        assessment: PropTypes.instanceOf(AssessmentModel).isRequired,
        itemNumber: PropTypes.number.isRequired,
    };

    componentDidMount() {
        // Handle created case.
        this.applyHighlightAnimationIfUpdatedOrCreated();

        // Handle updated case.
        this.highlightAnimationDisposer = observe(
            this.props.curriculumItem,
            'justUpdatedOrCreatedAssessmentId',
            this.applyHighlightAnimationIfUpdatedOrCreated,
        );
    }

    componentWillUnmount() {
        this.highlightAnimationDisposer();
    }

    @autobind
    applyHighlightAnimationIfUpdatedOrCreated() {
        const {curriculumItem, assessment} = this.props;
        if (curriculumItem.justUpdatedOrCreatedAssessmentId === assessment.id) {
            // We use a 0 timeout here because it makes `focus()` more accurate.
            setTimeout(this.applyHighlightAnimation, 0);

            curriculumItem.clearJustUpdatedOrCreatedAssessmentId();
        }
    }

    @autobind
    applyHighlightAnimation() {
        if (this.element) {
            this.element.classList.add(highlightClassName);

            // Scroll the element into view. We prefer `focus()` over `scrollIntoView()` because
            // the latter tends to scroll such that the element is at the top of the window,
            // where it can be blocked by e.g. `<DraftAlert />`.
            this.element.focus();

            setTimeout(this.unapplyHighlightAnimation, 1000);
        }
    }

    @autobind
    unapplyHighlightAnimation() {
        if (this.element) {
            this.element.classList.remove(highlightClassName);
        }
    }

    @autobind
    setRef(ref) {
        this.element = ref;
    }

    @autobind
    onEdit() {
        this.props.curriculumItem.openAddContentForAssessment(this.props.assessment);
    }

    @autobind
    onConfirmAndDelete() {
        this.props.curriculumItem.openDeleteAssessmentConfirmation(this.props.assessment.id);
    }

    renderQuestion() {
        let question = this.props.assessment.question;
        if (this.props.assessment.assessment_type === assessmentTypes.fitb) {
            question = parseFITBAssessmentAsTemplate(
                question,
                this.props.assessment.correctResponse,
            );
        }
        // Strip HTML tags and trim leading/trailing whitespace.
        return question.replace(/<[^>]+(>|$)/g, ' ').trim();
    }

    render() {
        const {curriculumItem, assessment, itemNumber} = this.props;
        return (
            <li
                className={`item-icon-button-trigger ${draggableAssessmentCSSClass}`}
                data-purpose="assessment-list-item"
            >
                <div
                    className="ud-text-sm"
                    ref={this.setRef}
                    styleName="assessment-list-item-content"
                    tabIndex="-1"
                >
                    <div className="ud-text-bold">{`${itemNumber}.`}</div>
                    <div
                        styleName="ellipsis"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'assessment-list-item:render-question',
                            html: this.renderQuestion(),
                        })}
                    />
                    <div styleName="assessment-type">
                        {assessmentLabels[assessment.assessment_type]}
                    </div>
                    <div styleName="flex" />
                    <ItemIconButton
                        iconType="edit"
                        data-purpose="edit-assessment"
                        onClick={this.onEdit}
                    />
                    <ItemIconButton
                        iconType="delete"
                        data-purpose="delete-assessment"
                        onClick={this.onConfirmAndDelete}
                        disabled={curriculumItem.isSaving}
                    />
                    <ItemIconButton
                        iconType="move"
                        componentClass="div"
                        className={assessmentHandleCSSClass}
                        styleName="sort-handle"
                    />
                </div>
            </li>
        );
    }
}
