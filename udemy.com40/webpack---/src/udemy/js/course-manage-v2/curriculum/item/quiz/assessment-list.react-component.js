import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Sortable, {
    scrollWithinSortable,
} from 'base-components/ungraduated/sortable/sortable.react-component';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import {
    createOptionsForSortableAssessments,
    assessmentScrollBuffer,
} from '../create-options-for-sortable';
import AssessmentListItem from './assessment-list-item.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './assessment-list.less';

const propTypes = {
    curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
};

// https://mobx.js.org/best/react-performance.html suggests "Render lists in dedicated components".
// We don't want to reconcile the list every time the reorderingUi changes.
const AssessmentList = (props) => {
    const {isDragging} = props.curriculumItem.reorderingUi;
    return (
        <div styleName={classNames('assessment-list', {dragging: isDragging})}>
            <AssessmentSortable {...props} />
        </div>
    );
};

AssessmentList.propTypes = propTypes;

export default observer(AssessmentList);

@observer
class AssessmentSortable extends Component {
    static propTypes = propTypes;

    constructor(props, context) {
        super(props, context);
        this.optionsForSortable = createOptionsForSortableAssessments({
            onStart: this.onSortAssessmentStart,
            onEnd: this.onSortAssessmentEnd,
            scrollFn: this.onSortAssessmentScroll,
        });
    }

    @autobind
    setSortableRef(sortableInstance) {
        this.sortable = sortableInstance ? sortableInstance.sortable : null;
    }

    @autobind
    onSortAssessmentScroll(scrollOffsetX, scrollOffsetY, evt) {
        scrollWithinSortable(
            scrollOffsetX,
            scrollOffsetY,
            evt,
            this.sortable,
            assessmentScrollBuffer,
        );
    }

    @autobind
    onSortAssessmentStart() {
        this.props.curriculumItem.setReorderingUi({isDragging: true});
    }

    @autobind
    onSortAssessmentEnd(event) {
        this.props.curriculumItem.setReorderingUi({isDragging: false});
        this.props.curriculumItem
            .reorderAssessment(event.oldIndex, event.newIndex)
            .catch(handleUnexpectedAPIError);
    }

    render() {
        const {curriculumItem} = this.props;
        const assessments = curriculumItem.assessments || [];
        if (assessments.length === 0) {
            return null;
        }
        return (
            <Sortable
                tag="ul"
                className="ud-unstyled-list"
                data-purpose="assessment-list"
                ref={this.setSortableRef}
                options={this.optionsForSortable}
            >
                {assessments.map((assessment, i) => {
                    return (
                        <AssessmentListItem
                            key={assessment.id}
                            itemNumber={i + 1}
                            curriculumItem={curriculumItem}
                            assessment={assessment}
                        />
                    );
                })}
            </Sortable>
        );
    }
}
