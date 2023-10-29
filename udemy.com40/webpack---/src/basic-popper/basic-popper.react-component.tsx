/* eslint-disable @typescript-eslint/naming-convention */
import {
    getUniqueId,
    RootCloseWrapper,
    RootCloseEventHandler,
    ROOT_CLOSE_REASON,
} from '@udemy/design-system-utils';
import {useMatchMedia} from '@udemy/hooks';
import {CheckedStateCheckbox} from '@udemy/react-checked-state-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {CSSProperties, createContext, PropsWithChildren} from 'react';

import styles from './popper.module.less';

/**
 * @remarks
 * Maps popover placement to `position: absolute` styles needed to render the placement.
 * The order of the keys matters; see `getPlacementsInPreferredOrder` in {@link Popper}.
 */
export const POPPER_PLACEMENT = {
    'top-start': {bottom: '100%', left: '0'},
    'top-end': {bottom: '100%', right: '0'},
    top: {bottom: '100%', left: '50%', transform: 'translateX(-50%)'},
    'right-start': {left: '100%', top: '0'},
    'right-end': {left: '100%', bottom: '0'},
    right: {left: '100%', top: '50%', transform: 'translateY(-50%)'},
    'bottom-start': {top: '100%', left: '0'},
    'bottom-end': {top: '100%', right: '0'},
    bottom: {top: '100%', left: '50%', transform: 'translateX(-50%)'},
    'left-start': {right: '100%', top: '0'},
    'left-end': {right: '100%', bottom: '0'},
    left: {right: '100%', top: '50%', transform: 'translateY(-50%)'},
} as const;

/** The potential placements of a BasicPopper. */
export type BasicPopperPlacementKey = keyof typeof POPPER_PLACEMENT;

let currentlyOpenPopper: BasicPopper | null = null;

/** The four major cardinal directions that placement of a Popper can occur. */
export type BasicPopperMajorPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * @remarks
 * Given a placement key, returns the cardinal part of that key
 *
 * @param placement a {@link BasicPopperPlacementKey} key
 * @returns the cardinal part of the key, ex: 'top'
 */
export function getMajorPlacement(placement: BasicPopperPlacementKey): BasicPopperMajorPlacement {
    return placement.split('-')[0] as BasicPopperMajorPlacement;
}

/**
 * @param placement a {@link BasicPopperPlacementKey} key
 * @returns boolean true if placement is `top` or `bottom`
 */
export function isVertical(placement: BasicPopperPlacementKey) {
    return ['top', 'bottom'].includes(getMajorPlacement(placement));
}

interface PopperModalContextType {
    onMount: () => void;
    onUnmount: () => void;
}

/** React Context for a Popper Modal */
export const PopperModalContext: React.Context<PopperModalContextType> = createContext({
    /**
     * Modal dialog components in tree below this component should
     * call onMount after they have been mounted to the tree.
     */
    onMount: noop,
    /**
     * Call onUnmount after they have been removed from the tree
     * and this popper can close.
     */
    onUnmount: noop,
});

/** The React props interface for the RenderContent function */
export interface RenderContentProps {
    /** Unique id */
    id: string;
    /** `aria-labelledby` attribute value */
    'aria-labelledby'?: string;
    /** className to apply */
    className: string;
    /** Optional {@link CSSProperties} to apply. */
    style?: Pick<CSSProperties, 'top' | 'right' | 'bottom' | 'left' | 'transform'>;
    /** Child content of the render function */
    children: React.ReactNode;
}

/** A RenderContentFunction function signature */
export type RenderContentFunction = (
    contentProps: RenderContentProps,
    placement: BasicPopperPlacementKey,
    contentOffset: number | null,
) => React.ReactNode;

/** The Default renderContent prop used to render BasicPopper content. */
export function defaultRenderContent(props: RenderContentProps) {
    const {children, ...wrapperProps} = props;
    return (
        <div {...wrapperProps}>
            <div className={styles['animation-wrapper']}>{children}</div>
        </div>
    );
}

