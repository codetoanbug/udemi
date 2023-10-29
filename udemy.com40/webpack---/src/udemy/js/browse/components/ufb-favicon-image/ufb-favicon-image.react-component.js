import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';
import PropTypes from 'prop-types';
import React from 'react';

import {PRO_PATH_FAVICON} from 'learning-path/constants';

const IMAGE_SIZE = 24;

const UfbFaviconImage = ({height, width, isProPath, ...props}) => {
    const {gettext} = useI18n();
    const {Config: udConfig} = useUDData();
    const org = udConfig.brand.organization;
    const srcUrl = isProPath ? PRO_PATH_FAVICON : org.favicon_url;

    return org.favicon_image > 0 || isProPath ? (
        <Image
            src={srcUrl}
            alt={gettext('Organization icon')}
            width={width}
            height={height}
            {...props}
        />
    ) : null;
};

UfbFaviconImage.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    isProPath: PropTypes.bool,
};

UfbFaviconImage.defaultProps = {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    isProPath: false,
};

export default UfbFaviconImage;
