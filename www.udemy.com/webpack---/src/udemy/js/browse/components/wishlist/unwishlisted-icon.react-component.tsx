/**
 * Warning: this is no longer the canonical version of this module/file.
 *
 * The canonical code is now published in `@udemy/shopping`
 *
 * Avoid updating this file as it may be removed soon. If you need to make changes
 * then please remove this file and update all references to point to the version
 * published in the package above. Apply your changes to the version in that package.
 **/

import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import React from 'react';

const unwishlistedStyle = {
    fill: 'transparent',
    padding: '1px',
    stroke: 'currentColor',
    strokeWidth: '2',
};

export const UnwishlistedIcon = (props: unknown) => (
    <WishlistedIcon label={false} {...props} style={unwishlistedStyle} />
);

UnwishlistedIcon.$$udType = 'Icon';
