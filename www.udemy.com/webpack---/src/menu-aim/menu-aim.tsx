import {useI18n} from '@udemy/i18n';
import {noop} from '@udemy/shared-utils';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {useContext, useState} from 'react';

/**
 * Props injected by menuAim on the wrapped component. These props should be
 * in the props of the wrapped component, passed to the `menuAim` function
 * type definition.
 */
export interface MenuAimInjectedProps {
    onMenuAimUpdate: () => void;
}

interface WithForwardedRef<T> {
    forwardedRef: React.ForwardedRef<T>;
}

/**
 * Internal type for aim area definition. Exported for spec.
 * @internal
 */
export interface MenuAimAimArea {
    pos: {
        top?: '0' | '100%';
        bottom?: '0' | '100%';
        left?: '0' | '100%';
        right?: '0' | '100%';
    };
    w: number;
    h: number;
    path: string;
    dir: {
        x: 1 | -1;
        y: 1 | -1;
    };
}

// Convenience alias for internal use
type AimArea = MenuAimAimArea;

/**
 * Used internally to maintain state between `MenuAim` component and supporting
 * components
 * @internal
 */
const MenuAimContext = React.createContext<{
    aimArea1: AimArea | Record<string, never>;
    aimArea2: AimArea | Record<string, never>;
    hideAimArea: (mousePosition: {x: number; y: number}, delay: number) => void;
    isAimAreaHidden: boolean;
    showAimArea: () => void;
}>({
    aimArea1: {},
    aimArea2: {},
    hideAimArea: noop,
    isAimAreaHidden: false,
    showAimArea: noop,
});

interface HasBoundingClientRect {
    getBoundingClientRect(): ClientRect | DOMRect;
}

/**
 * A higher-order component to track mouse movement from popper trigger to
 * popper content.
 *
 * @param WrappedComponentProps props used to create the wrapped component
 * @param Referent the type of the ref supported by the wrapped component
 *
 * @remarks
 *
 * This HOC attempts to improve UX for poppers that toggle on hover, by enabling
 * diagonal mouse movement from the popper's trigger to its menu. It achieves this
 * by covering this space (the "aim area") with two svg triangles.
 *
 * It can be used as a decorator function in JavaScript. In TypeScript it must be used
 * as a standard function.
 *
 * `menuAim` will pass these props to the wrapped component:
 * - `onMenuAimUpdate`: function that updates the state of the aim area.
 *   This should be passed to `onMouseEnter` of the trigger.
 *
 * @see {@link MenuAimInjectedProps}
 *
 * The wrapped component can be any kind of component that accepts a ref, though it is
 * generally assumed that this is a class component. It may be a wrapped `React.forwardRef`,
 * but that forwarded ref should probably point to a class component. We assume this
 * because the callback functions passed to `menuAim` are called with the item to which
 * the ref applies. This is really only useful if the ref points to a class component.
 *
 * @privateRemarks
 *
 * TypeScript won't allow this function to be used as a decorator because its return type
 * is not the same as the class it is decorating. JavaScript is indifferent on the matter.
 * See https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
 *
 */
