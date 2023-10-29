import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    ADD_LINK_BUTTON_LABEL,
    ALLOWED_ITEM_TYPES,
    COURSE_CONTENT_TYPE,
    RESOURCE_CONTENT_TYPE,
    ASSESSMENT_CONTENT_TYPE,
    LAB_CONTENT_TYPE,
} from '../constants';
import AssessmentAutosuggest from './autosuggest/assessment/assessment-autosuggest.react-component';
import CourseAutosuggest from './autosuggest/course/course-autosuggest.react-component';
import {LabAutosuggest} from './autosuggest/lab/lab-autosuggest.react-component';

import './add-link-form.less';

@observer
export default class AddLinkForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onDismiss: PropTypes.func.isRequired,
        isSaving: PropTypes.bool,
        contentType: PropTypes.oneOf(ALLOWED_ITEM_TYPES).isRequired,
        description: PropTypes.string,
        placeholder: PropTypes.string,
        errorMessage: PropTypes.string,
        isInCourseRemovalAlert: PropTypes.bool,
    };

    static defaultProps = {
        isSaving: false,
        showBrowseUrl: false,
        description: '',
        placeholder: '',
        errorMessage: '',
        isInCourseRemovalAlert: false,
    };

    @observable url = '';

    @computed
    get isSubmitDisabled() {
        return !this.url || this.props.isSaving;
    }

    @autobind
    onSubmit() {
        if (this.isSubmitDisabled) {
            return;
        }
        this.props.onSubmit(this.url);
    }

    @autobind
    @action
    onChange(event) {
        this.url = event.target.value;
    }

    render() {
        const {
            description,
            placeholder,
            onDismiss,
            errorMessage,
            contentType,
            isSaving,
            isInCourseRemovalAlert,
        } = this.props;

        const containerStyles = classNames('container', {
            'container--alert': isInCourseRemovalAlert,
        });

        let AutosuggestComponent;
        if (contentType === COURSE_CONTENT_TYPE) {
            AutosuggestComponent = CourseAutosuggest;
        } else if (contentType === ASSESSMENT_CONTENT_TYPE) {
            AutosuggestComponent = AssessmentAutosuggest;
        } else if (contentType === LAB_CONTENT_TYPE) {
            AutosuggestComponent = LabAutosuggest;
        }

        return (
            <div className="no-drag" styleName={containerStyles}>
                <div styleName="content">
                    {!!AutosuggestComponent && (
                        <AutosuggestComponent
                            isSaving={isSaving}
                            onItemClicked={this.props.onSubmit}
                        />
                    )}
                    {contentType === RESOURCE_CONTENT_TYPE && (
                        <FormGroup
                            label={gettext('Enter content URL')}
                            labelProps={{className: 'ud-sr-only'}}
                            note={description}
                        >
                            <TextInputForm
                                onSubmit={this.onSubmit}
                                value={this.url}
                                maxLength="2048"
                                placeholder={placeholder}
                                onChange={this.onChange}
                                dataPurposes={{input: 'add-link-form'}}
                                submitButtonProps={{disabled: this.isSubmitDisabled}}
                                submitButtonContent={
                                    <>
                                        {isSaving && <Loader color="inherit" overlay={true} />}
                                        <span>{ADD_LINK_BUTTON_LABEL.TEXT}</span>
                                    </>
                                }
                            />
                        </FormGroup>
                    )}
                    {errorMessage && (
                        <AlertBanner
                            data-purpose="add-content-error"
                            showCta={false}
                            styleName="error-message"
                            udStyle="error"
                            title={errorMessage}
                        />
                    )}
                </div>
                <IconButton
                    udStyle="ghost"
                    className="ud-link-neutral"
                    styleName="close"
                    onClick={onDismiss}
                >
                    <CloseIcon label={gettext('Close')} />
                </IconButton>
            </div>
        );
    }
}
