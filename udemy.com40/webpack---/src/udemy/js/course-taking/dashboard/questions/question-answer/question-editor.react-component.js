import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import requires from '../../../registry/requires';

import './question-editor.less';

@requires('questionAnswerStore')
@observer
export default class QuestionEditor extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.object.isRequired,
        question: PropTypes.object.isRequired,
        extraTitleEditorProps: PropTypes.object.isRequired,
        extraBodyEditorProps: PropTypes.object.isRequired,
        submitBtnLabel: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func,
        showFormLabels: PropTypes.bool,
    };

    static defaultProps = {
        onCancel: undefined,
        showFormLabels: true,
    };

    @observable isSubmitting = false;
    @observable warnings = [];

    @autobind
    onTitleChange(event) {
        this.props.question.setTitle(event.target.value);
    }

    @autobind
    @action
    submit() {
        this.isSubmitting = true;
        this.props.questionAnswerStore
            .saveQuestion(this.props.question, !!this.warnings.length)
            .then(
                action(() => {
                    this.isSubmitting = false;
                    this.warnings = [];
                    this.props.onSave();
                }),
            )
            .catch(
                action(({response}) => {
                    this.isSubmitting = false;
                    this.warnings = [];
                    const data = response.data;
                    if (data && data.title && data.title.length) {
                        const title = data.title[0];
                        if (title.type === 'warning' && title.messages && title.messages.length) {
                            this.warnings = title.messages;
                        } else if (typeof title === 'string') {
                            this.warnings = [`${gettext('Title or summary')}: ${title}`];
                        }
                    } else if (data && data.body && data.body.length) {
                        const body = data.body[0];
                        if (body.type === 'warning' && body.messages && body.messages.length) {
                            this.warnings = body.messages;
                        }
                    }
                }),
            );
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
        let alert;
        if (this.warnings.length) {
            alert = (
                <AlertBanner
                    styleName="alert-banner"
                    udStyle="warning"
                    title={gettext('Warning')}
                    body={
                        <div
                            className="ud-text-with-links"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'question-editor:warnings',
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
            <div styleName="question-editor">
                {alert}
                <FormGroup
                    label={gettext('Title or summary')}
                    labelProps={this.props.showFormLabels ? {} : {className: 'ud-sr-only'}}
                >
                    <TextInputWithCounter
                        autoFocus={true}
                        maxLength={255}
                        value={this.props.question.title}
                        onChange={this.onTitleChange}
                        size="small"
                        data-purpose="question-title"
                        {...this.props.extraTitleEditorProps}
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Details (optional)')}
                    labelProps={this.props.showFormLabels ? {} : {className: 'ud-sr-only'}}
                >
                    <RichTextEditor
                        value={this.props.question.body}
                        onValueChange={this.props.question.setBody}
                        {...this.props.extraBodyEditorProps}
                    />
                </FormGroup>
                <FooterButtons>
                    {this.cancelBtn}
                    <Button
                        onClick={this.submit}
                        disabled={this.isSubmitting || !this.props.question.title}
                        udStyle="primary"
                        size={this.cancelBtn ? 'small' : 'medium'}
                        style={this.cancelBtn ? null : {width: '100%'}}
                        data-purpose="post-question"
                    >
                        {this.warnings.length ? gettext('Proceed') : this.props.submitBtnLabel}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
