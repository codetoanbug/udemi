import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CodingExerciseStore from './coding-exercise.mobx-store';
import {SAVING_STATUS} from './constants';

import './editor-footer.less';

@inject('codingExerciseStore', 'fullscreenStore')
@observer
export default class EditorFooter extends React.Component {
    static propTypes = {
        codingExerciseStore: PropTypes.instanceOf(CodingExerciseStore).isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @observable isResetConfirmationShown = false;

    @autobind
    @action
    showConfirmResetModal() {
        this.isResetConfirmationShown = true;
        this.props.codingExerciseStore.trackEvent('reset_code');
    }

    @autobind
    @action
    hideConfirmResetModal() {
        if (this.isResetConfirmationShown) {
            this.props.codingExerciseStore.trackEvent('reset_code_modal_close');
            this.isResetConfirmationShown = false;
        }
    }

    @autobind
    @action
    cancelConfirmResetModal() {
        this.props.codingExerciseStore.trackEvent('reset_code_modal_cancel');
        this.isResetConfirmationShown = false;
    }

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    @autobind
    @action
    resetCode() {
        this.props.codingExerciseStore.reset();
        this.props.codingExerciseStore.trackEvent('reset_code_modal_confirm');
        this.isResetConfirmationShown = false;
    }

    render() {
        let statusText;
        switch (this.props.codingExerciseStore.savingStatus) {
            case SAVING_STATUS.SAVING:
                statusText = gettext('Saving changes...');
                break;
            case SAVING_STATUS.SUCCESS:
                statusText = gettext('All changes saved');
                break;
            case SAVING_STATUS.ERROR:
                statusText = gettext('Error saving your changes!');
                break;
            default:
                statusText = undefined;
        }

        return (
            <div className="ud-text-xs" styleName="flex-wrap footer">
                <div styleName="flex-wrap messages">
                    <div styleName="message" data-purpose="location-message">
                        {interpolate(
                            gettext('Line %(line)s, Column %(column)s'),
                            {
                                line: this.props.codingExerciseStore.currentLine,
                                column: this.props.codingExerciseStore.currentColumn,
                            },
                            true,
                        )}
                    </div>
                    {statusText && (
                        <div styleName="message" data-purpose="status-message">
                            {statusText}
                        </div>
                    )}
                </div>
                <ModalTrigger
                    trigger={
                        <Button
                            className="ud-link-neutral"
                            udStyle="ghost"
                            size="small"
                            typography="ud-text-sm"
                            data-purpose="reset-button"
                            onClick={this.showConfirmResetModal}
                        >
                            {gettext('Reset code')}
                        </Button>
                    }
                    renderModal={() => (
                        <ConfirmModal
                            isOpen={this.isResetConfirmationShown}
                            onClose={this.hideConfirmResetModal}
                            onCancel={this.cancelConfirmResetModal}
                            onConfirm={this.resetCode}
                            confirmText={gettext('Yes, reset')}
                            getContainer={this.getOverlayContainer}
                        >
                            {gettext(
                                'Are you sure? This will delete the code that you wrote so far to solve this problem.',
                            )}
                        </ConfirmModal>
                    )}
                />
            </div>
        );
    }
}
