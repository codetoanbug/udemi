import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './quiz-editor.less';

const IsPublishedToggle = observer(({curriculumItem, onToggle, canToggle}) => {
    if (!canToggle) {
        return null;
    }
    const buttonProps = {
        udStyle: 'secondary',
        size: 'small',
        'data-purpose': 'is-published-toggle',
        disabled: curriculumItem.isSaving,
        onClick: onToggle,
    };
    if (curriculumItem.is_published && curriculumItem.is_draft) {
        return (
            <Popover
                placement="top"
                canToggleOnHover={true}
                a11yRole="description"
                trigger={
                    <Button {...buttonProps} aria-disabled={true} onClick={undefined}>
                        {gettext('Unpublish')}
                    </Button>
                }
            >
                {gettext('You cannot unpublish with edits that are not live')}
            </Popover>
        );
    }
    if (curriculumItem.is_published) {
        return <Button {...buttonProps}>{gettext('Unpublish')}</Button>;
    }
    return (
        <Button {...buttonProps} udStyle="brand">
            {gettext('Publish')}
        </Button>
    );
});

@observer
export default class QuizSettings extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        onToggleIsPublished: PropTypes.func.isRequired,
    };

    render() {
        const {curriculumItem, canTogglePublishedState, onToggleIsPublished} = this.props;
        return (
            <div styleName="quiz-settings-btns" data-purpose="quiz-settings">
                <Button
                    size="small"
                    componentClass="a"
                    href={curriculumItem.previewAsInstructorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('Preview')}
                </Button>
                <IsPublishedToggle
                    curriculumItem={curriculumItem}
                    canToggle={canTogglePublishedState}
                    onToggle={onToggleIsPublished}
                />
            </div>
        );
    }
}
