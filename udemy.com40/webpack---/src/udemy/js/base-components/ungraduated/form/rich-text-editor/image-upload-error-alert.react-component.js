import {useI18n} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextEditorModel from './rich-text-editor.mobx-model';

const ImageUploadErrorAlert = observer(({model, hideWhenActiveModal = false}) => {
    const {gettext} = useI18n();

    if (!model.imageUploader.hasError || (hideWhenActiveModal && model.activeModal)) {
        return null;
    }

    return (
        <AlertBanner
            udStyle="error"
            className="rt-menu-bar-alert"
            showIcon={false}
            title={model.imageUploader.errorMessage}
            ctaText={gettext('Dismiss')}
            dismissButtonProps={false}
            onAction={model.imageUploader.resetError}
        />
    );
});

ImageUploadErrorAlert.propTypes = {
    model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
    hideWhenActiveModal: PropTypes.bool,
};

ImageUploadErrorAlert.displayName = 'ImageUploadErrorAlert';

export default ImageUploadErrorAlert;