interface TriggerCloneProps {
    id: string;
    onClick?: (...args: unknown[]) => void;
    tabIndex?: number;
    'aria-expanded'?: boolean;
    'aria-describedby'?: string;
}

/** The React props interface for `BasicPopper`. */
export interface BasicPopperProps {
    /** Optional className to apply. */
    className?: string;
    /** Child content of BasicPopper */
    children?: React.ReactNode;
    /** The placement of the BasicPopper when it opens. */
    placement: BasicPopperPlacementKey;
    /** The Trigger element used ot open the BasicPopper */
    trigger: React.ReactElement;
    getTriggerRect?: (triggerNode: HTMLElement) => DOMRect;
    /**
     * Flag to control the open state of the `BasicPopper`
     *
     * @remarks
     * Include `isOpen` if you want to use` BasicPopper` as a controlled component. Changes
     * to `isOpen` are signaled by `onToggle` events. If `isOpen` is omitted from props,
     * `BasicPopper` will keep track of its open/close state internally, as an uncontrolled
     * component.
     */
    isOpen?: boolean;
    /**
     * Flag to toggle the BasicPopper on hover.
     *
     * @defaultValue `false` in `BasicPopper`
     * @remarks
     *
     * This behavior will be disabled if the primary pointing device does not support hover.
     * It will fall back to toggle on clicking the trigger element.
     */
    canToggleOnHover?: boolean;
    /**
     * The `role` attribute to apply to the `BasicPopper`.
     *
     * @defaultValue `popup` in `BasicPopper`
     */
    a11yRole?: 'popup' | 'description' | 'none';
    /**
     * Flag to determine if opening oen `BasicPopper` should close other open ones.
     *
     * @defaultValue `true` in `BasicPopper`
     */
    shouldCloseOtherPoppers?: boolean;
    /**
     * Optional event handler for when the `BasicPopper` is toggled.
     *
     * @remarks
     * `onToggle` is dispatched when the open/close state changes. Listen to this event
     * if you are controlling `BasicPopper` state through the isOpen prop.
     */
    onToggle?: (isOpen: boolean) => void;
    /** Optional handler to fire when the `BasicPopper` first opens. */
    onFirstOpen?: () => void;
    /** Provided by {@link menuAim} function. */
    onMenuAimUpdate?: () => void;
    /**
     * The type of element to use when rendering the `BasicPopper`
     *
     * @defaultValue `div` in `BasicPopper`
     */
    componentClass?: React.ElementType;
    /** Optional The render content function to use when rendering the `BasicPopper` */
    renderContent?: RenderContentFunction;
    /**
     * Toggle strategy for `BasicPopper`.
     *
     * - `show-hide`: always render children, even if the popper is closed
     * - `add-remove`: only render children if the popper is open; do not
     *   render (or remove them) if closed
     *
     * @defaultValue `show-hide` in `BasicPopper`
     */
    toggleStrategy?: 'show-hide' | 'add-remove';
    /**
     * Flag to determine whether or not the `BasicPopper` can only be toggled by hovering (and not focusing).
     * Note that you still need to implement a way to toggle on focus; otherwise, the `BasicPopper` will not
     * work on mobile devices or for keyboard users.
     */
    canOnlyToggleOnHover?: boolean;
}

