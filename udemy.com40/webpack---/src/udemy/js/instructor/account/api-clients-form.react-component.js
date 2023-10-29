import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, TextAreaWithCounter, FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udApi, {defaultErrorMessage} from 'utils/ud-api';

import './api-clients-form.less';

@observer
export default class ApiClientsForm extends Component {
    static propTypes = {onSubmitted: PropTypes.func};
    static defaultProps = {onSubmitted: null};

    @observable isSubmitting = false;
    fields = ['name', 'description', 'website'];
    @observable.ref data = {};
    @observable.ref errors = {};

    getValidationProps(fieldName) {
        return this.errors[fieldName] && {validationState: 'error', note: this.errors[fieldName]};
    }

    @autobind @action onChange(event) {
        // name="name" is considered a security risk by DOMPurify, so we use data-name instead.
        this.data[event.target.dataset.name] = event.target.value;
    }

    @autobind @action async onSubmit(event) {
        event.preventDefault();
        this.isSubmitting = true;
        try {
            const response = await udApi.post('/users/me/api-clients/', this.data);
            this.onSubmitted(response, null);
        } catch (e) {
            this.onSubmitted(null, e.response && e.response.data);
        }
    }

    @action onSubmitted(successResponse, errors) {
        this.isSubmitting = false;
        if (successResponse) {
            this.errors = {};
            this.props.onSubmitted && this.props.onSubmitted();
        } else if (errors && (errors.detail || this.fields.some((field) => errors[field]))) {
            this.errors = errors;
        } else {
            this.errors = {detail: defaultErrorMessage};
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} styleName="form">
                {this.errors.detail && (
                    <AlertBanner
                        udStyle="error"
                        title={this.errors.detail}
                        showCta={false}
                        styleName="general-errors"
                    />
                )}
                <FormGroup
                    label={gettext('Name')}
                    note={gettext('Give a name for your client')}
                    {...this.getValidationProps('name')}
                >
                    <TextInputWithCounter
                        data-name="name"
                        maxLength={50}
                        onChange={this.onChange}
                        placeholder={gettext('Your client name')}
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Description')}
                    note={gettext(
                        'Please describe in detail how you are planning to use Udemy API with this client.',
                    )}
                    {...this.getValidationProps('description')}
                >
                    <TextAreaWithCounter
                        data-name="description"
                        maxLength={255}
                        onChange={this.onChange}
                        placeholder={gettext('Your client description')}
                        rows="5"
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Website')}
                    note={gettext(
                        'Your application or website’s publicly accessible home page, where users can go to download, make use of, or find out more about your application/website.',
                    )}
                    {...this.getValidationProps('website')}
                >
                    <TextInputWithCounter
                        data-name="website"
                        placeholder={gettext('Your website URL')}
                        onChange={this.onChange}
                        maxLength={255}
                        type="url"
                    />
                </FormGroup>
                <FooterButtons>
                    <Button disabled={this.isSubmitting} type="submit">
                        {gettext('Save')}
                    </Button>
                </FooterButtons>
            </form>
        );
    }
}
