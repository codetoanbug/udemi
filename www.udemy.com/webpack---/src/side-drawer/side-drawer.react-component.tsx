import {getUniqueId, exceptionElements, unlockPageScroll} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {
    CheckedStateCheckbox,
    CheckedStateRadioGroup,
    CheckedStateChangeEvent,
    isChecked,
} from '@udemy/react-checked-state-components';
import classNames from 'classnames';
import React, {useRef, useState} from 'react';

import {DialogCloseButton} from '../dialog-close-button/dialog-close-button.react-component';
import {FocusTrappingDialog} from '../focus-trapping-dialog/focus-trapping-dialog.react-component';
import {FullPageOverlay} from '../full-page-overlay/full-page-overlay.react-component';
import {SideDrawerRadio} from '../side-drawer-radio/side-drawer-radio.react-component';
import {findFirstFocusable} from './helpers';
import styles from './side-drawer.module.less';

/** React props interface for the SideDrawer component */
export interface SideDrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * Unique id of the whole drawer.
     *
     * @remarks
     * This is wired to a {@link CheckedStateCheckbox} to open or close the whole drawer
     * and should match the `cssToggleId` parameter of a corresponding Button.
     */
    id: string;
    /**
     * Unique id of the main drawer, i.e. the content that's initially shown when opening the
     * drawer for the first time.
     *
     * @remarks
     * This, along with the ids of all the sub-drawers, is wired
     * to a radio group to select the active drawer.
     */
    mainDrawerId: string;
    /**
     * The side of the browser viewport to render the SideDrawer component.
     *
     * @defaultValue 'left'
     */
    side: 'left' | 'right';
    /** A title is required for a11y, but is hidden by `.ud-sr-only`. */
    title: React.ReactNode;
    /**
     * Any potential {@link SubDrawer} components to render.
     */
    subDrawers?: React.ReactNode;
    /** Event handler called when the whole drawer is toggled */
    onToggle?: (isOpen: boolean) => void;
}

export const SideDrawerContext = React.createContext(React.createRef<FocusTrappingDialog>());

/**
 * The SideDrawer component.
 *
 * @remarks
 * Renders a side drawer that slides in from either the left or right side.
 *
 * The drawer may have sub-drawers
 * @see {@link SubDrawer}
 *
 * @privateRemarks
 * Under the hood, it uses HTML labels, checkboxes, and radio groups to toggle the whole drawer
 * and the sub-drawers. As such, each drawer needs an id.
 */
export const SideDrawer = React.forwardRef<HTMLDivElement, SideDrawerProps>(
    (
        {className, children, id, mainDrawerId, onToggle, side, subDrawers, title, ...drawerProps},
        sideDrawerRef,
    ) => {
        const {gettext} = useI18n();
        const name = `${id}-radio-group`;
        const dialogRef = useRef<FocusTrappingDialog>(null);
        const drawerRef = useRef<HTMLDivElement>(null);
        const [labelledById] = useState(getUniqueId('side-drawer-title'));

        const onChange = (event: CheckedStateChangeEvent) => {
            const isOpen = isChecked(event);
            dialogRef.current?.onToggle(isChecked(event), drawerRef.current);
            if (!isOpen) {
                const drawerContainer = drawerRef.current?.parentNode;
                Array.from(drawerContainer?.querySelectorAll('.js-drawer > div') ?? []).forEach(
                    (drawer) => {
                        exceptionElements.has(drawer as HTMLElement) &&
                            unlockPageScroll(drawer as HTMLElement);
                    },
                );
            }
            onToggle?.(isOpen);
        };

        return (
            <SideDrawerContext.Provider value={dialogRef}>
                <CheckedStateRadioGroup name={name}>
                    <div className={styles['dialog-container']}>
                        <CheckedStateCheckbox
                            id={id}
                            className={classNames(
                                'ud-full-page-overlay-checkbox',
                                styles['main-drawer-checkbox'],
                            )}
                            closeOnEscape={true}
                            onChange={onChange}
                        />
                        <FullPageOverlay cssToggleId={id} />
                        <SideDrawerRadio id={mainDrawerId} defaultChecked={true} />
                        <FocusTrappingDialog
                            {...drawerProps}
                            ref={dialogRef}
                            labelledById={labelledById}
                            findFirstFocusable={findFirstFocusable}
                            className={classNames('js-drawer', styles['side-drawer'], {
                                [styles['side-left']]: side === 'left',
                                [styles['side-right']]: side === 'right',
                            })}
                        >
                            <nav className={styles['drawer-container']} ref={sideDrawerRef}>
                                <div
                                    ref={drawerRef}
                                    className={classNames(className, styles['drawer-content'])}
                                >
                                    <FocusTrappingDialog.Title id={labelledById} show={false}>
                                        {title}
                                    </FocusTrappingDialog.Title>
                                    {children}
                                </div>
                                {subDrawers}
                            </nav>
                            <DialogCloseButton
                                className={styles['close-btn']}
                                id={id}
                                label={gettext('Close side drawer')}
                            />
                        </FocusTrappingDialog>
                    </div>
                </CheckedStateRadioGroup>
            </SideDrawerContext.Provider>
        );
    },
);

SideDrawer.displayName = 'SideDrawer';
