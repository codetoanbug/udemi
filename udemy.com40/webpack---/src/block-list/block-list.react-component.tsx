/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import React, {ForwardedRef, createContext, useContext} from 'react';

import {Button} from '../button/button.react-component';

// Note: BlockList CSS is served up via the react-core-components.global.css file;

/** The size of a BlockList */
export type BlockListSize = 'small' | 'large';
type BlockListPadding = 'tight' | 'normal' | 'loose';

/** React props interface for BlockList component. Also used for the Dropdown component */
export interface BlockListProps extends React.HTMLAttributes<HTMLUListElement> {
    /**
     * Size of the BlockList.
     * @see {@link BlockListSize| the BlockListSize type} for more details.
     */
    size: BlockListSize;
    /**
     * Padding of the BlockList.
     * @see {@link BlockListPadding| the BlockListPadding type} for more details.
     */
    padding?: BlockListPadding;
    /** Icon Alignment within a Blocklist, left or right */
    iconAlignment?: 'left' | 'right';
    /**
     * Render function for BlockList.Item. Used for custom BlockList.Items.
     *
     * @defaultValue (child: JSX.Element) => (child ? <li>{child}</li> : null)
     */
    renderListItem?: (child: JSX.Element) => JSX.Element | null;
}

const BlockListContext = createContext({iconAlignment: '', padding: '', size: ''});

/**
 * BlockList component.  Functional React component implementing {@link BlockListProps| the BlockListProps interface}
 */
export const BlockList = ({
    size,
    padding = 'normal',
    iconAlignment = 'left',
    children,
    renderListItem = (child: JSX.Element) => (child ? <li>{child}</li> : null),
    ...htmlProps
}: BlockListProps) => {
    const listItems = React.Children.map(children as JSX.Element | JSX.Element[], renderListItem);
    if (!listItems || listItems.length === 0) {
        return null;
    }
    return (
        <BlockListContext.Provider value={{iconAlignment, padding, size}}>
            <ul
                {...htmlProps}
                className={classNames('ud-unstyled-list ud-block-list', htmlProps.className)}
            >
                {listItems}
            </ul>
        </BlockListContext.Provider>
    );
};

const renderItemIcon = (icon: JSX.Element, size: string) => {
    return React.cloneElement(icon, {
        className: classNames(icon.props.className, 'ud-block-list-item-icon'),
        size: size === 'large' ? 'small' : 'xsmall',
    });
};

/**
 * Utility type to support polymorphic component. Defines the prop that defines
 * the element that will be rendered by the polymorphic component.
 */
interface PolymorphicComponentClassProp<C extends React.ElementType> {
    componentClass?: C;
}

/**
 * Utility type to support polymorphic component. Extracts type keys.
 */
type PropsToOmit<C extends React.ElementType, P> = keyof (PolymorphicComponentClassProp<C> & P);

/**
 * Utility type to implement polymorphic component, where a prop describes the component
 * to render. (E.g., `<Foo as={'button'} onClick={...}>Click Me</Foo>`).
 *
 * In this case the polymorphic prop type checking hinges on `componentClass`.
 *
 * Solution based on
 * {@link https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/}.
 */
type PolymorphicComponentProp<C extends React.ElementType, Props> = React.PropsWithChildren<
    Props & PolymorphicComponentClassProp<C>
> &
    // Note: Omit does not adequately accommodate the discriminated union on Button's prop types
    Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/**
 * Props specific to the block list item
 */
interface BlockListItemBase {
    /** Optional icon element to use for the BlockListItem */
    icon?: JSX.Element | null;
    /**
     * Color of text within BlockListItem
     *
     * @defaultValue `link` if href is given, else `neutral`
     */
    color?: 'neutral' | 'link';
    /**
     * Flag to determine if content is loading
     *
     * @defaultValue `false`
     */
    loading?: boolean;
    /**
     * Corresponds to id prop in `CheckedStateCheckbox` and `CheckedStateRadioGroup`.
     * Maintained for legacy `CheckedState` mechanism.
     *
     * @internalRemarks
     * `Button` accepts this prop, but it is not on prop types for `<a>` or `<button>`,
     * so we cannot rely on the polymorphic component type to catch it.
     */
    cssToggleId?: string;
}

