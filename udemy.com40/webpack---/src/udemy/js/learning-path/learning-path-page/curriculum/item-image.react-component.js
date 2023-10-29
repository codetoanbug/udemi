import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import {COURSE_IMAGE_DIMENSIONS} from '../constants';

import './item-image.less';

const ItemImage = (props) => {
    const {src, title, ...imgProps} = props;
    if (src) {
        return (
            <div styleName="image-container">
                <Image
                    src={src}
                    alt={title}
                    width="unset"
                    data-ot-ignore={true}
                    {...COURSE_IMAGE_DIMENSIONS}
                    {...imgProps}
                />
            </div>
        );
    }
    return (
        <div styleName="placeholder" data-purpose="item-image-placeholder">
            <div styleName="placeholder__icon-container">
                <LinkIcon size="medium" label={false} />
            </div>
        </div>
    );
};

ItemImage.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
};

ItemImage.defaultProps = {
    src: '',
    title: 'untitled link',
};

export default ItemImage;