export const basicPopperPropTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /** The placement of the BasicPopper when it opens. */
    placement: PropTypes.oneOf(Object.keys(POPPER_PLACEMENT) as BasicPopperPlacementKey[])
        .isRequired,
    /** The Trigger element used ot open the BasicPopper */
    trigger: PropTypes.element.isRequired,
    getTriggerRect: PropTypes.func,
    /**
     * Flag to control the open state of the `BasicPopper`
     *
     * @remarks
     * Include `isOpen` if you want to use` BasicPopper` as a controlled component. Changes
     * to `isOpen` are signaled by `onToggle` events. If `isOpen` is omitted from props,
     * `BasicPopper` will keep track of its open/close state internally, as an uncontrolled
     * component.
     */
    isOpen: PropTypes.bool,
    /**
     * Flag to toggle the BasicPopper on hover
     *
     * @defaultValue `false` in `BasicPopper`
     */
    canToggleOnHover: PropTypes.bool,
    /**
     * The `role` attribute to apply to the `BasicPopper`.
     *
     * @defaultValue `popup` in `BasicPopper`
     */
    a11yRole: PropTypes.oneOf(['popup', 'description', 'none'] as BasicPopperProps['a11yRole'][]),
    /**
     * Flag to determine if opening oen `BasicPopper` should close other open ones.
     *
     * @defaultValue `true` in `BasicPopper`
     */
    shouldCloseOtherPoppers: PropTypes.bool,
    /**
     * Optional event handler for when the `BasicPopper` is toggled.
     *
     * @remarks
     * `onToggle` is dispatched when the open/close state changes. Listen to this event
     * if you are controlling `BasicPopper` state through the isOpen prop.
     */
    onToggle: PropTypes.func,
    /** Optional handler to fire when the `BasicPopper` first opens. */
    onFirstOpen: PropTypes.func,
    /** Provided by {@link menuAim} function. */
    onMenuAimUpdate: PropTypes.func,
    /**
     * The type of element to use when rendering the `BasicPopper`
     *
     * @defaultValue `div` in `BasicPopper`
     */
    componentClass: PropTypes.elementType as PropTypes.Requireable<React.ElementType>,
    /** Optional The render content function to use when rendering the `BasicPopper` */
    renderContent: PropTypes.func,
    /**
     * Toggle strategy for `BasicPopper`.
     *
     * - `show-hide`: always render children, even if the popper is closed
     * - `add-remove`: only render children if the popper is open; do not
     *   render (or remove them) if closed
     *
     * @defaultValue `show-hide` in `BasicPopper`
     */
    toggleStrategy: PropTypes.oneOf([
        'show-hide',
        'add-remove',
    ] as BasicPopperProps['toggleStrategy'][]),
    /**
     * Flag to determine whether or not the `BasicPopper` can only be toggled by hovering (and not focusing).
     * Note that you still need to implement a way to toggle on focus; otherwise, the `BasicPopper` will not
     * work on mobile devices or for keyboard users.
     */
    canOnlyToggleOnHover: PropTypes.bool,
};
/** React props interface for `PopperTrigger`  */
interface BasicPopperTriggerProps {
    /** Unique id for the trigger */
    triggerId: string;
    /** The Trigger element used ot open the BasicPopper */
    trigger: BasicPopperProps['trigger'];
    /** Boolean that is `true` if `BasicPopperProps['a11yRole']` is 'popup` */
    isPopupRole: boolean;
    /** Boolean that is `true` if `BasicPopperProps['a11yRole']` is 'description` */
    isDescriptionRole: boolean;
    /** Flag to control the open state of the `BasicPopper` @see {@link BasicPopperProps} */
    isOpen: BasicPopperProps['isOpen'];
    /** Unique id for the content*/
    contentId: string;
    /** Flag to toggle the BasicPopper on hover. @see {@link BasicPopperProps } */
    canToggleOnHover: BasicPopperProps['canOnlyToggleOnHover'];
    /** Handler to occur on click of trigger.  @see {@link BasicPopper.onTriggerClick} */
    onTriggerClick: (...args: unknown[]) => void;
}

/**
 *
 * ### BasicPopper Trigger
 * @returns
 */
const BasicPopperTrigger = observer(
    ({
        trigger,
        triggerId,
        isOpen,
        contentId,
        isPopupRole,
        isDescriptionRole,
        canToggleOnHover,
        onTriggerClick,
    }: BasicPopperTriggerProps) => {
        const triggerProps: TriggerCloneProps = {id: triggerId};

        if (isPopupRole) {
            triggerProps['aria-expanded'] = isOpen;
        } else if (isDescriptionRole) {
            triggerProps['aria-describedby'] = contentId;
        }

        if (!canToggleOnHover) {
            triggerProps.onClick = onTriggerClick;
        }
        if (trigger.props.tabIndex === undefined) {
            triggerProps.tabIndex = 0;
        }

        return React.cloneElement(React.Children.only(trigger), triggerProps);
    },
);