/**
 * Props for `BlickListItem` component (also, `BlockList.Item`).
 *
 * @remarks
 *
 * Implements polymorphic component. Props for `BlockListItem` are
 * checked against the props for the element passed via `classComponent`
 * prop.
 */
export type BlockListItemProps<C extends React.ElementType> = PolymorphicComponentProp<
    C,
    BlockListItemBase
>;

/**
 * React component for rendering a BlockList.Item. Implements the
 * {@link BlockListItemProps| the BlockListItemProps type}
 *
 * @internalRemarks
 *
 * Default generic C to `<a>` to provide type checking in the case where no
 * `componentClass` is specified, and we detect an `href` prop and set the
 * rendered component to an anchor element.
 **/

export const BlockListItem = Object.assign(
    React.forwardRef<
        HTMLDivElement | Button | React.ElementType,
        BlockListItemProps<React.ElementType>
    >(
        <C extends React.ElementType = 'a'>(
            {
                icon,
                color,
                componentClass,
                children,
                loading = false,
                ...htmlProps
            }: BlockListItemProps<C>,
            ref: ForwardedRef<HTMLDivElement | Button | React.ElementType>,
        ) => {
            const parentBlock = useContext(BlockListContext);
            const {iconAlignment, padding, size} = parentBlock;
            const iconLeft = icon && iconAlignment === 'left' ? renderItemIcon(icon, size) : null;
            const iconRight = icon && iconAlignment === 'right' ? renderItemIcon(icon, size) : null;

            const content = (
                <div
                    className={classNames('ud-block-list-item-content', {
                        'ud-block-list-item-content-loading': loading,
                    })}
                >
                    {/* When loading, render &nbsp; so that the loading bar matches the height
                of one line of text. It has to be &nbsp; not {' '}. */}
                    {loading ? '\u00A0' : children}
                </div>
            );

            const colorClassKey = color ?? (htmlProps.href ? 'link' : 'neutral');
            const typographyClassName = size === 'large' ? 'ud-text-md' : 'ud-text-sm';
            const elementType = loading ? 'div' : htmlProps.href ? 'a' : componentClass ?? 'div';

            const commonClassName = classNames(
                htmlProps.className,
                'ud-block-list-item',
                `ud-block-list-item-${size}`,
                padding !== 'normal' ? `ud-block-list-item-${padding}` : '',
                `ud-block-list-item-${colorClassKey}`,
            );

            if (elementType === 'div') {
                return (
                    <div
                        ref={ref as ForwardedRef<HTMLDivElement>}
                        {...htmlProps}
                        className={classNames(commonClassName, typographyClassName)}
                    >
                        {iconLeft}
                        {content}
                        {iconRight}
                    </div>
                );
            }

            if (elementType === 'a' || elementType === 'button') {
                const itemProps = {
                    componentClass: elementType,
                    typography: typographyClassName,
                    udStyle: 'ghost',
                };

                return (
                    // `Omit` in `PolymorphicComponentProp` fails to handle Button's discriminated
                    // union props for this render. Props for BlockList.Item are still checked, however.
                    // @ts-expect-error missing 'to' prop
                    <Button ref={ref} {...htmlProps} className={commonClassName} {...itemProps}>
                        {iconLeft}
                        {content}
                        {iconRight}
                    </Button>
                );
            }

            // Here we lose prop checking on `ItemElement` for this render. Props for
            // BlockList.Item are still checked against `componentClass` element type, however.
            const ItemElement = elementType as React.ElementType;

            return (
                <ItemElement
                    ref={ref}
                    {...(htmlProps as React.ComponentPropsWithoutRef<typeof ItemElement>)}
                    className={commonClassName}
                >
                    {iconLeft}
                    {content}
                    {iconRight}
                </ItemElement>
            );
        },
    ),
    {displayName: 'BlockListItem'},
);

BlockList.Item = BlockListItem;
