import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInput, Select} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import TextInputWithAddons from 'base-components/ungraduated/form/text-input/text-input-with-addons.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {
    WARNING_TEXT,
    READY_TO_SUBMIT,
    COURSE_URI_HELP_TEXT,
    UFB_CATEGORY_TITLE,
    READY_TO_SUBMIT_UFB,
} from './constants';
import CoursePublishRequirements from './course-publish-requirements.react-component';
import CoursePublishModalStore from './course-publish.mobx-store';
import CoursePublishUserActionEvent, {publishEvent} from './events';
import './course-publish-modal.less';

@withRouter
@observer
export default class CoursePublishModal extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CoursePublishModalStore).isRequired,
        history: PropTypes.object.isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    @autobind
    closeModal() {
        publishEvent(
            new CoursePublishUserActionEvent({
                courseId: this.props.store.pageStore.courseId,
                state: 'submitForReviewModal',
                action: 'close',
            }),
        );
        this.props.store.closeModal();
    }

    @autobind
    onURIChange(e) {
        this.props.store.setURIValue(e.target.value);
    }

    @autobind
    onOrgCategorySelect(event) {
        this.props.store.setSelectedOrganizationCategory(event.target.value);
    }

    getValidationProps(fieldName) {
        const errorList = (this.props.store.errors || {})[fieldName];
        if (errorList && errorList.length) {
            const note = (
                <div
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'course-publish-modal:error',
                        domPurifyConfig: {ADD_ATTR: ['target']},
                        html: errorList.join('<br />'),
                    })}
                />
            );
            return {validationState: 'error', note};
        }
        return {};
    }

    @autobind
    onSubmit(event) {
        publishEvent(
            new CoursePublishUserActionEvent({
                courseId: this.props.store.pageStore.courseId,
                state: 'submitForReviewModal',
                action: 'next',
            }),
        );
        const {store, history, window} = this.props;
        event.preventDefault();
        if (store.validate()) {
            store.publishOrSubmitCourse().then((redirection) => {
                if (redirection) {
                    if (redirection.isInCourseManageApp) {
                        history.push(redirection.url);
                    } else {
                        window.location.href = redirection.url;
                    }
                }
            });
        }
    }

    renderUFBCategories(styleName) {
        const store = this.props.store;
        if (store.organizationId) {
            return (
                <FormGroup
                    label={UFB_CATEGORY_TITLE}
                    {...this.getValidationProps('ufb_category')}
                    styleName={styleName}
                >
                    <Select
                        data-purpose="org-category-select"
                        title={gettext('Organization category')}
                        value={store.selectedOrganizationCategory}
                        onChange={this.onOrgCategorySelect}
                    >
                        {(store.orgCategories || []).map((category, index) => (
                            <option
                                key={index}
                                value={category.id !== undefined ? category.id : 'invalid'}
                                disabled={category.id === undefined}
                            >
                                {category.title}
                            </option>
                        ))}
                    </Select>
                </FormGroup>
            );
        }
        return null;
    }

    renderReadyToSubmit() {
        const store = this.props.store;
        if (store.organizationId) {
            return (
                <>
                    <div data-purpose="org-ready-to-submit">{READY_TO_SUBMIT_UFB}</div>
                    {this.renderUFBCategories('mt-lg')}
                </>
            );
        }
        return <div>{READY_TO_SUBMIT}</div>;
    }

    renderPublishBody() {
        const store = this.props.store;
        if (store.publishedTitle) {
            return this.renderReadyToSubmit();
        }
        return (
            <>
                <FormGroup
                    label={gettext('Course URL')}
                    note={COURSE_URI_HELP_TEXT}
                    {...this.getValidationProps('published_title')}
                >
                    <TextInputWithAddons data-purpose="url-input">
                        <TextInputWithAddons.Addon styleName="url-prefix">
                            {`${store.domainURL}/course/`}
                        </TextInputWithAddons.Addon>
                        <TextInput
                            placeholder={store.URIPlaceholder}
                            value={store.URIValue}
                            onChange={this.onURIChange}
                        />
                    </TextInputWithAddons>
                </FormGroup>
                <div className="ud-text-bold" styleName="mt-sm">
                    {WARNING_TEXT}
                </div>
                {this.renderUFBCategories('mt-sm')}
                {store.organizationId ? null : (
                    <div data-purpose="note-text" styleName="mt-sm">
                        {store.noteText}
                    </div>
                )}
            </>
        );
    }

    renderMissingRequirementsBody() {
        const store = this.props.store;
        if (store.missingPublishRequirements) {
            return (
                <CoursePublishRequirements
                    missingPublishRequirements={store.missingPublishRequirements}
                />
            );
        }
        return null;
    }

    renderSubmitButton() {
        if (this.props.store.publishRequirementsComplete) {
            return (
                <FooterButtons>
                    <Button udStyle="brand" type="submit" disabled={this.props.store.isSubmitting}>
                        {this.props.store.modalButtonText}
                    </Button>
                </FooterButtons>
            );
        }
        return null;
    }

    render() {
        return (
            <Modal
                isOpen={this.props.store.isModalOpen}
                onClose={this.closeModal}
                title={this.props.store.modalTitle}
                loading={!this.props.store.initialized}
            >
                {this.props.store.initialized && (
                    <form onSubmit={this.onSubmit} styleName="form">
                        {this.props.store.publishRequirementsComplete
                            ? this.renderPublishBody()
                            : this.renderMissingRequirementsBody()}
                        {this.renderSubmitButton()}
                    </form>
                )}
            </Modal>
        );
    }
}
