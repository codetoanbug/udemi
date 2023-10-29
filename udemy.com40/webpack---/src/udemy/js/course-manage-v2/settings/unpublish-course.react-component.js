import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

import './course-settings.less';

@withRouter
@observer
export default class UnpublishCourse extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        disabled: PropTypes.bool,
        hasOrganization: PropTypes.bool,
        onUnpublish: PropTypes.func.isRequired,
        window: PropTypes.object, // used by specs to mock window
    };

    static defaultProps = {
        disabled: false,
        hasOrganization: false,
        window,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.forceDisabled && nextProps.disabled !== this.props.disabled) {
            runInAction(() => {
                this.forceDisabled = false;
            });
        }
    }

    @observable forceDisabled = false;

    @autobind
    @action
    unpublishCourse(onClose) {
        this.forceDisabled = true;
        onClose();
        return udApi
            .patch(`/courses/${this.props.courseId}/`, {
                is_published: false,
            })
            .then(() => {
                showSuccessToast(gettext('Your course has been unpublished.'));
                this.props.onUnpublish();
            })
            .catch(
                action(() => {
                    showReloadPageErrorToast(defaultErrorMessage);
                    this.forceDisabled = false;
                }),
            );
    }

    render() {
        const {disabled, hasOrganization} = this.props;
        return (
            <div styleName="mt-md danger-row">
                <ModalTrigger
                    trigger={
                        <Button
                            udStyle="secondary"
                            styleName="danger-btn"
                            size="small"
                            disabled={this.forceDisabled || disabled}
                        >
                            {gettext('Unpublish')}
                        </Button>
                    }
                    renderModal={({isOpen, onClose}) => (
                        <ConfirmModal
                            isOpen={isOpen}
                            title={gettext('Unpublish Your Course?')}
                            onCancel={onClose}
                            confirmText={gettext('Yes')}
                            cancelText={gettext('No')}
                            onConfirm={() => this.unpublishCourse(onClose)}
                        >
                            {gettext('Are you sure you want to unpublish this course?')}
                        </ConfirmModal>
                    )}
                />
                <p styleName="danger-info">
                    {hasOrganization
                        ? gettext(
                              'Users cannot find your course via search, ' +
                                  'but users that have already enrolled can still access content.',
                          )
                        : gettext(
                              'New students cannot find your course via search, but existing students can ' +
                                  'still access content.',
                          )}
                </p>
            </div>
        );
    }
}
