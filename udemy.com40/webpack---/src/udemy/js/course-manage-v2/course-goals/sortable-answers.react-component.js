import {Keys} from '@udemy/design-system-utils';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Sortable from 'base-components/ungraduated/sortable/sortable.react-component';
import arrayMove from 'utils/array-move';
import udPerf from 'utils/ud-performance';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import styles from './goals-form.less';
import Question from './question.mobx-model';

/* eslint-disable react/prop-types */
const SortableItem = ({
    questionId,
    id,
    value,
    onChange,
    placeholder,
    label,
    onDelete,
    validationState,
    validationError,
    deleteButtonDisabled,
    maxLength,
    withCounter,
    /* eslint-disable react/prop-types */
}) => {
    const Input = withCounter ? TextInputWithCounter : TextInput;
    return (
        <FormGroup
            formControlId={id}
            label={label}
            labelProps={{className: 'ud-sr-only'}}
            validationState={validationState}
            note={validationError}
            styleName={classNames({
                'sortable-answer': true,
                'show-buttons-on-hover': !isMobileBrowser && !!value,
                'hide-buttons': !value,
                'question-line-container': true,
            })}
        >
            <div styleName="question-form">
                <div styleName="question-text-container">
                    <Input
                        defaultValue={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        data-purpose={`${questionId}-input-${id}`}
                        maxLength={maxLength}
                    />
                </div>
                <IconButton
                    udStyle="secondary"
                    onClick={() => {
                        onDelete(id);
                    }}
                    disabled={deleteButtonDisabled}
                >
                    <DeleteIcon label={gettext('Delete')} />
                </IconButton>
                <IconButton
                    udStyle="secondary"
                    className="js-drag-handle"
                    styleName="sortable-answer-handle"
                >
                    <MenuIcon label={gettext('Move')} />
                </IconButton>
            </div>
        </FormGroup>
    );
};

@inject('store')
@observer
export default class SortableAnswers extends Component {
    static propTypes = {
        questionId: PropTypes.string.isRequired,
        placeholders: PropTypes.arrayOf(PropTypes.string),
        question: PropTypes.instanceOf(Question).isRequired,
        store: PropTypes.object.isRequired,
        shouldSendPerfMetric: PropTypes.bool,
        deleteButtonDisabled: PropTypes.bool,
        maxLength: PropTypes.number,
        withCounter: PropTypes.bool,
    };

    static defaultProps = {
        shouldSendPerfMetric: false,
        deleteButtonDisabled: false,
        placeholders: null,
        maxLength: -1,
        withCounter: false,
    };

    componentDidMount() {
        if (this.props.shouldSendPerfMetric) {
            udPerf.mark('CourseManage.course-goals-form-inputs-rendered');
        }
    }

    @autobind
    onSortEnd({oldIndex, newIndex}) {
        const updatedOrderedList = arrayMove(this.props.question.answerList, oldIndex, newIndex);

        this.props.question.updateAllAnswers(updatedOrderedList);
        this.props.store.setDirty();
        document.body.classList.remove('course-manage--on-drag');
    }

    @autobind
    onSortStart() {
        document.body.classList.add('course-manage--on-drag');
    }

    @autobind
    updateListValue(event) {
        this.props.question.updateAnswer(event.target.id, event.target.value);
        this.props.store.setDirty();
    }

    @autobind
    deleteListValue(id) {
        this.props.question.deleteAnswer(id);
        this.props.store.setDirty();
    }

    @autobind
    addItemOnEnter(event) {
        if (event.keyCode == Keys.RETURN) {
            event.preventDefault();
            const newActiveKey = this.props.question.getNextAnswerOrCreate(event.target.id);
            if (newActiveKey) {
                setTimeout(() => {
                    const newItem = document.querySelector(`input[id="${newActiveKey}"]`);
                    newItem && newItem.focus();
                });
            }
        }
    }

    render() {
        const {
            question,
            placeholders,
            questionId,
            deleteButtonDisabled,
            maxLength,
            withCounter,
        } = this.props;

        // We prefer forceFallback because with native HTML5 drag-and-drop,
        // Chrome does not update the hover effect after an item is dragged.
        // Since the sortable handle is only visible on hover,
        // this makes it look like the item was not dragged successfully.
        // For example, suppose user drags an item from index 0 to index 1.
        // After the drag, the mouse is over the sortable handle for item 1.
        // However, the browser thinks the mouse is still hovering over item 0,
        // so it renders the handle for item 0, not the handle for item 1.
        return (
            <div onKeyDown={this.addItemOnEnter}>
                <Sortable
                    options={{
                        dragClass: styles['sortable-drag'],
                        forceFallback: true,
                        group: questionId,
                        handle: '.js-drag-handle',
                        onEnd: this.onSortEnd,
                        onStart: this.onSortStart,
                        scrollSpeed: 20,
                    }}
                >
                    {question.answerList.map((item, index) => {
                        let currentPlaceholder = '';
                        if (placeholders && placeholders.length > 0)
                            currentPlaceholder = placeholders[index % placeholders.length];
                        return (
                            <SortableItem
                                key={item.key}
                                id={item.key}
                                value={item.value}
                                onChange={this.updateListValue}
                                questionId={questionId}
                                label={interpolate(
                                    gettext('Answer %(answerNumber)s'),
                                    {answerNumber: index + 1},
                                    true,
                                )}
                                placeholder={currentPlaceholder}
                                onDelete={this.deleteListValue}
                                validationState={item.validationState}
                                validationError={item.validationError}
                                deleteButtonDisabled={deleteButtonDisabled}
                                maxLength={maxLength}
                                withCounter={withCounter}
                            />
                        );
                    })}
                </Sortable>
            </div>
        );
    }
}
