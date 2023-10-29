import {Image, Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './empty-state.less';

const EmptyState = ({layout, imageProps, title, subtitle, ctaProps}) => {
    let image;
    if (imageProps) {
        const {src2x, ...restImageProps} = imageProps;
        image = (
            <Image
                alt=""
                width={240}
                height={240}
                {...restImageProps}
                srcSet={src2x && `${restImageProps.src} 1x, ${src2x} 2x`}
            />
        );
    }

    return (
        <div styleName={classNames('container', layout)}>
            {image}
            <div>
                {title && (
                    <h3 className="ud-heading-lg" styleName="title">
                        {title}
                    </h3>
                )}
                {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                {ctaProps && <Button {...ctaProps} styleName="cta" />}
            </div>
        </div>
    );
};

EmptyState.propTypes = {
    layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    imageProps: PropTypes.object,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    ctaProps: PropTypes.object,
};

EmptyState.defaultProps = {
    imageProps: null,
    title: null,
    subtitle: null,
    ctaProps: null,
};

export default EmptyState;
