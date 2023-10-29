import {getUniqueId} from '@udemy/design-system-utils';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {
    CheckedStateCheckbox,
    CheckedStateChangeEvent,
    isChecked,
} from '@udemy/react-checked-state-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import React, {PropsWithChildren} from 'react';
import ReactDOM from 'react-dom';

import {DialogCloseButton} from '../dialog-close-button/dialog-close-button.react-component';
import {FocusTrappingDialog} from '../focus-trapping-dialog/focus-trapping-dialog.react-component';
import {FullPageOverlay} from '../full-page-overlay/full-page-overlay.react-component';
import styles from './bottom-drawer.module.less';

/** React props interface for Bottom Drawer */
export interface BottomDrawerProps {
    /** Id of the drawer. This is wired to a checkbox to toggle the drawer. */
    id: string;
    /** A title is required for A11Y. If you don't want to show it, pass `showTitle={false}`. */
    title: React.ReactNode;
    /** Flag to hide the Dialog title */
    showTitle?: boolean;
    /** Flag to determine if the `BottomDrawer` is displayed or not. Feeds into `CheckedStateCheckbox`'s `checked` prop. */
    isOpen?: boolean;
    /** Optional handler for when `BottomDrawer` is closed */
    onClose?: () => void;
    /** Optional handler for when `BottomDrawer` is open */
    onOpen?: () => void;
    /** HTML `className` attribute. Applied to the wrapping `div`. */
    className?: string;
}

/** The BottomDrawer component */
class BottomDrawerBase extends React.Component<
    BottomDrawerProps & PropsWithChildren<WithI18nProps>
> {
    static displayName = 'BottomDrawer';
    static propTypes = {};

    static defaultProps = {
        showTitle: true,
        isOpen: false,
        onClose: noop,
        onOpen: noop,
    };

    constructor(props: BottomDrawerProps & PropsWithChildren<WithI18nProps>) {
        super(props);
        this.gettext = props.gettext;
        this.dialogRef = React.createRef();
        this.labelledById = getUniqueId('bottom-drawer-title');
        this.onChangeChecked = false;
    }

    componentDidUpdate(prevProps: BottomDrawerProps & PropsWithChildren<WithI18nProps>) {
        const scrollableElement = this.scrollableContentDiv.current;

        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen !== this.onChangeChecked) {
            if (scrollableElement) {
                this.dialogRef.current?.onToggle(!!this.props.isOpen, scrollableElement);
            }
        }
    }

    gettext: WithI18nProps['gettext'];
    dialogRef: React.RefObject<FocusTrappingDialog>;
    labelledById: string;
    onChangeChecked: boolean;
    // This must be the element that will have overflow if the dialog content is too tall
    scrollableContentDiv = React.createRef<HTMLDivElement>();

    onChange = (event: CheckedStateChangeEvent) => {
        if (this.scrollableContentDiv.current) {
            this.dialogRef.current?.onToggle(isChecked(event), this.scrollableContentDiv.current);
        }

        const {onClose, onOpen} = this.props;
        this.onChangeChecked = !!event.target.dataset.checked;
        this.onChangeChecked ? onOpen?.() : onClose?.();
    };

    render() {
        const {id, children, className, isOpen, showTitle, title} = this.props;

        if (typeof document === 'undefined') {
            return null;
        }

        const drawer = (
            <div className={className}>
                <CheckedStateCheckbox
                    id={id}
                    checked={isOpen}
                    className={classNames(
                        'ud-full-page-overlay-checkbox',
                        styles['bottom-drawer-checkbox'],
                    )}
                    closeOnEscape={true}
                    onChange={this.onChange}
                />
                <FullPageOverlay cssToggleId={id} />
                <FocusTrappingDialog
                    ref={this.dialogRef}
                    labelledById={this.labelledById}
                    className={styles['bottom-drawer-container']}
                >
                    <div
                        ref={this.scrollableContentDiv}
                        data-purpose="content"
                        className={classNames('ud-bottom-drawer-content', styles.content)}
                    >
                        <FocusTrappingDialog.Title
                            id={this.labelledById}
                            className={styles['bottom-drawer-title']}
                            show={!!showTitle}
                        >
                            {title}
                        </FocusTrappingDialog.Title>
                        {children}
                    </div>
                    <DialogCloseButton
                        id={id}
                        label={this.gettext('Close bottom drawer')}
                        className={styles['close-btn']}
                    />
                </FocusTrappingDialog>
            </div>
        );

        return ReactDOM.createPortal(drawer, document.body);
    }
}

export const BottomDrawer = withI18n(BottomDrawerBase);
