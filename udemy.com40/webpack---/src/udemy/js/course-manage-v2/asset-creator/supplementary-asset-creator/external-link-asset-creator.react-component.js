import {Button} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import {assetTypes} from '../../asset-library/constants';
import CurriculumLectureModel from '../../curriculum/item/lecture/curriculum-lecture.mobx-model';
import '../form-asset-creator.less';

@observer
export default class ExternalLinkAssetCreator extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        onSave: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.form.reset();
    }

    get form() {
        return this.props.curriculumItem.assetForms[assetTypes.externalLink];
    }

    @autobind
    onChange(event) {
        this.form.setField(event.target.name, event.target.value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.form.save((asset) => this.props.onSave(asset.id), handleUnexpectedAPIError);
    }

    render() {
        const form = this.form;
        return (
            <form styleName="form" onSubmit={this.onSubmit}>
                <FormGroup
                    label={gettext('Title')}
                    note={form.error.title || null}
                    validationState={form.error.title ? 'error' : 'neutral'}
                >
                    <TextInput
                        name="title"
                        placeholder={gettext('A descriptive title')}
                        required={true}
                        value={form.data.title}
                        onChange={this.onChange}
                        data-purpose="title-field"
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('URL')}
                    note={form.error.url || null}
                    validationState={form.error.url ? 'error' : 'neutral'}
                >
                    <TextInput
                        name="url"
                        placeholder="https://example.com"
                        type="url"
                        required={true}
                        value={form.data.url}
                        onChange={this.onChange}
                        data-purpose="url-field"
                    />
                </FormGroup>
                <div styleName="submit-row">
                    <Button
                        type="submit"
                        size="small"
                        disabled={form.isSaving || this.props.curriculumItem.isSaving}
                    >
                        {gettext('Add link')}
                    </Button>
                </div>
            </form>
        );
    }
}
