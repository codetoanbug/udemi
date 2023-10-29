import classNames from 'classnames';
import React from 'react';

import {
    defaultRenderContent,
    RenderContentFunction,
} from '../basic-popper/basic-popper.react-component';
import {
    Popper,
    PopperGetTabOrderElementSelectors,
    PopperProps,
} from '../popper/popper.react-component';
import styles from './tooltip.module.less';

/**
 * React props interface for the `Tooltip` component.
 *
 * @privateRemarks
 * Extends a `Partial` set of the {@link PopperProps} interface.
 */
export interface TooltipProps extends Partial<PopperProps> {
    /** The element that trippers opening a `Tooltip`. */
    trigger: React.ReactElement;
    /** The content of the `Tooltip` */
    children: string | React.ReactNode;
    /**
     * The React.ForwardedRef
     *
     * @remarks
     * This is set internally by the Object.assign of `TooltipBase`.  A user should not need to set this prop.
     */
    forwardedRef?: React.Ref<Popper>;
    /**
     * The Udemy style of the Tooltip
     *
     * @defaultValue 'black' in Tooltip
     */
    udStyle?: 'black' | 'white';
}

const TooltipBase = ({
    a11yRole = 'description',
    forwardedRef,
    udStyle = 'black',
    canToggleOnHover,
    placement = 'top-start',
    trigger,
    renderContent: propsRenderContent = defaultRenderContent,
    getTabOrder = ((selectors: PopperGetTabOrderElementSelectors) => {
        return [
            [selectors.findTriggerNode, selectors.findFirstFocusableInContent],
            [selectors.findLastFocusableInContent, selectors.findTriggerNode],
        ];
    }) as PopperProps['getTabOrder'],
    getScrollContainers = () => [],
    ...props
}: TooltipProps) => {
    const renderContent: RenderContentFunction = (props, placement, offset) => {
        const classes = classNames('ud-text-sm', styles.tooltip, {
            [styles.white]: udStyle === 'white',
        });
        props.children = <div className={classes}>{props.children}</div>;
        return propsRenderContent(props, placement, offset);
    };

    return (
        <Popper
            trigger={trigger}
            ref={forwardedRef}
            a11yRole={a11yRole}
            getScrollContainers={getScrollContainers}
            getTabOrder={getTabOrder}
            canToggleOnHover={true}
            placement={placement}
            renderContent={renderContent}
            {...props}
        />
    );
};

/** The Tooltip component.  */
export const Tooltip = Object.assign(
    React.forwardRef<Popper, TooltipProps>((props, ref) => (
        <TooltipBase {...props} forwardedRef={ref} />
    )),
    {displayName: 'Tooltip'},
);
