import {
    Keys,
    findFocusables,
    forceTabOrder,
    ForcedTabOrder,
    ROOT_CLOSE_REASON,
    RootCloseWrapperContext,
} from '@udemy/design-system-utils';
import {debounce, noop, serverOrClient} from '@udemy/shared-utils';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {CSSProperties} from 'react';
import ReactDOM from 'react-dom';

import {
    BasicPopper,
    basicPopperPropTypes,
    BasicPopperProps,
    BasicPopperPlacementKey,
    BasicPopperMajorPlacement,
    POPPER_PLACEMENT,
} from '../basic-popper/basic-popper.react-component';

const OPPOSITE_SIDE = {top: 'bottom', left: 'right', right: 'left', bottom: 'top'} as const;

/**
 * Debounce length (to change placement, if necessary) in milliseconds.
 *
 * @remarks
 * Most phones re-render at most 60 frames per second,  so there are at least 1/60s or 16.7ms between frames.
 *
 * @see https://support.unity3d.com/hc/en-us/articles/205824295-Mobile-game-flips-between-running-at-30FPS-and-60FPS
 */
export const DEBOUNCE_MILLIS = 16;

type FindElementFunction = () => HTMLElement | null | undefined;
type FoundDOMNode = ReturnType<typeof ReactDOM.findDOMNode>;
type PositionStyleProps = Pick<CSSProperties, 'top' | 'right' | 'bottom' | 'left' | 'transform'>;

/** The required interface to determine getForceTabOrder, used to return an array of {@link ForcedTabOrder} */
export interface PopperGetTabOrderElementSelectors {
    findTriggerNode: FindElementFunction;
    findFirstFocusableInContent: FindElementFunction;
    findLastFocusableInContent: FindElementFunction;
}

export interface PopperProps extends BasicPopperProps {
    /**
     * if true, appends the popper content to the document. Used to break out
     * of `overflow: hidden` containers.
     */
    detachFromTarget?: boolean;
    /**
     * Defines the order of tabbing between elements in the document while this component
     * is mounted. See forceTabOrder in @udemy/design-system-utils
     */
    getTabOrder?: (selectors: PopperGetTabOrderElementSelectors) => ForcedTabOrder[];
    /**
     * getScrollContainers: return array of DOM elements for which the popper content should be
     * repositioned on scroll. Only matters in detachFromTarget case, as this is the only way for
     * the trigger and content to have different scrollable containers, and therefore not move
     * together on scroll.
     */
    getScrollContainers?: () => HTMLElement[];
}

/**
 * The Popper component.
 *
 * @remarks
 * Avoid direct usage of this component. It exists to abstract common
 * behaviors for displaying overlays, and shouldn't be used directly in applications.
 *
 * This component adds the following behavior to BasicPopper:
 * - Auto-positioning: when the window is resized, the popper content remains within the document.
 * - getScrollContainers: (see PopperProps)
 * - detachFromTarget: (see PopperProps)
 */
@observer
export class Popper extends React.Component<PopperProps> {
    static propTypes = {
        ...basicPopperPropTypes,
        detachFromTarget: PropTypes.bool,
        getTabOrder: PropTypes.func as PropTypes.Requireable<PopperProps['getTabOrder']>,
        getScrollContainers: PropTypes.func,
    };

    static defaultProps = {
        ...BasicPopper.defaultProps,
        detachFromTarget: false,
        getTabOrder: ((selectors: PopperGetTabOrderElementSelectors) => {
            return [
                [selectors.findTriggerNode, selectors.findFirstFocusableInContent],
                [selectors.findLastFocusableInContent, selectors.findTriggerNode],
            ];
        }) as PopperProps['getTabOrder'],
        getScrollContainers: () => [],
    };

    constructor(props: PopperProps) {
        super(props);
        this.ref = React.createRef<BasicPopper>();
        this.debouncedUpdatePlacement = debounce(this.updatePlacement, DEBOUNCE_MILLIS);
    }

    componentDidMount() {
        this.triggerNode = this.ref.current?.triggerNode;
        this.contentNode = this.ref.current?.contentNode;
        serverOrClient.global.addEventListener('resize', this.debouncedUpdatePlacement, {
            passive: true,
        });
        this.updatePlacement();

        if (this.props.detachFromTarget) {
            const findTriggerNode = () => {
                if (this.ref.current?.isOpen) {
                    return this.triggerNode;
                }
            };

            const findFirstFocusableInContent = () => {
                if (this.ref.current?.isOpen && this.contentNode) {
                    return findFocusables(this.contentNode)[0];
                }
            };

            const findLastFocusableInContent = () => {
                if (this.ref.current?.isOpen && this.contentNode) {
                    const focusables = findFocusables(this.contentNode);
                    return focusables[focusables.length - 1];
                }
            };

            if (this.props.getTabOrder) {
                this.disposeForceTabOrder = forceTabOrder(
                    this.props.getTabOrder({
                        findTriggerNode,
                        findFirstFocusableInContent,
                        findLastFocusableInContent,
                    }),
                );
            }
        }
    }

