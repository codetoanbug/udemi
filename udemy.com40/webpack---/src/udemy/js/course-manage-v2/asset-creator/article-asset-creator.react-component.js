import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {assetTypes} from '../asset-library/constants';
import CurriculumLectureModel from '../curriculum/item/lecture/curriculum-lecture.mobx-model';
import './form-asset-creator.less';

@observer
export default class ArticleAssetCreator extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        onSave: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.form.reset(this.props.curriculumItem.asset);
    }

    get form() {
        return this.props.curriculumItem.assetForms[assetTypes.article];
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.form.save((asset) => this.props.onSave(asset.id), handleUnexpectedAPIError);
    }

    get submitLabel() {
        const bodyError = this.form.bodyError;
        if (bodyError && bodyError.type === 'warning') {
            return gettext('Proceed');
        }
        return gettext('Save');
    }

    renderErrorAlert() {
        const bodyError = this.form.bodyError;
        if (!bodyError) {
            return null;
        }
        // Even without the <br /> tags, error messages can contain HTML, e.g. support links.
        return (
            <AlertBanner
                showCta={false}
                udStyle="error"
                styleName="alert-banner"
                data-purpose="error-alert"
                title={
                    <div
                        className="ud-text-with-links"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'article-asset-creator:body-errors',
                            domPurifyConfig: {ADD_ATTR: ['target']},
                            html: bodyError.messages.join(' '),
                        })}
                    />
                }
            />
        );
    }

    render() {
        const form = this.form;
        return (
            <form styleName="form" onSubmit={this.onSubmit}>
                {this.renderErrorAlert()}
                <FormGroup label={gettext('Text')}>
                    <RichTextEditor
                        theme={RichTextEditor.THEMES.ARTICLE_LECTURE}
                        value={form.data.body}
                        onValueChange={form.setBody}
                        autoFocus={true}
                    />
                </FormGroup>
                <div styleName="submit-row">
                    <Button
                        type="submit"
                        size="small"
                        disabled={form.isSaving || this.props.curriculumItem.isSaving}
                    >
                        {this.submitLabel}
                    </Button>
                </div>
            </form>
        );
    }
}
