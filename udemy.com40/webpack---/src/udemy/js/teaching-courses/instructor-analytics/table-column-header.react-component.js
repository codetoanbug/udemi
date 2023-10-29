import {pxToRem} from '@udemy/styles';
import PropTypes from 'prop-types';
import React from 'react';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';

import InfoTooltip from './info-tooltip.react-component';

const TableColumnHeader = ({title, tooltip, minWidth, ...htmlProps}) => (
    <WrapWithText
        {...htmlProps}
        style={{minWidth: `${pxToRem(minWidth)}rem`, whiteSpace: 'normal', ...htmlProps.style}}
        text={title}
        graphic={tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
    />
);

TableColumnHeader.propTypes = {
    title: PropTypes.string.isRequired,
    tooltip: PropTypes.node,
    minWidth: PropTypes.number,
};

TableColumnHeader.defaultProps = {
    tooltip: null,
    minWidth: 125,
};

export default TableColumnHeader;