    componentDidUpdate(prevProps: PopperProps) {
        !prevProps.isOpen && this.props.isOpen && this.updatePlacement();
    }

    componentWillUnmount() {
        serverOrClient.global.removeEventListener('resize', this.debouncedUpdatePlacement);
        const scrollContainers = this.props.getScrollContainers?.().filter(Boolean) ?? [];
        if (this.isScrollListenerSetUp) {
            scrollContainers.forEach((scrollContainer) => {
                scrollContainer.removeEventListener('scroll', this.updatePlacement);
            });
        }
        this.disposeForceTabOrder();
        this.triggerNode = this.contentNode = null;
    }

    ref: React.RefObject<BasicPopper>;
    triggerNode: HTMLElement | null | undefined;
    contentNode: HTMLElement | null | undefined;
    debouncedUpdatePlacement: ReturnType<typeof debounce>;
    disposeForceTabOrder: () => void = noop;
    isScrollListenerSetUp: boolean | undefined;

    readonly POPPER_PLACEMENT = POPPER_PLACEMENT;

    @observable forcedPlacement: BasicPopperPlacementKey | null = null;
    @observable.ref position: PositionStyleProps | null = null;
    @observable.ref detachedFromTargetPosition: Pick<CSSProperties, 'top' | 'left'> | undefined =
        undefined;

    getPlacementsInPreferredOrder() {
        // Preferred order:
        // 1. The given placement.
        // 2. Placements on the same side as the given placement.
        // 3. The placement on the opposite side, with the same alignment.
        // 4. The rest of the placements on the opposite side.
        // 5. The rest of the placements.
        const [preferredSide, preferredAlignment] = this.props.placement.split('-') as [
            BasicPopperMajorPlacement,
            string,
        ];
        const oppositeSide = OPPOSITE_SIDE[preferredSide];
        const withSameSide: BasicPopperPlacementKey[] = [];
        const withOppositeSide: BasicPopperPlacementKey[] = [];
        const theRest: BasicPopperPlacementKey[] = [];
        Object.keys(POPPER_PLACEMENT).forEach((placement) => {
            const [side, alignment] = placement.split('-');
            const insertMethod = alignment === preferredAlignment ? 'unshift' : 'push';
            if (side === preferredSide) {
                withSameSide[insertMethod](placement as BasicPopperPlacementKey);
            } else if (side === oppositeSide) {
                withOppositeSide[insertMethod](placement as BasicPopperPlacementKey);
            } else {
                theRest[insertMethod](placement as BasicPopperMajorPlacement);
            }
        });
        return withSameSide.concat(withOppositeSide).concat(theRest);
    }

    getContentFit(
        contentRect: Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>,
        containerRect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>,
    ) {
        // `fits` is whether the content fits entirely in the container.
        // `area` is how much of the content fits in the container.
        const {top: t, left: l, width: w, height: h} = contentRect;
        const r = l + w; // right
        const b = t + h; // bottom
        const {top: ct, right: cr, bottom: cb, left: cl} = containerRect;
        const fits = t >= ct && l >= cl && r <= cr && b <= cb;
        const area = (Math.min(r, cr) - Math.max(l, cl)) * (Math.min(b, cb) - Math.max(t, ct));
        return {fits, area};
    }

    getContentRect(
        placement: BasicPopperPlacementKey,
        triggerRect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>,
        contentRect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>,
    ): Pick<DOMRect, 'top' | 'left' | 'width' | 'height'> {
        // For the given placement, return where the content would be.
        const {top: tt, right: tr, bottom: tb, left: tl} = triggerRect;
        const tw = tr - tl; // Trigger width
        const th = tb - tt; // Trigger height
        const w = contentRect.right - contentRect.left; // Content width
        const h = contentRect.bottom - contentRect.top; // Content height
        switch (placement) {
            case 'top-start':
                return {top: tt - h, left: tl, width: w, height: h};
            case 'top':
                return {top: tt - h, left: tl + tw / 2 - w / 2, width: w, height: h};
            case 'top-end':
                return {top: tt - h, left: tr - w, width: w, height: h};
            case 'right-start':
                return {top: tt, left: tr, width: w, height: h};
            case 'right':
                return {top: tt + th / 2 - h / 2, left: tr, width: w, height: h};
            case 'right-end':
                return {top: tb - h, left: tr, width: w, height: h};
            case 'bottom-start':
                return {top: tb, left: tl, width: w, height: h};
            case 'bottom':
                return {top: tb, left: tl + tw / 2 - w / 2, width: w, height: h};
            case 'bottom-end':
                return {top: tb, left: tr - w, width: w, height: h};
            case 'left-start':
                return {top: tt, left: tl - w, width: w, height: h};
            case 'left':
                return {top: tt + th / 2 - h / 2, left: tl - w, width: w, height: h};
            case 'left-end':
                return {top: tb - h, left: tl - w, width: w, height: h};
        }
    }

