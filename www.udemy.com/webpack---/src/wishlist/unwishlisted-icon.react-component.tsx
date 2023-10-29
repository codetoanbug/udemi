import React from 'react';

import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import {BaseIconProps} from '@udemy/react-core-components';

const unwishlistedStyle = {
    fill: 'transparent',
    padding: '1px',
    stroke: 'currentColor',
    strokeWidth: '2',
};

export const UnwishlistedIcon = (props: Partial<BaseIconProps>) => (
    <WishlistedIcon label={false} {...props} style={unwishlistedStyle} />
);

UnwishlistedIcon.$$udType = 'Icon';
