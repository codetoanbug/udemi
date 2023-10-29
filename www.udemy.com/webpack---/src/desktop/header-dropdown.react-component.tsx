import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import {FocusCycle} from '@udemy/design-system-utils';
import {Button, ButtonProps, IconButton} from '@udemy/react-core-components';
import {
    BasicPopover,
    BasicPopoverProps,
    BasicPopper,
    menuAim,
    MenuAimArea,
    RenderContentFunction,
} from '@udemy/react-popup-components';

import styles from './desktop-header.module.less';

export function forceHover(selector: string, mousePos: {x: number; y: number}) {
    // On Chrome, manually trigger hover on the element behind the menu-aim triangle.
    setTimeout(() => {
        const {x, y} = mousePos;
        const hoverEl = Array.from(document.querySelectorAll(selector)).find((el) => {
            const {top, right, bottom, left} = el.getBoundingClientRect();
            return x >= left && x <= right && y >= top && y <= bottom;
        });
        hoverEl && hoverEl.dispatchEvent(new Event('mouseover', {bubbles: true}));
    }, 0);
}

interface HeaderDropdownRef {
    getTriggerNode(): Element | Text | null;
    onMouseLeave(mousePos: {x: number; y: number}): void;
    getMenuNode(): Element | null;
}

interface HeaderDropdownProps extends Omit<BasicPopoverProps, 'placement'> {
    placement?: BasicPopoverProps['placement'];
    getFocusCycle: (container: HTMLElement) => HTMLElement[];
}

const InternalHeaderDropdown = React.forwardRef<HeaderDropdownRef, HeaderDropdownProps>(
    ({getFocusCycle = FocusCycle.defaultProps.getCycle, ...popoverProps}, ref) => {
        const popoverRef = React.useRef<React.ElementRef<typeof BasicPopper>>(null);

        React.useImperativeHandle(
            ref,
            () => {
                return {
                    // eslint-disable-next-line react/no-find-dom-node
                    getTriggerNode: () => ReactDOM.findDOMNode(popoverRef.current),
                    onMouseLeave: (mousePos: {x: number; y: number}) => {
                        if (popoverRef.current) {
                            popoverRef.current.onMouseLeave();
                            forceHover('.js-header-button', mousePos);
                        }
                    },
                    getMenuNode: () => {
                        if (popoverRef.current) {
                            return document.getElementById(popoverRef.current.contentId);
                        }
                        return null;
                    },
                };
            },
            [],
        );

        const renderContent: RenderContentFunction = ({className, ...props}, ...args) => {
            return BasicPopover.defaultProps.renderContent?.(
                {
                    className: classNames(className, styles.dropdown),
                    ...props,
                },
                ...args,
            );
        };

        return (
            <FocusCycle getCycle={getFocusCycle}>
                <BasicPopover
                    ref={popoverRef}
                    canToggleOnHover={true}
                    placement="bottom-end"
                    withArrow={false}
                    withPadding={false}
                    renderContent={renderContent}
                    {...popoverProps}
                />
            </FocusCycle>
        );
    },
);

export const HeaderDropdown = menuAim({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTriggerNode: (component: any) => component.getTriggerNode(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMenuNode: (component: any) => component.getMenuNode(),
    onMouseLeave: (component, mousePos) => component.onMouseLeave(mousePos),
    // @ts-expect-error TS doesn't like this
})(InternalHeaderDropdown);

export interface HeaderButtonProps {
    udStyle?: ButtonProps['udStyle'] | 'text' | 'icon' | 'image';
    overlaychildren?: React.ReactNode;
}

export const HeaderButton = ({
    udStyle = 'text',
    children,
    ...buttonProps
}: HeaderButtonProps & Omit<ButtonProps, 'udStyle'>) => {
    const ButtonComponent = udStyle === 'icon' ? IconButton : Button;

    return (
        <ButtonComponent
            {...buttonProps}
            udStyle="ghost"
            className={`js-header-button ${styles['dropdown-button']}`}
        >
            {udStyle !== 'text' ? (
                children
            ) : (
                <span className={`ud-text-sm ${styles['dropdown-button-text']}`}>{children}</span>
            )}
        </ButtonComponent>
    );
};

interface HeaderMenuProps {
    children: React.ReactNode;
}

export const HeaderMenu = ({children}: HeaderMenuProps) => {
    return (
        <div className={`ud-header-menu ${styles['menu']}`} data-testid="header-menu">
            {children}
            <MenuAimArea />
        </div>
    );
};