export function menuAim<WrappedComponentProps extends MenuAimInjectedProps, Referent>({
    getTriggerNode,
    getMenuNode,
    onMouseLeave,
}: {
    /**
     * Function that returns the trigger DOM node.
     *
     * @param component the item to which the ref on the wrapped component points
     */
    getTriggerNode: (component: Referent) => HasBoundingClientRect | null | undefined;
    /**
     * Function that returns the menu DOM node
     *
     * @param component the item to which the ref on the wrapped component points
     */
    getMenuNode: (component: Referent) => HasBoundingClientRect | null | undefined;
    /**
     * Called when the mouse leaves the aim area.
     *
     * @param component the item to which the ref on the wrapped component points
     * @param mousePosition coordinates of the mouse within the viewport (from clientX, clientY)
     */
    onMouseLeave?: (component: Referent, mousePosition: {x: number; y: number}) => void;
}) {
    /**
     * @param Component the component to wrap. It must support a ref.
     */
    return function menuAimHOC(Component: React.ComponentType<WrappedComponentProps>) {
        type PropsWithForwardedRef = WrappedComponentProps & WithForwardedRef<Referent>;

        class MenuAim extends React.Component<PropsWithForwardedRef> {
            constructor(props: PropsWithForwardedRef) {
                super(props);

                // MenuAim maintains its own ref to the wrapped component. Additionally,
                // it may receive a forwardRef via props.forwardRef. Here we maintain
                // both the local ref and the potential forwardRef with an internal
                // callback ref function
                this.localCallbackRef = (component: Referent | null) => {
                    // Saving this ref so it can be passed back to the consumer via callbacks
                    this.localRef = component;

                    // Forwarded ref might either be a callback ref or a mutable object.
                    if (typeof this.props.forwardedRef === 'function') {
                        this.props.forwardedRef(component);
                    } else if (this.props.forwardedRef) {
                        this.props.forwardedRef.current = component;
                    }
                };
            }

            localRef: Referent | null = null;
            localCallbackRef: (component: Referent | null) => void;

            @observable.ref aimArea1: AimArea | Record<string, never> = {};
            @observable.ref aimArea2: AimArea | Record<string, never> = {};
            @observable isAimAreaHidden = false;
            hideAimAreaTimeoutId: ReturnType<typeof setTimeout> | null = null;

            @action showAimArea = () => {
                this.hideAimAreaTimeoutId !== null && clearTimeout(this.hideAimAreaTimeoutId);
                this.hideAimAreaTimeoutId = null;
                this.isAimAreaHidden = false;
            };

            @action hideAimArea = (mousePosition: {x: number; y: number}, delay?: number) => {
                this.hideAimAreaTimeoutId !== null && clearTimeout(this.hideAimAreaTimeoutId);
                this.hideAimAreaTimeoutId = null;
                if (delay) {
                    this.hideAimAreaTimeoutId = setTimeout(
                        () => this.hideAimArea(mousePosition),
                        delay,
                    );
                } else {
                    this.isAimAreaHidden = true;

                    if (this.localRef) {
                        onMouseLeave?.(this.localRef, mousePosition);
                    }
                }
            };

            @action onMenuAimUpdate = () => {
                const trigger = this.localRef ? getTriggerNode(this.localRef) : null;
                const menu = this.localRef ? getMenuNode(this.localRef) : null;
                if (trigger && menu) {
                    // Update aimArea1 and aimArea2. Each represents an svg right triangle.
                    // - Each svg has absolute position `pos` inside the menu.
                    // - Each svg has width `w`, height `h`, and path `path`.
                    // - To learn basic svg `path` syntax (`M`, `V`, `H`, `Z`), read this:
                    //   https://www.w3schools.com/graphics/svg_path.asp
                    // - `dir` indicates the direction that the mouse is expected to move in.
                    //   E.g. `{x: 1, y: -1}` means up-right, `{x: -1, y: 1}` means down-left.
                    // - (+2) avoids gaps between the trigger and the triangles.
                    //   Gaps may exist due to pixel rounding or borders.
                    const tRect = trigger.getBoundingClientRect();
                    const mRect = menu.getBoundingClientRect();
                    if (tRect.top >= mRect.bottom) {
                        // Menu is above the trigger. Aim areas are left and right of the trigger.
                        this.aimArea1 = {
                            pos: {
                                top: '100%',
                                left: '0',
                            },
                            w: Math.round(tRect.left - mRect.left) + 2,
                            h: Math.round(tRect.bottom - mRect.bottom),
                            path: 'M%(w)s %(h)sV0H0Z',
                            dir: {x: -1, y: -1}, // up-left
                        } as AimArea;
                        this.aimArea2 = {
                            pos: {top: '100%', right: '0'},
                            w: Math.round(mRect.right - tRect.right) + 2,
                            h: Math.round(tRect.bottom - mRect.bottom),
                            path: 'M0 %(h)sV0H%(w)sZ',
                            dir: {x: 1, y: -1}, // up-right
                        } as AimArea;
                    } else if (tRect.bottom <= mRect.top) {
                        // Menu is below the trigger. Aim areas are left and right of the trigger.
                        this.aimArea1 = {
                            pos: {bottom: '100%', left: '0'},
                            w: Math.round(tRect.left - mRect.left) + 2,
                            h: Math.round(mRect.top - tRect.top),
                            path: 'M%(w)s 0V%(h)sH0Z',
                            dir: {x: -1, y: 1}, // down-left
                        } as AimArea;
                        this.aimArea2 = {
                            pos: {bottom: '100%', right: '0'},
                            w: Math.round(mRect.right - tRect.right) + 2,
                            h: Math.round(mRect.top - tRect.top),
                            path: 'M0 0V%(h)sH%(w)sZ',
                            dir: {x: 1, y: 1}, // down-right
                        } as AimArea;
                    } else if (tRect.right <= mRect.left) {
                        // Menu is right of the trigger. Aim areas are above and below the trigger.
                        this.aimArea1 = {
                            pos: {top: '0', right: '100%'},
                            w: Math.round(mRect.left - tRect.left),
                            h: Math.round(tRect.top - mRect.top) + 2,
                            path: 'M0 %(h)sH%(w)sV0Z',
                            dir: {x: 1, y: -1}, // up-right
                        } as AimArea;
                        this.aimArea2 = {
                            pos: {bottom: '0', right: '100%'},
                            w: Math.round(mRect.left - tRect.left),
                            h: Math.round(mRect.bottom - tRect.bottom) + 2,
                            path: 'M0 0H%(w)sV%(h)sZ',
                            dir: {x: 1, y: 1}, // down-right
                        } as AimArea;
                    } else {
                        // Menu is left of the trigger. Aim areas are above and below the trigger.
                        this.aimArea1 = {
                            pos: {top: '0', left: '100%'},
                            w: Math.round(tRect.right - mRect.right),
                            h: Math.round(tRect.top - mRect.top) + 2,
                            path: 'M%(w)s %(h)sH0V0Z',
                            dir: {x: -1, y: -1}, // up-left
                        } as AimArea;
                        this.aimArea2 = {
                            pos: {bottom: '0', left: '100%'},
                            w: Math.round(tRect.right - mRect.right),
                            h: Math.round(mRect.bottom - tRect.bottom) + 2,
                            path: 'M%(w)s 0H0V%(h)sZ',
                            dir: {x: -1, y: 1}, // down-left
                        } as AimArea;
                    }
                    this.showAimArea();
                }
            };

            render() {
                const {forwardedRef, ...props} = this.props;

                return (
                    // Provide `this` as context to allow observer child components to
                    // pick up on changes to component-level observable properties.
                    <MenuAimContext.Provider value={this}>
                        <Component
                            {...(props as WrappedComponentProps)}
                            onMenuAimUpdate={this.onMenuAimUpdate}
                            ref={this.localCallbackRef}
                        />
                    </MenuAimContext.Provider>
                );
            }
        }

        const RefForwardedMenuAim = Object.assign(
            React.forwardRef<Referent, Omit<WrappedComponentProps, keyof MenuAimInjectedProps>>(
                (props, ref) => (
                    <MenuAim {...(props as WrappedComponentProps)} forwardedRef={ref} />
                ),
            ),
            {
                // These are not actually used within this component as propTypes or defaultProps,
                // but are attached for consuming components that reference them directly.
                propTypes: getHOCPropTypes(Component.propTypes),
                defaultProps: getHOCPropTypes(Component.defaultProps),
            },
        );

        return RefForwardedMenuAim;
    };
}