    @action
    updatePlacement = () => {
        if (!this.triggerNode || !this.contentNode || !this.ref.current) {
            // The component unmounted. Don't do anything.
            return;
        }

        if (!this.ref.current.isOpen) {
            // The content isn't shown. Don't do anything.
            return;
        }

        if (!this.props.getTriggerRect) {
            // Need getTriggerRect to proceed
            return;
        }

        const triggerRect = this.props.getTriggerRect(this.triggerNode);
        const contentRect = this.contentNode.getBoundingClientRect();
        const containerRect = document.body.getBoundingClientRect();

        // Look for a placement that fits.
        // If none of them fit, go with 'top-start' or 'bottom-start' (whichever has more room),
        // and adjust `left` to fit as much content as possible.
        let forced, fallback, first;
        for (const placement of this.getPlacementsInPreferredOrder()) {
            const rect = this.getContentRect(placement, triggerRect, contentRect);
            const {fits, area} = this.getContentFit(rect, containerRect);
            if (fits) {
                forced = {placement, rect, leftOffset: 0};
                break;
            }
            if (placement === 'top-start' || placement === 'bottom-start') {
                if (!fallback || area > fallback.area) {
                    fallback = {placement, rect, area, leftOffset: 0};
                    const overflow = rect.left + rect.width - containerRect.right;
                    if (overflow > 0) {
                        fallback.leftOffset = -Math.min(rect.left - containerRect.left, overflow);
                    }
                }
            }
            first = first ?? {placement, rect, leftOffset: 0};
        }

        // Assert: final will be assigned
        const final = forced ?? fallback ?? first;

        if (final) {
            this.forcedPlacement = final.placement;
            this.position = {...POPPER_PLACEMENT[final.placement]};
            if (final.leftOffset && 'left' in this.position && this.position.left === '0') {
                this.position.left = `${final.leftOffset}px`;
            }
            this.detachedFromTargetPosition = {
                top: `${window.pageYOffset + final.rect.top}px`,
                left: `${window.pageXOffset + final.rect.left + final.leftOffset}px`,
            };

            const scrollContainers = this.props.getScrollContainers?.().filter(Boolean) ?? [];
            if (!this.isScrollListenerSetUp) {
                scrollContainers.forEach((scrollContainer) => {
                    scrollContainer.addEventListener('scroll', this.updatePlacement, {
                        passive: true,
                    });
                });
                this.isScrollListenerSetUp = true;
            }
        }
    };

    onToggle = (isOpen: boolean) => {
        this.props.onToggle?.(isOpen);
        if (isOpen && this.contentNode) {
            // The popper content is about to show. We need to wait for it to show
            // so that we can accurately measure the width of the content, hence the setTimeout.
            // But we don't want the user to see the content flicker in case we change the
            // placement, so set `opacity: 0` until we've figured out the placement.
            this.contentNode.style.opacity = (0).toString();
            setTimeout(() => {
                this.updatePlacement();
                if (this.contentNode) {
                    // Remove override.
                    this.contentNode.style.opacity = '';
                }
            }, 0);
        }
    };

    onEscape = (event: globalThis.KeyboardEvent, container: FoundDOMNode) => {
        this.ref.current?.onRootClose(event, container, ROOT_CLOSE_REASON.KEYBOARD);
    };

    renderContent: BasicPopperProps['renderContent'] = (props, ...args) => {
        // This will override the default positioning styles provided by the BasicPopper.
        let style: PositionStyleProps | undefined =
            this.position ?? POPPER_PLACEMENT[this.forcedPlacement ?? this.props.placement];
        if (this.props.detachFromTarget) {
            style = this.detachedFromTargetPosition;
            return ReactDOM.createPortal(
                <DetachedPopperContent onEscape={this.onEscape}>
                    {this.props.renderContent?.({...props, style}, ...args)}
                </DetachedPopperContent>,
                document.body,
            );
        }
        return this.props.renderContent?.({...props, style}, ...args);
    };

    render() {
        const {detachFromTarget, ...props} = this.props;
        return (
            <BasicPopper
                {...props}
                onToggle={this.onToggle}
                placement={this.forcedPlacement ?? props.placement}
                renderContent={this.renderContent}
                ref={this.ref}
            />
        );
    }
}

interface DetachedPopperContentProps {
    onEscape: (event: globalThis.KeyboardEvent, dom: FoundDOMNode) => void;
}

class DetachedPopperContent extends React.Component<DetachedPopperContentProps> {
    componentDidMount() {
        // eslint-disable-next-line react/no-find-dom-node
        this.dom = ReactDOM.findDOMNode(this);
        this.dom?.addEventListener('click', this.context.ignoreRootClose);

        // keydown is only dispatched on certain types of elements, hence the necessary
        // cast (I think).
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
        this.dom?.addEventListener('keydown', this.onKeyDown as unknown as EventListener);
    }

    componentWillUnmount() {
        if (this.dom) {
            this.dom.removeEventListener('click', this.context.ignoreRootClose);
            this.dom.removeEventListener('keydown', this.onKeyDown as unknown as EventListener);
            this.dom = null;
        }
    }

    dom: FoundDOMNode = null;

    onKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.keyCode === Keys.ESCAPE) {
            this.props.onEscape(event, this.dom);
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}

DetachedPopperContent.contextType = RootCloseWrapperContext;
