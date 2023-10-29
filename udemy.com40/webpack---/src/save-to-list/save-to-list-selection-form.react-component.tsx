import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {withI18n, WithI18nProps} from '@udemy/i18n';
import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import {Button} from '@udemy/react-core-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';

import {CheckboxWithLoader} from '../external/enhanced-form-elements/checkbox-with-loader.react-component';
import {MAX_TITLE_CHARACTER_LIMIT, MIN_TITLE_CHARACTER_LIMIT} from './constants';
import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import styles from './save-to-list-selection-form.module.less';

interface SaveToListSelectionFormProps {
    store: SaveToListButtonStore;
}

@observer
class InternalSaveToListSelectionForm extends Component<
    SaveToListSelectionFormProps & WithI18nProps
> {
    toggleSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetId = parseInt(event.target.name, 10);
        const targetTitle = event.target.title;
        if (event.target.checked) {
            await this.props.store.saveToList(targetId, targetTitle);
        } else {
            await this.props.store.removeFromList(targetId, targetTitle);
        }
        if (!this.props.store.hasError) {
            await this.props.store.toggleList(targetId);
        }
    };

    handleAddListClick = () => {
        this.props.store.createList();
    };

    renderNewListForm() {
        const {gettext, interpolate} = this.props;
        return (
            <FormGroup
                label={gettext('Create new list')}
                labelProps={{className: 'ud-sr-only'}}
                data-testid="create-list-title-input"
                className={styles['new-list-form']}
                note={
                    this.props.store.titleTooLong
                        ? interpolate(
                              gettext('List titles cannot exceed %(titleLimit)s characters'),
                              {titleLimit: MAX_TITLE_CHARACTER_LIMIT},
                              true,
                          )
                        : null
                }
                validationState={this.props.store.titleTooLong ? 'error' : 'neutral'}
            >
                <TextInputForm
                    submitButtonProps={{
                        disabled:
                            this.props.store.isCreatingNewList ||
                            this.props.store.newListTitle.length < MIN_TITLE_CHARACTER_LIMIT,
                    }}
                    onChange={this.props.store.setNewListTitle}
                    onSubmit={this.handleAddListClick}
                    maxLength={MAX_TITLE_CHARACTER_LIMIT}
                    submitButtonContent={gettext('Create list')}
                />
            </FormGroup>
        );
    }

    render() {
        const {gettext} = this.props;
        return (
            <div data-testid="save-to-list-selection">
                {this.props.store.myList && (
                    <div className={styles['checkbox-group']}>
                        {this.props.store.myList.map((listItem) => {
                            return (
                                <CheckboxWithLoader
                                    data-testid={`item-checkbox-${listItem.id}`}
                                    checked={listItem.isSelected ?? false}
                                    key={listItem.id}
                                    name={listItem.id.toString()}
                                    onChange={this.toggleSelect}
                                    isLoading={this.props.store.isSubmitting.has(listItem.id)}
                                    title={listItem.title}
                                >
                                    {listItem.title}
                                </CheckboxWithLoader>
                            );
                        })}
                    </div>
                )}
                {this.props.store.isNewListFormVisible ? (
                    this.renderNewListForm()
                ) : (
                    <Button
                        data-testid="create-new-list-button"
                        className={styles['new-list-button']}
                        udStyle="ghost"
                        size="medium"
                        onClick={this.props.store.toggleNewListForm}
                    >
                        <AddCircleSolidIcon label={false} />
                        {gettext('Create new list')}
                    </Button>
                )}
            </div>
        );
    }
}

export const SaveToListSelectionForm = withI18n(InternalSaveToListSelectionForm);
