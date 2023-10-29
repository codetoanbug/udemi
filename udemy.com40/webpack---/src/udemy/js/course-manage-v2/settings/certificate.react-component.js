import {Button} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';

import './course-settings.less';

@inject('store')
@observer
export default class Certificate extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    @action
    updateValue(e) {
        this.props.store.certificateStore.updateCertificateEnabled(e.target.checked);
    }

    @autobind
    onSubmit(e) {
        e.preventDefault();
        return this.props.store.certificateStore.saveCertificateEnabledStatus();
    }

    render() {
        if (!this.props.store.certificateStore) {
            return null;
        }
        if (!this.props.store.certificateStore.course.organizationId) {
            return null;
        }
        return (
            <MainContent>
                <form styleName="line-length-md" onSubmit={this.onSubmit}>
                    <h3 className="ud-heading-md">{gettext('Certificates')}</h3>
                    <Checkbox
                        name="certificate"
                        size="large"
                        checked={this.props.store.certificateStore.course.certificateEnabled}
                        onChange={this.updateValue}
                    >
                        {gettext('Enable certificate')}
                    </Checkbox>
                    <p styleName="mt-sm">
                        {gettext(
                            'When students finish your course, you have the option of providing ' +
                                'them with a digital certificate of completion containing your company logo.',
                        )}
                    </p>
                    <div styleName="mt-sm">
                        <Button
                            type="submit"
                            disabled={this.props.store.certificateStore.isSaving}
                            data-purpose="save-certificate"
                        >
                            {gettext('Save')}
                        </Button>
                    </div>
                </form>
            </MainContent>
        );
    }
}
