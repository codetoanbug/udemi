import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {hasHTMLContent} from './html';
import './answer-editor.less';

@observer
export default class AnswerEditor extends React.Component {
    static propTypes = {
        isEditing: PropTypes.bool.isRequired,
        question: PropTypes.object.isRequired,
        answer: PropTypes.object.isRequired,
        renderPlaceholder: PropTypes.func.isRequired,
        extraEditorProps: PropTypes.object.isRequired,
        submitBtnLabel: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        onCancel: undefined,
    };

    @observable hasError = false;
    @observable warnings = [];
    @observable isSubmitting = false;

    @autobind
    @action
    submit() {
        this.hasError = !hasHTMLContent(this.props.answer.body);
        if (!this.hasError) {
            this.isSubmitting = true;
            this.props.question
                .saveAnswer(this.props.answer, !!this.warnings.length)
                .then(
                    action(() => {
                        this.isSubmitting = false;
                        this.warnings = [];
                        this.props.onSave();
                    }),
                )
                .catch(
                    action(({response}) => {
                        if (!response.data || !response.data.body || !response.data.body.length) {
                            return;
                        }
                        const body = response.data.body[0];
                        if (body.type !== 'warning' || !body.messages || !body.messages.length) {
                            return;
                        }
                        this.warnings = body.messages;
                        this.isSubmitting = false;
                    }),
                );
        }
    }

    get cancelBtn() {
        if (!this.props.onCancel) {
            return null;
        }
        return (
            <Button
                onClick={this.props.onCancel}
                disabled={this.isSubmitting}
                udStyle="ghost"
                size="small"
                data-purpose="cancel"
            >
                {gettext('Cancel')}
            </Button>
        );
    }

    render() {
        if (!this.props.isEditing) {
            return this.props.renderPlaceholder();
        }
        let alert;
        if (this.hasError) {
            alert = (
                <AlertBanner
                    udStyle="error"
                    styleName="alert-banner"
                    title={gettext('Field can not be empty')}
                    showCta={false}
                />
            );
        } else if (this.warnings.length) {
            alert = (
                <AlertBanner
                    udStyle="warning"
                    styleName="alert-banner"
                    title={gettext('Warning')}
                    body={
                        <div
                            className="ud-text-with-links"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'answer-editor:warnings',
                                domPurifyConfig: {ADD_ATTR: ['target']},
                                html: this.warnings.map((warning) => `<p>${warning}</p>`),
                                dataPurpose: 'warnings',
                            })}
                        />
                    }
                    showCta={false}
                />
            );
        }
        return (
            <div styleName="answer-editor">
                {alert}
                <FormGroup label={this.props.extraEditorProps.placeholder}>
                    <RichTextEditor
                        autoFocus={true}
                        value={this.props.answer.body}
                        onValueChange={this.props.answer.setBody}
                        {...this.props.extraEditorProps}
                    />
                </FormGroup>
                <FooterButtons>
                    {this.cancelBtn}
                    <Button
                        onClick={this.submit}
                        disabled={this.isSubmitting}
                        size="small"
                        data-purpose="submit"
                    >
                        {this.warnings.length ? gettext('Proceed') : this.props.submitBtnLabel}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
