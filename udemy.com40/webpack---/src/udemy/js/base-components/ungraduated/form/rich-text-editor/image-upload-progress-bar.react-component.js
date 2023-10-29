import {useI18n} from '@udemy/i18n';
import {Meter} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isBrowserFeatureAvailable} from './helpers';
import RichTextEditorModel from './rich-text-editor.mobx-model';

const ImageUploadProgressBar = observer(({model, hideWhenActiveModal = false}) => {
    const {gettext} = useI18n();

    if (
        model.imageUploader.progressPercentage === null ||
        (hideWhenActiveModal && model.activeModal)
    ) {
        return null;
    }

    const hasProgressInfo = isBrowserFeatureAvailable('UPLOAD_API');
    return (
        <Meter
            className="rt-image-upload-progress-bar"
            data-purpose="image-upload-progress-bar"
            value={hasProgressInfo ? model.imageUploader.progressPercentage : 100}
            min={0}
            max={100}
            label={gettext('%(percent)s% complete')}
        />
    );
});

ImageUploadProgressBar.propTypes = {
    model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
    hideWhenActiveModal: PropTypes.bool,
};

ImageUploadProgressBar.displayName = 'ImageUploadProgressBar';

export default ImageUploadProgressBar;
