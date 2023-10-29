import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';

import CurriculumEditorStore from './curriculum-editor.mobx-store';
import {curriculumItemKeyClasses} from './item/constants';
import './add-item-forms.less';

const udConfig = getConfigData();

@inject('store')
class AddItemButton extends Component {
    static propTypes = {
        itemKeyClass: PropTypes.oneOf([
            curriculumItemKeyClasses.lecture,
            curriculumItemKeyClasses.simpleQuiz,
            curriculumItemKeyClasses.practiceTest,
            curriculumItemKeyClasses.section,
            curriculumItemKeyClasses.assignment,
            curriculumItemKeyClasses.codingExercise,
        ]),
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
    };

    static defaultProps = {
        itemKeyClass: null,
    };

    @autobind
    defaultOnClick() {
        if (this.props.itemKeyClass) {
            this.props.store.openAddFormForItem(this.props.itemKeyClass);
        }
    }

    render() {
        const {children, itemKeyClass, store, ...buttonProps} = this.props;

        const defaultButtonProps = {udStyle: 'secondary', onClick: this.defaultOnClick};
        if (store.inlineInsertEnabled) {
            defaultButtonProps.udStyle = 'ghost';
            defaultButtonProps.size = 'xsmall';
            defaultButtonProps.typography = 'ud-heading-md';
        }

        return (
            <Button {...defaultButtonProps} {...buttonProps}>
                <ExpandPlusIcon label={false} size="small" />
                <span styleName="ellipsis">{children}</span>
            </Button>
        );
    }
}

export const AddLectureButton = (props) => {
    return (
        <AddItemButton
            {...props}
            data-purpose="add-lecture-btn"
            itemKeyClass={curriculumItemKeyClasses.lecture}
            aria-label={gettext('Add Lecture')}
        >
            {gettext('Lecture')}
        </AddItemButton>
    );
};

export const AddSimpleQuizButton = (props) => {
    return (
        <AddItemButton
            {...props}
            data-purpose="add-quiz-btn"
            itemKeyClass={curriculumItemKeyClasses.simpleQuiz}
            aria-label={gettext('Add Quiz')}
        >
            {gettext('Quiz')}
        </AddItemButton>
    );
};

export const AddCodingExerciseQuizButton = (props) => {
    return (
        <AddItemButton
            {...props}
            data-purpose="add-coding-exercise-btn"
            itemKeyClass={curriculumItemKeyClasses.codingExercise}
            aria-label={gettext('Add Coding Exercise')}
        >
            {gettext('Coding Exercise')}
        </AddItemButton>
    );
};

export const AddPracticeTestQuizButton = inject('store')(
    observer(({store, ...props}) => {
        let disabledTooltipText;
        if (!udConfig.brand.has_organization) {
            if (!store.course.isPaid) {
                disabledTooltipText = gettext(
                    'Please set a price on your course to create a practice test.',
                );
            } else if (store.numOfPracticeTests >= store.course.max_num_of_practice_tests) {
                const tooltipTextContext = [store.course.max_num_of_practice_tests];
                disabledTooltipText = store.course.isPracticeTestCourse
                    ? interpolate(
                          gettext(
                              'You are allowed to include a maximum of %s practice tests in a practice test-only course.',
                          ),
                          tooltipTextContext,
                      )
                    : interpolate(
                          gettext(
                              'You are allowed to include a maximum of %s practice tests in a regular Udemy course.',
                          ),
                          tooltipTextContext,
                      );
            }
        }

        if (disabledTooltipText) {
            props['aria-disabled'] = true;
            props.onClick = undefined;
        }

        const button = (
            <AddItemButton
                {...props}
                data-purpose="add-practice-test-btn"
                itemKeyClass={curriculumItemKeyClasses.practiceTest}
                aria-label={gettext('Add Practice Test')}
            >
                {gettext('Practice Test')}
            </AddItemButton>
        );
        if (!disabledTooltipText) {
            return button;
        }

        return (
            <Popover
                placement="top"
                canToggleOnHover={true}
                a11yRole="description"
                trigger={button}
            >
                {disabledTooltipText}
            </Popover>
        );
    }),
);

export const AddAssignmentButton = (props) => {
    return (
        <AddItemButton
            {...props}
            data-purpose="add-assignment-btn"
            itemKeyClass={curriculumItemKeyClasses.assignment}
            aria-label={gettext('Add Assignment')}
        >
            {gettext('Assignment')}
        </AddItemButton>
    );
};

export const AddSectionButton = (props) => {
    return (
        <AddItemButton
            {...props}
            data-purpose="add-section-btn"
            itemKeyClass={curriculumItemKeyClasses.section}
            aria-label={gettext('Add Section')}
        >
            {gettext('Section')}
        </AddItemButton>
    );
};