/**
 * Internal component representing the triangle-shaped SVG components over
 * which MenuAim tracks mouse movements. Do not use this component as
 * a consumer.
 *
 * @remarks
 *
 * Exported for the spec.
 *
 * @internal
 */
export const MenuAimArea = Object.assign(
    observer(() => {
        const {aimArea1, aimArea2} = React.useContext(MenuAimContext);

        return (
            <>
                <MenuAimSVG aimArea={aimArea1} />
                <MenuAimSVG aimArea={aimArea2} />
            </>
        );
    }),
    {displayName: 'MenuAimArea'},
);

interface MenuAimSVGProps {
    aimArea: AimArea | Record<string, never>;
}

/**
 * Internal component representing a single SVG triangle over which
 * MenuAim tracks mouse movement.
 *
 * @internal
 */
const MenuAimSVG = Object.assign(
    observer((props: MenuAimSVGProps) => {
        type MousePosition = Pick<MouseEvent, 'clientX' | 'clientY'>;
        const {interpolate} = useI18n();
        const [initialMousePos, setInitialMousePos] = useState<{x: number; y: number} | null>(null);
        const {hideAimArea, isAimAreaHidden, showAimArea} = useContext(MenuAimContext);

        const isMouseAngleWrong = (x: number, y: number, initialX: number, initialY: number) => {
            const {pos, w, h, dir} = props.aimArea;
            const dy = y - initialY;
            const dx = x - initialX;
            const expectedSlope = h / w;
            const actualSlope = dy / dx;
            const xDirMatches = dx === 0 || dx > 0 === dir.x > 0;
            const yDirMatches = dy === 0 || dy > 0 === dir.y > 0;
            if ((xDirMatches && !yDirMatches) || (!xDirMatches && yDirMatches)) {
                return true; // Wrong diagonal.
            }
            if (pos.top === '100%' || pos.bottom === '100%') {
                // Menu is above or below the trigger.
                // The angle is wrong if the slope is 2x flatter than expected.
                return 2 * Math.abs(actualSlope) < Math.abs(expectedSlope);
            }
            // Menu is left or right of the trigger.
            // The angle is wrong if the slope is 2x steeper than expected.
            return 2 * Math.abs(expectedSlope) < Math.abs(actualSlope);
        };

        const onMouseEnter = ({clientX: x, clientY: y}: MousePosition) => {
            setInitialMousePos({x, y});
        };

        const onMouseMove = ({clientX: x, clientY: y}: MousePosition) => {
            const mousePos = initialMousePos ?? {x, y};
            const {x: initialX, y: initialY} = mousePos;
            if (Math.abs(x - initialX) > 4 || Math.abs(y - initialY) > 4) {
                // - Make sure the mouse moved (4px) away from its initial position.
                //   We want to ignore mousemove events that trigger as soon as the area
                //   renders, so that the area doesn't disappear immediately afterwards.
                // - If the mouse isn't moving in the direction expected by the aim area, then
                //   hide the aim area immediately; the user isn't aiming for the menu.
                // - Otherwise, hide the aim area if the mouse stops moving for 25ms. We want this
                //   number to be low to minimize lag when hovering over an adjacent popper, but we
                //   need it to be high enough to keep the aim area shown while the mouse is moving.
                const delay = isMouseAngleWrong(x, y, initialX, initialY) ? 0 : 25;
                hideAimArea({x, y}, delay);
            }

            setInitialMousePos(mousePos);
        };
        const {pos, w, h, path} = props.aimArea;
        if (isAimAreaHidden || !w || w <= 4 || !h || h <= 4) {
            return null;
        }

        const svgStyle = {pointerEvents: 'none', position: 'absolute', ...pos} as const;
        const pathStyle = {pointerEvents: 'auto', cursor: 'pointer', fill: 'transparent'} as const;
        return (
            <svg aria-hidden="true" focusable="false" style={svgStyle} width={w} height={h}>
                <path
                    style={pathStyle}
                    d={interpolate(path, props.aimArea, true)}
                    onMouseEnter={onMouseEnter}
                    onMouseMove={onMouseMove}
                    onMouseLeave={showAimArea}
                />
            </svg>
        );
    }),
    {displayName: 'MenuAimSVG'},
);

/**
 * Remove props injected by menuAim HOC from the prop types of
 * a wrapped component
 * @param propTypes propTypes of wrapped component
 * @returns propTypes minus props injected by menuAim
 */
function getHOCPropTypes(propTypes?: Record<string, unknown>) {
    const {onMenuAimUpdate, ...hocPropTypes} = propTypes ?? {};
    return hocPropTypes;
}
