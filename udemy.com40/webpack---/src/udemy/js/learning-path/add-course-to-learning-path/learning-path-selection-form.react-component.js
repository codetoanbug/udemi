import {withI18n} from '@udemy/i18n';
import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Checkbox, FormGroup, TextInputForm} from '@udemy/react-form-components';
import classNames from 'classnames';
import {observer, PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CheckboxGroup from 'organization-common/resource-context-menu/menu-items/checkbox-group.react-component';

import styles from './learning-path-selection-form.less';

@observer
class InternalLearningPathSelectionForm extends Component {
    static propTypes = {
        learningPaths: MobxPropTypes.arrayOrObservableArray.isRequired,
        onSelect: PropTypes.func.isRequired,
        addCourseToLearningPathStore: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = props.addCourseToLearningPathStore;
    }

    scrollToLearningPath(learningPathId) {
        setTimeout(() => {
            // All checkboxes have their name set to the learning path id
            const elementList = document.getElementsByName(learningPathId);
            if (elementList.length > 0) {
                const element = elementList[0];
                if (element) {
                    element.scrollIntoView(true);
                }
            }
        });
    }

    handleAddPathClick = async () => {
        const lp = await this.store.createLearningPath();
        if (lp) {
            this.scrollToLearningPath(lp.id);
        }
    };

    renderLearningPathInputSection() {
        const {gettext} = this.props;
        const inputTextClassNames = classNames({
            'title-too-long-container': this.store.titleTooLong,
        });
        const submitButtonContext = (
            <span className={styles['add-path-submit-button-context']}>
                {gettext('Create path')}
            </span>
        );
        return (
            <FormGroup
                label={gettext('Create learning path')}
                labelProps={{className: 'ud-sr-only'}}
                className={styles['input-section-container']}
                data-purpose="learning-path-title-input"
                note={
                    this.store.titleTooLong
                        ? gettext('Learning path titles cannot exceed 255 characters')
                        : null
                }
                validationState={this.store.titleTooLong ? 'error' : 'neutral'}
            >
                <TextInputForm
                    className={inputTextClassNames}
                    disabled={this.store.isCreatingLearningPath}
                    placeholder={gettext('Type the name of the new learning path here')}
                    onChange={this.store.setNewLearningPathTitle}
                    onSubmit={this.handleAddPathClick}
                    submitButtonContent={submitButtonContext}
                />
            </FormGroup>
        );
    }

    render() {
        const {learningPaths, onSelect, gettext} = this.props;

        return (
            <div
                className={styles['learning-path-selection']}
                data-purpose="learning-path-selection"
            >
                {learningPaths.length ? (
                    <CheckboxGroup>
                        {learningPaths.map((item) => (
                            <Checkbox
                                data-purpose={`item-checkbox-${item.id}`}
                                defaultChecked={item.isSelected || false}
                                key={item.id}
                                name={item.id}
                                onChange={onSelect}
                            >
                                {item.title}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                ) : null}
                {this.store.isLearningPathFormVisible ? (
                    this.renderLearningPathInputSection()
                ) : (
                    <Button
                        data-purpose="new-path-button"
                        udStyle="ghost"
                        size="medium"
                        onClick={this.store.toggleLearningPathForm}
                    >
                        <AddCircleSolidIcon label={false} />
                        {gettext('Create new path')}
                    </Button>
                )}
            </div>
        );
    }
}

const LearningPathSelectionForm = withI18n(InternalLearningPathSelectionForm);
export default LearningPathSelectionForm;
