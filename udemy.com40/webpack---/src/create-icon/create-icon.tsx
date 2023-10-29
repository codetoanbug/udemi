import React from 'react';

import {BaseIcon, BaseIconProps} from '../base-icon/base-icon.react-component';

/** Do not use this directly.  This function is used by the Webpack `.ud-icon` loader
 * @param glyph string to use to render the correct SVG symbol definition
 * @returns BaseIcon React component
 */
export function createIcon(glyph: string) {
    const icon = ({...props}: BaseIconProps) => <BaseIcon {...props} glyph={glyph} />;
    // $$udType is used to inform parent components if certain props (ie. color="inherit") should be applied.
    icon.displayName = 'Icon';
    icon.$$udType = 'Icon';
    return icon;
}
