import {lockPageScroll} from '@udemy/design-system-utils';
import {CheckedStateChangeEvent, isChecked} from '@udemy/react-checked-state-components';
import classNames from 'classnames';
import React from 'react';

import {SideDrawerRadio} from '../side-drawer-radio/side-drawer-radio.react-component';
import styles from '../side-drawer/side-drawer.module.less';

export interface SubDrawerProps {
    /** unique id */
    id: string;
    /** Positive integer indicating which level this sub-drawer is at. */
    level: number;
    onSelect?: () => void;
    className?: string;
    style?: CSSStyleDeclaration;
    children: React.ReactNode;
}

/**
 * The SubDrawer component.
 *
 * @remarks
 * Renders a sub-drawer inside {@link SideDrawer}.
 * Precise DOM structure is required if you have sub-drawers at level N > 1.
 * You must order the sub-drawers at level N right before their parent drawer at level N - 1,
 * and group them inside a div.
 *
 * **Example:**
 *
 * A
 * - B
 *   - C
 *   - D
 * - E
 *   - F
 *   - G
 *
 * In the above diagram, the main level is A. The drawers at level 1 are B and E.
 * The drawers at level 2 are C, D, F, and G. You must order the drawers like so:
 * ```
 * <SideDrawer
 *     mainDrawerId="A"
 *     subDrawers={
 *         <>
 *             <div>
 *                 <SubDrawer id="C" level={2} />
 *                 <SubDrawer id="D" level={2} />
 *                 <SubDrawer id="B" level={1} />
 *             </div>
 *             <div>
 *                 <SubDrawer id="F" level={2} />
 *                 <SubDrawer id="G" level={2} />
 *                 <SubDrawer id="E" level={1} />
 *             </div>
 *         </>
 *     }
 * />
 * ```
 *
 * Note that C and D are right before their parent B. F and G are right before their parent E.
 * The reason this is required is that we use a CSS selector that targets the parent sub-drawer,
 * and this selector relies on `:last-of-type`, `+`, and `~`, all of which are order-sensitive.
 */
export const SubDrawer = ({
    className,
    children,
    id,
    level,
    onSelect,
    style,
    ...props
}: SubDrawerProps) => {
    const drawerRef = React.createRef<HTMLDivElement>();

    const onChange = (event: CheckedStateChangeEvent) => {
        if (isChecked(event)) {
            onSelect?.();
            lockPageScroll(drawerRef.current as HTMLElement);
        }
    };

    return (
        <>
            <SideDrawerRadio id={id} onChange={onChange} />
            {/* Use custom tag names so that we can take advantage of :last-of-type to
                    select this sub-drawer's parent drawer via CSS. Note that when rendering
                    a custom HTML tag, the correct prop name is `class`, not `className`. */}
            {React.createElement(
                `div-l${level}`,
                {
                    ...props,
                    class: classNames(className, 'js-drawer', styles['side-drawer']),
                    style: {...style, zIndex: level},
                },
                <div ref={drawerRef} className={styles['drawer-content']}>
                    {children}
                </div>,
            )}
        </>
    );
};