interface BasicPopperInternalProps
    extends Omit<BasicPopperProps, 'placement' | 'renderContent' | 'isOpen' | 'onToggle'> {
    isOpen: BasicPopperProps['isOpen'];
    /** Unique id for the trigger */
    triggerId: string;
    /** Unique id for the content */
    contentId: string;
    /** Boolean that is `true` if `BasicPopperProps['a11yRole']` is 'popup` */
    isPopupRole: boolean;
    /** Boolean that is `true` if `BasicPopperProps['a11yRole']` is 'description` */
    isDescriptionRole: boolean;
    /** Flag to toggle the BasicPopper on hover. @see {@link BasicPopperProps } */
    canToggleOnHover?: BasicPopperProps['canOnlyToggleOnHover'];

    /** Handler to occur on click of trigger.  @see {@link BasicPopper.onTriggerClick} */
    onTriggerClick: (...args: unknown[]) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onToggle: () => void;
    onBlurClose: () => void;
    handleFocus: React.FocusEventHandler;
}

/**
 * Renders popper trigger, content (children), and sets up events that
 * initiate the popper trigger.
 *
 * @internal
 * @privateRemarks
 *
 * This component is distinct from `BasicPopper` because the latter is
 * difficult to refactor out of a class component. As long as hover/trigger
 * logic depends on references to external hooks, it is simpler to maintain
 * this as a separate component than to refactor `BasicPopper` with a higher-
 * order component wrapper.
 */
const BasicPopperInternal = observer(
    ({
        triggerId,
        contentId,
        isOpen,
        isPopupRole,
        isDescriptionRole,
        onTriggerClick,
        onMouseEnter,
        onMouseLeave,
        onBlurClose,
        handleFocus,
        children,
        ...props
    }: React.PropsWithChildren<BasicPopperInternalProps>) => {
        const PopperComponent = props.componentClass as React.ElementType;

        // If the primary pointing device does not support hovering, then disable
        // toggle on hover behavior; fall back to requiring a click.
        const canPrimaryHover = !!useMatchMedia('(hover: hover)');
        const canToggleOnHoverCheck = props.canToggleOnHover && canPrimaryHover;

        return (
            <PopperComponent
                className={classNames(styles.popper, props.className, {
                    'ud-popper-open': isOpen,
                })}
                onMouseEnter={canToggleOnHoverCheck ? onMouseEnter : undefined}
                onMouseLeave={canToggleOnHoverCheck ? onMouseLeave : undefined}
                onFocus={
                    !props.canOnlyToggleOnHover && canToggleOnHoverCheck ? handleFocus : undefined
                }
                onBlur={canToggleOnHoverCheck ? onBlurClose : undefined}
            >
                {props.trigger.props.cssToggleId && (
                    <CheckedStateCheckbox
                        id={props.trigger.props.cssToggleId}
                        checked={isOpen}
                        onChange={props.onToggle}
                        className={styles['popper-checkbox']}
                    />
                )}
                <BasicPopperTrigger
                    triggerId={triggerId}
                    trigger={props.trigger}
                    isPopupRole={isPopupRole}
                    isDescriptionRole={isDescriptionRole}
                    contentId={contentId}
                    isOpen={isOpen}
                    canToggleOnHover={canToggleOnHoverCheck}
                    onTriggerClick={onTriggerClick}
                />
                {children}
            </PopperComponent>
        );
    },
);

/**
 * The `BasicPopper` component.
 */
