import classNames from 'classnames';
import React from 'react';

// Note: BaseIcon CSS is served up via the react-core-components.global.css file;

/**
 * Method to determine if React component is a `Icon` or `BaseIcon` component.
 * @returns boolean - true implies that it is `Icon` or `BaseIcon`, based on `displayName`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isIcon = (element: any) => {
    const validIconDisplayNames = ['Icon', 'BaseIcon'];

    return validIconDisplayNames.includes(element?.type?.displayName);
};

/** Various sizes allowed for Iconography */
export type BaseIconSize =
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'xxxlarge';

export interface BaseIconProps extends React.HTMLAttributes<SVGElement> {
    /** Color used to shade icon via class
     * @defaultValue `neutral`
     */
    color?:
        | 'neutral'
        | 'positive'
        | 'negative'
        | 'info'
        | 'warning'
        | 'subdued'
        | 'subdued-inverted'
        | 'inherit';
    /** String extracted from `.ud-icon` file and appended to `#icon-` within SVG.
     *  e.g. `arrow-right` from `arrow-right.ud-icon`.
     *  Used to map to SVG symbol definition.  */
    glyph: string;
    /** aria-label used for icon */
    label: string | false;
    /** Size of the icon
     * See {@link BaseIconSize| the BaseIconSize type} for more details.
     * @defaultValue `BaseIconSize.small`
     */
    size?: BaseIconSize;
}

const displayName = 'BaseIcon';
const $$udType = 'BaseIcon';

/**
 * Do not use this component directly.
 * This is the BaseIcon component used by our Webpack loader to display a `.ud-icon` file.
 */
const BaseIconComponent = ({
    color = 'neutral',
    size = 'small',
    label,
    glyph,
    className,
    ...props
}: BaseIconProps) => {
    const colorClass = color === 'inherit' ? null : `ud-icon-color-${color}`;

    return (
        // Django and Lightning render an SVG Definition block (one big <svg />) that defines every icon
        <svg
            // eslint-disable-next-line @typescript-eslint/naming-convention
            aria-hidden={label === false ? true : undefined}
            aria-label={label === false ? undefined : label}
            role={label === false ? undefined : 'img'}
            focusable="false"
            {...props}
            className={classNames('ud-icon', `ud-icon-${size}`, colorClass, className)}
        >
            <use xlinkHref={`#icon-${glyph}`} />
        </svg>
    );
};

/**
 * Do not use this component directly.
 * This is the BaseIcon component used by our Webpack loader to display a `.ud-icon` file.
 */
export const BaseIcon = Object.assign(BaseIconComponent, {displayName, $$udType});
