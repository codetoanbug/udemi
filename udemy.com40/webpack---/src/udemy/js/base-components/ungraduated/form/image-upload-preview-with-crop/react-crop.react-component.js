/* eslint-disable react/no-set-state */

// This component is a wrapper for react-image-crop
// This component update via state to create a proxy between mobx and
// this react-image-crop component

// This wrapper allow us to use only pixels.
// this.props.crop will be not sync from outside.
// It is not needed right now this feedback loop.

import {withI18n, omitI18nProps} from '@udemy/i18n';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import BaseReactCrop from 'react-image-crop';

import {noop} from 'utils/noop';

import './react-crop.global.less';

export const ERRORS = Object.freeze({
    EXACT_SIZE: 1,
    WRONG_SIZE: 2,
});

@observer
class ReactCrop extends Component {
    static propTypes = {
        minHeight: PropTypes.number.isRequired,
        minWidth: PropTypes.number.isRequired,
        onComplete: PropTypes.func.isRequired,
        aspect: PropTypes.number,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        onImageLoaded: PropTypes.func,
        // gettext and interpolate are provided by `withI18n`
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
        // eslint-disable-next-line react/require-default-props
        interpolate: PropTypes.func,
    };

    static defaultProps = {
        aspect: undefined,
        onChange: noop,
        onError: noop,
        onImageLoaded: noop,
    };

    state = {};

    @autobind
    onChangeHandler(crop, pixelCrop) {
        const {minHeight, minWidth} = this.props;
        // this is checked inside the cropper but in random situations this
        // wrong value surface here.
        if (pixelCrop.height < minHeight || pixelCrop.width < minWidth) {
            return false;
        }
        this.setState({crop});
        if (this.props.onChange) {
            this.props.onChange(crop, pixelCrop);
        }
    }

    @autobind
    onImageLoaded(image) {
        const {
            minHeight,
            minWidth,
            aspect,
            onImageLoaded,
            onComplete,
            onError,
            gettext,
            interpolate,
        } = this.props;

        if (image.naturalHeight === minHeight && image.naturalWidth === minWidth) {
            onError(ERRORS.EXACT_SIZE, null);
            return false;
        }

        if (image.naturalHeight < minHeight || image.naturalWidth < minWidth) {
            const message = interpolate(
                gettext(
                    'The uploaded image is too small. Minimum image size is %(minWidth)sx%(minHeight)spx. Please upload a larger image.',
                ),
                {minWidth, minHeight},
                true,
            );
            onError(ERRORS.WRONG_SIZE, message);
            return false;
        }

        // Some scenarios we need a free image selection so we generate a default aspect ratio.
        const suggestedAspect = aspect || minWidth / minHeight;
        const currentAspect = image.naturalWidth / image.naturalHeight;
        const isWider = currentAspect > suggestedAspect;

        const calculateDimensions = {
            width: !isWider
                ? image.naturalWidth
                : Math.round(image.naturalHeight * suggestedAspect),
            height: isWider
                ? image.naturalHeight
                : Math.round(image.naturalWidth / suggestedAspect),
        };

        // BaseReactCrop works with percentages, so we translate minHeight that is in
        // pixels to a percentage of the image height
        const calculateDimensionsPercentage = {
            height: (100 * calculateDimensions.height) / image.naturalHeight,
            width: (100 * calculateDimensions.width) / image.naturalWidth,
        };

        const pixelCrop = {
            y: (image.naturalHeight - calculateDimensions.height) / 2,
            x: (image.naturalWidth - calculateDimensions.width) / 2,
            ...calculateDimensions,
            aspect,
        };

        const crop = {
            x: (100 - calculateDimensionsPercentage.width) / 2,
            y: (100 - calculateDimensionsPercentage.height) / 2,
            ...calculateDimensionsPercentage,
            aspect,
        };

        this.setState({
            crop,
            minHeight: (100 * minHeight) / image.naturalHeight,
            minWidth: (100 * minWidth) / image.naturalWidth,
        });

        onImageLoaded(image);
        onComplete(crop, pixelCrop);
    }

    render() {
        const {onChange, minHeight, minWidth, aspect, ...props} = omitI18nProps(this.props);

        return (
            <BaseReactCrop
                {...props}
                {...this.state}
                onChange={this.onChangeHandler}
                onImageLoaded={this.onImageLoaded}
            />
        );
    }
}

export default withI18n(ReactCrop);
