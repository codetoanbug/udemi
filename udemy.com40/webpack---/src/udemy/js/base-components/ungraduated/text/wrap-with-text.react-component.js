import PropTypes from 'prop-types';
import React from 'react';

const WrapWithText = ({componentClass: ComponentClass, text, graphic, ...props}) => (
    <ComponentClass {...props}>
        {graphic ? text.slice(0, text.length - 1) : text}
        {graphic && (
            <span style={{whiteSpace: 'nowrap'}}>
                {text[text.length - 1]}
                {graphic}
            </span>
        )}
    </ComponentClass>
);

WrapWithText.propTypes = {
    text: PropTypes.string.isRequired,
    graphic: PropTypes.node,
    componentClass: PropTypes.elementType,
};

WrapWithText.defaultProps = {
    componentClass: 'div',
    graphic: null,
};

export default WrapWithText;