@observer
export class BasicPopper extends React.Component<BasicPopperProps> {
    static defaultProps = {
        getTriggerRect: (triggerNode: HTMLElement) => triggerNode.getBoundingClientRect(),
        canToggleOnHover: false,
        a11yRole: 'popup' as BasicPopperProps['a11yRole'],
        shouldCloseOtherPoppers: true,
        onFirstOpen: undefined,
        onMenuAimUpdate: undefined,
        onToggle: noop,
        componentClass: 'div' as BasicPopperProps['componentClass'],
        renderContent: defaultRenderContent,
        toggleStrategy: 'show-hide' as BasicPopperProps['toggleStrategy'],
        canOnlyToggleOnHover: false,
    };

    constructor(props: PropsWithChildren<BasicPopperProps>) {
        super(props);
        this.triggerId = this.props.trigger.props.id || getUniqueId('popper-trigger');
        this.contentId = getUniqueId('popper-content');
        this.popperModalContext = {
            onMount: this.handleChildModalMount,
            onUnmount: this.handleChildModalUnmount,
        };
    }

    componentDidMount() {
        this.triggerNode = document.getElementById(this.triggerId);
        this.contentNode = document.getElementById(this.contentId);
        this.updateContentOffset();
    }

    componentDidUpdate() {
        this.updateContentOffset();
    }

    componentWillUnmount() {
        if (currentlyOpenPopper === this) {
            currentlyOpenPopper = null;
        }
        this.focusNode = this.triggerNode = this.contentNode = null;
    }

    // These properties are current accessed by outside components
    readonly triggerId: string;
    readonly contentId: string;
    triggerNode: HTMLElement | null = null;
    contentNode: HTMLElement | null = null;

    private focusNode: Node | null = null;
    private hasOpened = false;
    // isModalInPopper is a guard to prevent the popper from closing automatically (on blur, e.g.)
    // when there is a modal dialog in its tree of descendants. Set by child modal components via
    // a context provider.
    private isModalInPopper = false;
    private readonly popperModalContext;
    @observable contentOffset: number | null = null;

    // Test to determine if BasicPopper instance behaves as a controlled or
    // uncontrolled component. If isOpen is provided as a prop, then assume that it
    // its open/close state is controlled by the consuming component.
    private isControlledComponent = () => typeof this.props.isOpen !== 'undefined';

    // If the consumer does not provide isOpen prop, then the open/closed state is
    // managed internally with this property.
    @observable private isOpenShadowValue = false;

    // Check to determine if popper is visible/open.
    get isOpen() {
        return this.isControlledComponent() ? this.props.isOpen : this.isOpenShadowValue;
    }

    @action
    handleToggle = (isOpen: boolean) => {
        // If component is controlled, then maintain open state with internal property.
        if (!this.isControlledComponent()) {
            this.isOpenShadowValue = isOpen;
        }

        // Regardless of whether open state is maintained internally or externally,
        // communicate state via toggle event.
        this.props.onToggle?.(isOpen);
    };

    @action
    updateContentOffset() {
        if (!this.isOpen || !this.triggerNode || !this.contentNode) {
            this.contentOffset = null;
        } else if (this.props.getTriggerRect) {
            // Problems with this line in tests? Try using `attachTo` when you mount the component
            // so that the elements will be available in the document.
            const triggerRect = this.props.getTriggerRect(this.triggerNode);
            const contentRect = this.contentNode.getBoundingClientRect();
            if (isVertical(this.props.placement)) {
                this.contentOffset = triggerRect.left - contentRect.left + triggerRect.width / 2;
            } else {
                this.contentOffset = triggerRect.top - contentRect.top + triggerRect.height / 2;
            }
        }
    }

    onToggle = () => {
        this.isOpen ? this.onClose() : this.onOpen();
    };

    onTriggerClick = (...args: unknown[]) => {
        this.onToggle();

        if (typeof this.props.trigger.props.onClick === 'function') {
            this.props.trigger.props.onClick(...args);
        }
    };

    onOpen = () => {
        if (!this.isOpen) {
            if (this.props.shouldCloseOtherPoppers) {
                if (currentlyOpenPopper) {
                    currentlyOpenPopper.onClose();
                }
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                currentlyOpenPopper = this;
            }
            this.handleToggle(true);

            !this.hasOpened && this.props.onFirstOpen && this.props.onFirstOpen();
            this.hasOpened = true;
        }
    };

