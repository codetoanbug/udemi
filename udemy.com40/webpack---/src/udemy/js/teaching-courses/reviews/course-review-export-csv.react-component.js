import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class CourseReviewExportCSV extends Component {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        onExport: PropTypes.func.isRequired,
    };

    @autobind
    onConfirm(onClose) {
        this.props.onExport();
        onClose();
    }

    render() {
        return (
            <ModalTrigger
                trigger={
                    <Button
                        data-purpose="open-confirm-modal"
                        disabled={this.props.disabled}
                        size="medium"
                        udStyle="secondary"
                    >
                        {gettext('Export to CSV...')}
                    </Button>
                }
                renderModal={({isOpen, onClose}) => (
                    <ConfirmModal
                        isOpen={isOpen}
                        onCancel={onClose}
                        onConfirm={() => this.onConfirm(onClose)}
                        title={gettext('Export reviews to CSV')}
                        confirmText={gettext('Export')}
                    >
                        {gettext(
                            'A report of the reviews with the current filter applied will be ' +
                                'generated in CSV format and emailed to you. This may take a few ' +
                                'minutes if you are exporting a large number of reviews. Continue?',
                        )}
                    </ConfirmModal>
                )}
            />
        );
    }
}
