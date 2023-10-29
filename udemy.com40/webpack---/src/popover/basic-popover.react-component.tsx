import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
    BasicPopper,
    BasicPopperProps,
    basicPopperPropTypes,
    getMajorPlacement,
    RenderContentFunction,
} from '../basic-popper/basic-popper.react-component';
import styles from '../popover/popover.module.less';

/** Props required by makePopover HOC */
interface AssumedPopperProps {
    /** @see {@link BasicPopperProps} */
    renderContent?: BasicPopperProps['renderContent'];
}

/**
 * Props for popovers specifically; used to augment base popper
 * component props.
 */
export interface BasePopoverProps extends AssumedPopperProps {
    /**
     * Flag to include arrow comping from popover box
     *
     * @defaultValue true in {@link makePopover}
     * @internal
     */
    withArrow?: boolean;
    /**
     * Flag to include padding inside popover box
     *
     * @defaultValue true in {@link makePopover}
     * @internal
     */
    withPadding?: boolean;
}

/**
 * Higher-order component to create popover from popper base
 * components.
 *
 * @typeParam TPopperProps - React props interface for the base popper component
 * @param PopperComponent - base popper component to be extended
 * @param popperComponentPropTypes - propTypes object for the base popper
 * @returns a `Popover` component with a forwarded ref to the base Popper component
 *
 * @remarks
 * `popperComponentPropTypes` is a separate parameter because BasicPopper does
 * not have a static field `propTypes`.
 *
 * @internal
 */
export function makePopover<TPopperProps extends AssumedPopperProps>(
    PopperComponent: React.ComponentClass<TPopperProps>,
    popperComponentPropTypes: React.ComponentClass['propTypes'],
) {
    type WrapperPopoverProps = TPopperProps &
        BasePopoverProps & {
            // Only used internally; not exposed to Popover consumers
            forwardedRef: React.ForwardedRef<React.Component<TPopperProps>>;
        };

    const Popover = ({
        forwardedRef,
        withArrow = true,
        withPadding = true,
        renderContent = PopperComponent.defaultProps?.renderContent,
        ...props
    }: WrapperPopoverProps) => {
        const localRenderContent: RenderContentFunction = (
            renderContentProps,
            placement,
            offset,
        ) => {
            let arrow;
            const majorPlacement = getMajorPlacement(placement);
            let majorOffsetStyle = `popover-${majorPlacement}`;
            if (withArrow && offset !== null) {
                majorOffsetStyle = `${majorOffsetStyle}-arrow`;
                const offsetPx = `${offset}px`;
                let arrowOffset;
                switch (majorPlacement) {
                    case 'top':
                        arrowOffset = {top: '100%', left: offsetPx};
                        break;
                    case 'bottom':
                        arrowOffset = {top: 0, left: offsetPx};
                        break;
                    case 'left':
                        arrowOffset = {top: offsetPx, left: '100%'};
                        break;
                    case 'right':
                        arrowOffset = {top: offsetPx, left: 0};
                        break;
                }
                arrow = (
                    <div
                        className={classNames(styles.arrow, styles[`arrow-${majorPlacement}`])}
                        style={arrowOffset}
                    />
                );
            }

            renderContentProps.children = (
                <div
                    className={classNames(styles.popover, styles[majorOffsetStyle], {
                        [styles['popover-padding']]: withPadding,
                    })}
                >
                    <div className={styles.inner}>{renderContentProps.children}</div>
                    {arrow}
                </div>
            );

            return renderContent?.(renderContentProps, placement, offset);
        };

        return (
            <PopperComponent
                ref={forwardedRef}
                // Type checking works on makePopover arguments, but sadly, not
                // here. Improve this by avoiding the cast. Inspiration from
                // https://react-typescript-cheatsheet.netlify.app/docs/hoc/react_hoc_docs/#docs-example-use-hocs-for-cross-cutting-concerns
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(props as unknown as TPopperProps)}
                renderContent={localRenderContent}
            />
        );
    };

    return Object.assign(
        React.forwardRef<React.Component<TPopperProps>, TPopperProps & BasePopoverProps>(
            (props, ref) => <Popover {...props} forwardedRef={ref} />,
        ),
        {
            // Retain propTypes and defaultProps for consuming components that
            // reference them or spread them into their own classes.
            propTypes: {
                ...popperComponentPropTypes,
                withArrow: PropTypes.bool,
                withPadding: PropTypes.bool,
            },
            defaultProps: {
                // Do not need to explicitly include renderContent since we assume that
                // it is coming from PopperComponent. (See Popover function params.)
                ...PopperComponent.defaultProps,
                withArrow: true,
                withPadding: true,
            },
        },
    );
}

export type BasicPopoverProps = BasicPopperProps & BasePopoverProps;

/**
 * BasicPopover component. Use this rather than {@link Popover} if you don't need the
 * extra features offered by that component.
 */
export const BasicPopover = makePopover<BasicPopperProps>(BasicPopper, basicPopperPropTypes);
BasicPopover.displayName = 'BasicPopover';
