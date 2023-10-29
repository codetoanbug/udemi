import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import PropTypes from 'prop-types';
import React from 'react';

const BulkDownloadModal = ({isOpen, onClose, handleExport}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={gettext('Export Course Captions')}>
        <p>
            {gettext(
                'Your captions will be prepared and emailed to you shortly. ' +
                    'This might take a few minutes depending on the number of video lectures. Continue?',
            )}
        </p>
        <FooterButtons>
            <Button udStyle="ghost" onClick={onClose}>
                {gettext('Cancel')}
            </Button>
            <Button onClick={handleExport}>{gettext('Export')}</Button>
        </FooterButtons>
    </Modal>
);
BulkDownloadModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleExport: PropTypes.func.isRequired,
};

export default BulkDownloadModal;
