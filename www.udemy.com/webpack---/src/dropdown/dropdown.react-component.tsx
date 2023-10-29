/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId, findFocusables, FocusCycle} from '@udemy/design-system-utils';
import {useMatchMedia, withMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {
    Button,
    ButtonHtmlProps,
    BlockList,
    BlockListProps,
    BlockListItemProps,
} from '@udemy/react-core-components';
import {BottomDrawer, FocusTrappingDialogInjectedProps} from '@udemy/react-dialog-components';
import {
    RenderContentFunction,
    RenderContentProps,
    Popper,
    PopperProps,
} from '@udemy/react-popup-components';
import {autopilot, noop} from '@udemy/shared-utils';
import {pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import {Provider} from 'mobx-react';
import React from 'react';

import styles from './dropdown.module.less';

interface DropdownContextType {
    onToggle: (isOpen: boolean) => void;
}

/**
 * Props supplied by `withMatchMedia`
 * @internal
 */
interface WithMatchMediaProps {
    /** Flag to indicate if the device is a fine pointer */
    isFinePointer: boolean | null;
    /** Flag to indicate if the device is within the max-mobile query */
    isMobileMax: boolean | null;
}

const DropdownContext = React.createContext<DropdownContextType>({onToggle: noop});

/** React component props for the DropdownButton component. */
interface DropdownButtonProps extends ButtonHtmlProps {
    /**
     * Flag to display the ExpandIcon
     *
     * @defaultValue true
     */
    withIcon?: boolean;
}

/** The Dropdown triggering button */
const DropdownButton = ({
    children,
    withIcon = true,
    udStyle = 'secondary',
    ...props
}: DropdownButtonProps) => (
    <Button udStyle={udStyle} {...props}>
        {children}
        {withIcon && <ExpandIcon label={false} />}
    </Button>
);

/**
 * Internal component that side-steps refactoring Dropdown to
 * use higher order component for i18n functions.
 */
const BottomDrawerTitle = () => {
    const {gettext} = useI18n();

    return <>{gettext('Menu')}</>;
};

DropdownButton.displayName = 'DropdownButton';

/** `BlockList` props with an optional `size` */
type DropdownMenuProps = Omit<BlockListProps, 'size'> & Partial<Pick<BlockListProps, 'size'>>;

/** The content of a Dropdown when opened. */
const DropdownMenu = ({size = 'small', ...props}: DropdownMenuProps) => {
    const isMobileSized = useMatchMedia('mobile-max');
    return <BlockList {...props} size={isMobileSized ? 'large' : size} />;
};

DropdownMenu.displayName = 'DropdownMenu';

/**
 * Dropdown Menu Item, an implementation of BlockListItem
 *
 * @privateRemarks
 * - We assume this will be using the defaults of `componentClass='button'` and `loading=false`.
 * - We are omitting `to` and `componentClass` as it helps TSC with the discrimination union.
 *   Otherwise it complains that `to` is required.
 */

// Converting DropdownMenuItem breaks unit tests because IntersectionObserver is used in `<LearningFilter/>
// it's attempting to pass on a ref, but that ref moves onto BlockList.Item, which is not set up for React.forwardRef
// Retaining this work for later to return
// const DropdownMenuItem = React.forwardRef<
//     HTMLButtonElement | HTMLAnchorElement,
//     Omit<BlockListItemProps, 'to' | 'componentClass' | 'loading'>
// >((props, ref) => {
//     const {$$udDropdown} = React.useContext(MobXProviderContext);

//     const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//         const result = props.onClick?.(event);
//         /** @ts-expect-error void | undefined and booleans are not comparable in TypeScript */
//         result !== false && $$udDropdown.props.onToggle(false);
//     };

//     return <BlockList.Item ref={ref} {...props} onClick={onClick} />;
// });

// DropdownMenuItem.displayName = 'DropdownMenuItem';
type DropdownMenuItemProps<C extends React.ElementType> = BlockListItemProps<C> & {
    componentClass?: C;
    /** onClick handler for DropdownMenuItem */
    onClick?: (e: React.MouseEvent) => void | boolean;
};

class DropdownMenuItem<C extends React.ElementType> extends React.Component<
    DropdownMenuItemProps<C>
> {
    static defaultProps = {
        componentClass: 'button',
    };

    static contextType = DropdownContext;

    onClick = (event: React.MouseEvent) => {
        const result = this.props.onClick?.(event);

        if (typeof result === 'undefined' || result !== false) {
            this.context.onToggle(false);
        }
    };

    render() {
        return <BlockList.Item {...this.props} onClick={this.onClick} />;
    }
}

/** Object for containing the various sizes of a Dropdown Menu object. */
export const menuWidths = {
    auto: 'auto',
    fullWidth: '100%',
    xsmall: `${pxToRem(120)}rem`,
    small: `${pxToRem(160)}rem`,
    medium: `${pxToRem(200)}rem`,
    large: `${pxToRem(260)}rem`,
};
/** React props interface for Dropdown component */
export interface DropdownProps extends PopperProps {
    /** This is already declared as optional in PopperProps -> BasicPopperProps, but needs to be explicit for `autopilot` */
    isOpen: boolean;
    /**
     * onToggle is dispatched when the open/close state changes. Listen to this event
     * if you are controlling BasicPopper's state through the isOpen prop.
     */
    onToggle: (isOpen: boolean) => void;
    /**
     * The placement of the Dropdown's menu when expanded.
     * Passed down to the `Popper` component via a `...props` spread.
     */
    placement: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    /** The React.ForwardedRef */
    forwardedRef: React.Ref<Popper | typeof BottomDrawer>;
    /**
     * The maximum height of the Dropdown menu.
     * @defaultValue 17.5rem (280px)
     */
    menuMaxHeight?: string;
    /** The width of the Dropdown menu */
    menuWidth?: keyof typeof menuWidths;
    /** Flag to use the `BottomDrawer` instead of `Popper` */
    useDrawer?: boolean;
}

/**
 * The Dropdown Component, wrapped in autopilot
 * @internal
 *
 * @remarks
 * The actual returned `Dropdown` component is an `Object.assign` to apply
 * values and skirt TypeScript typing for values that do not exist on the DropdownBase component
 * ex: Dropdown.MenuItem
 */
const DropdownWithAutopilot = autopilot<DropdownProps & WithMatchMediaProps, boolean>(
    'isOpen',
    'onToggle',
)(
    class extends React.Component<DropdownProps & WithMatchMediaProps> {
        static defaultProps = {
            ...Popper.defaultProps,
            isOpen: false,
            menuMaxHeight: `${pxToRem(280)}rem`,
            menuWidth: 'medium' as keyof typeof menuWidths,
            useDrawer: undefined,
            componentClass: 'div' as keyof React.ReactHTML,
        };

        constructor(props: DropdownProps & WithMatchMediaProps) {
            super(props);
            this.triggerId = this.props.trigger.props.id || getUniqueId('dropdown-trigger');
            this.drawerId = getUniqueId('dropdown-drawer');
            this.hasOpened = false;
            this.dropdownContentRef = React.createRef();

            // If a dropdown menu item opens a modal on click, we want the focus to return to
            // the dropdown trigger when the modal closes. The default behavior returns focus to
            // the thing that opened the modal, which doesn't work because the dropdown menu closes
            // when a menu item is clicked.
            this.focusTrappingDialogProps = {
                findTriggerNode: () => document.getElementById(this.triggerId) as HTMLElement,
            };
        }

        hasOpened: boolean;
        triggerId: string;
        drawerId: string;
        focusTrappingDialogProps: FocusTrappingDialogInjectedProps;
        dropdownContentRef?: React.RefObject<HTMLDivElement>;

        onOpenDrawer = () => {
            this.props.onToggle?.(true);
            !this.hasOpened && this.props.onFirstOpen && this.props.onFirstOpen();
            this.hasOpened = true;
        };

        onCloseDrawer = () => {
            this.props.onToggle?.(false);
        };

        renderContent: RenderContentFunction = (props: RenderContentProps, ...args) => {
            const width = menuWidths[this.props.menuWidth ?? 'medium'];
            const style = {...props.style, width};
            return this.props.renderContent?.({...props, style}, ...args);
        };

        getPopperFocusables = () => {
            return [
                // Dropddown trigger
                document.getElementById(this.triggerId) as HTMLElement,
                // Menu items
                ...findFocusables(this.dropdownContentRef?.current as HTMLElement),
            ];
        };

        render() {
            const {
                children,
                forwardedRef,
                menuMaxHeight,
                menuWidth,
                useDrawer = this.props.isMobileMax && !this.props.isFinePointer,
                isMobileMax,
                isFinePointer,
                ...props
            } = this.props;

            const dropdownContext = {onToggle: this.props.onToggle};
            const detachedContent = props.detachFromTarget ? this.dropdownContentRef : undefined;

            if (useDrawer) {
                return (
                    <Provider focusTrappingDialogProps={this.focusTrappingDialogProps}>
                        <DropdownContext.Provider value={dropdownContext}>
                            <div className={'note'}>
                                {React.cloneElement(props.trigger, {
                                    id: this.triggerId,
                                    cssToggleId: this.drawerId,
                                })}
                            </div>
                            <BottomDrawer
                                ref={forwardedRef as React.Ref<typeof BottomDrawer>}
                                id={this.drawerId}
                                title={<BottomDrawerTitle />}
                                showTitle={false}
                                isOpen={props.isOpen}
                                onOpen={this.onOpenDrawer}
                                onClose={this.onCloseDrawer}
                                className={styles['bottom-drawer']}
                            >
                                <div className={styles.menu}>{children}</div>
                            </BottomDrawer>
                        </DropdownContext.Provider>
                    </Provider>
                );
            }

            return (
                <Provider focusTrappingDialogProps={this.focusTrappingDialogProps}>
                    <DropdownContext.Provider value={dropdownContext}>
                        <FocusCycle
                            getCycle={this.getPopperFocusables}
                            detachedContent={detachedContent}
                        >
                            <Popper
                                ref={forwardedRef as React.Ref<Popper>}
                                {...props}
                                trigger={React.cloneElement(props.trigger, {id: this.triggerId})}
                                renderContent={this.renderContent}
                            >
                                <div
                                    className={classNames(styles.menu, styles['dropdown-menu'])}
                                    style={{maxHeight: menuMaxHeight}}
                                    ref={this.dropdownContentRef}
                                >
                                    {children}
                                </div>
                            </Popper>
                        </FocusCycle>
                    </DropdownContext.Provider>
                </Provider>
            );
        }
    },
);

const DropdownWithMatchMedia = withMatchMedia({
    isMobileMax: 'mobile-max',
    isFinePointer: '(pointer: fine), not (any-pointer: coarse)',
})(DropdownWithAutopilot);

/**
 * ### The Dropdown Component.
 * @see {@link makeDropdown}
 */
export const Dropdown = Object.assign(
    React.forwardRef<Popper | typeof BottomDrawer, DropdownProps>((props, ref) => (
        <DropdownWithMatchMedia {...props} forwardedRef={ref} />
    )),
    {
        defaultProps: DropdownWithAutopilot.defaultProps,
        Button: DropdownButton,
        Menu: DropdownMenu,
        MenuItem: DropdownMenuItem,
        displayName: 'Dropdown',
    },
);