    onClose = () => {
        if (this.isOpen) {
            if (currentlyOpenPopper === this) {
                currentlyOpenPopper = null;
            }
            this.handleToggle(false);
        }
    };

    onRootClose: RootCloseEventHandler = (event, container, reason) => {
        if (reason === ROOT_CLOSE_REASON.KEYBOARD && container?.contains(event.target as Node)) {
            if (this.isOpen) {
                event.stopPropagation();
            }
            this.triggerNode?.focus();
        }
        this.onClose();
    };

    onFocusOpen = (focusNode: Element) => {
        this.focusNode = this.focusNode ?? focusNode;
        this.onOpen();
    };

    private handleFocus: React.FocusEventHandler = (event) => {
        this.onFocusOpen(event.currentTarget);
    };

    isInsideDetachedPopperContent(node: Element | null) {
        const contentNodes = Array.from(document.querySelectorAll('body > .ud-popper-open'));
        const contentNode = contentNodes.find((contentNode) => contentNode.contains(node));
        const triggerId = contentNode?.getAttribute('aria-labelledby');
        const triggerNode = triggerId && document.getElementById(triggerId);
        return !!triggerNode && this.contentNode?.contains(triggerNode);
    }

    onBlurClose = () => {
        setTimeout(() => {
            if (
                this.focusNode &&
                !this.isModalInPopper &&
                !this.focusNode?.contains(document.activeElement) &&
                !this.contentNode?.contains(document.activeElement) &&
                !this.isInsideDetachedPopperContent(document.activeElement)
            ) {
                this.onClose();
            }

            this.focusNode = null;
        }, 0);
    };

    onMouseEnter = () => {
        if (!this.isModalInPopper) {
            this.onOpen();
            if (this.props.onMenuAimUpdate) {
                setTimeout(this.props.onMenuAimUpdate, 0); // Wait for menu to render.
            }
        }
    };

    onMouseLeave = () => {
        if (!this.isModalInPopper) {
            this.onClose();
        }
    };

    private handleChildModalMount = () => {
        this.isModalInPopper = true;

        // Recursively call up to any parent BasicPoppers
        this.context.onMount();
    };

    private handleChildModalUnmount = () => {
        if (this.isModalInPopper) {
            this.onClose();
        }

        this.isModalInPopper = false;
        // Recursively call up to any parent BasicPoppers
        this.context.onUnmount();
    };

    render() {
        const {isOpen, onToggle, placement, renderContent, ...internalProps} = this.props;
        const isPopupRole = this.props.a11yRole === 'popup';
        const isDescriptionRole = this.props.a11yRole === 'description';

        const contentProps = {
            id: this.contentId,
            'aria-labelledby': isPopupRole ? this.triggerId : undefined,
            className: classNames(styles['popper-content'], {
                'ud-popper-open': this.isOpen,
            }),
            style: POPPER_PLACEMENT[placement],
            children:
                (this.props.toggleStrategy === 'show-hide' || this.isOpen) && this.props.children,
        } as RenderContentProps;

        return (
            <PopperModalContext.Provider value={this.popperModalContext}>
                <RootCloseWrapper onRootClose={this.onRootClose}>
                    {this.props.componentClass && (
                        <BasicPopperInternal
                            isOpen={this.isOpen}
                            triggerId={this.triggerId}
                            contentId={this.contentId}
                            isPopupRole={isPopupRole}
                            isDescriptionRole={isDescriptionRole}
                            onTriggerClick={this.onTriggerClick}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            onToggle={this.onToggle}
                            onBlurClose={this.onBlurClose}
                            handleFocus={this.handleFocus}
                            {...internalProps}
                        >
                            {renderContent?.(contentProps, placement, this.contentOffset)}
                        </BasicPopperInternal>
                    )}
                </RootCloseWrapper>
            </PopperModalContext.Provider>
        );
    }
}

BasicPopper.contextType = PopperModalContext;
