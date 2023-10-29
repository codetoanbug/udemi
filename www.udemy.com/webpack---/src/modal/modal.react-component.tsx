import {getUniqueId, RootCloseWrapperContext} from '@udemy/design-system-utils';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {
    isChecked,
    CheckedStateCheckboxChangeEventHandler,
    CheckedStateCheckbox,
} from '@udemy/react-checked-state-components';
import {IconButton} from '@udemy/react-core-components';
import {PopperModalContext} from '@udemy/react-popup-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {PropsWithChildren, useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';

import {FocusTrappingDialog} from '../focus-trapping-dialog/focus-trapping-dialog.react-component';
import {
    FullPageOverlay,
    EXIT_ANIMATION_DURATION_MS,
} from '../full-page-overlay/full-page-overlay.react-component';
import styles from './modal.module.less';

/**
 * Component props for `Modal`.
 */
export interface ModalProps {
    /**
     *  Set to true to show the modal.
     *
     * @defaultValue false in `Modal`
     **/
    isOpen: boolean;
    /** A title is required for A11Y. If you do not want to show it, use `renderTitle`. */
    title: React.ReactNode;
    /** Set to true if the user is required to choose an action, rather than close the modal. */
    requireExplicitAction?: boolean;
    /** Called when something inside Modal closes the modal (e.g. close button, Escape key). */
    onClose?: () => void;
    /** Called when parent component opens the modal. */
    onOpen?: () => void;
    /**
     * If false, dialog will be shown in an overlay. If true, dialog content will consume the
     * page without an overlay.
     *
     * @defaultValue false in `Modal`
     **/
    fullPage?: boolean;
    /**
     * If true, dialog will show a loading container rather than the title and component
     * children. Set to false to show title and children.
     *
     * @defaultValue false in `Modal`
     */
    loading?: boolean;
    className?: string;
    /**
     * Function that returns the containing element for this dialog.
     *
     * @defaultValue a function that returns the document body, in `Modal`
     */
    getContainer?: () => HTMLElement;
    /**
     * Render a custom title node.
     *
     * @remarks
     * For cases where the title is inside the modal body. Set `title` to an empty
     * string and provide this function. The function should return an array with
     * the ID of the title element and the content of the title
     **/
    renderTitle?: (props: ModalProps) => [string, React.ReactNode];
}

const defaultGetContainer = () => document.body;

/**
 * Modal dialog component
 */
@observer
class ModalBase extends React.Component<ModalProps & PropsWithChildren<WithI18nProps>> {
    static displayName = 'Modal';
    static defaultProps = {
        requireExplicitAction: false,
        onClose: noop,
        onOpen: noop,
        fullPage: false,
        loading: false,
        className: undefined,
        getContainer: defaultGetContainer,
        renderTitle: undefined,
    };

    componentDidMount() {
        if (this.props.isOpen) {
            this.toggle(true, noop, noop);
        }
    }

    componentDidUpdate(prevProps: ModalProps & PropsWithChildren<WithI18nProps>) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen !== this.onChangeIsOpen) {
            // Do not call onClose; see https://github.com/udemy/website-django/pull/61831.
            if (this.props.onOpen) {
                this.toggle(this.props.isOpen, this.props.onOpen, noop);
            }
        }
    }

    readonly containerRef = React.createRef<HTMLDivElement>();
    readonly dialogRef = React.createRef<FocusTrappingDialog>();
    readonly id = getUniqueId('modal');
    readonly labelledById = getUniqueId('modal-title');

    @observable onChangeIsOpen = false;
    @observable shouldRenderClosedModal = false;

    @action toggle(isOpen: boolean, onOpen: () => void, onClose: () => void) {
        this.onChangeIsOpen = isOpen;
        this.shouldRenderClosedModal = !this.props.fullPage;
        if (this.dialogRef?.current) {
            // Pass the modal container as the scrollable container
            this.dialogRef.current.onToggle(isOpen, this.containerRef.current);
        }
        this.onChangeIsOpen ? onOpen() : onClose();
        if (!this.onChangeIsOpen) {
            setTimeout(
                action(() => {
                    this.shouldRenderClosedModal = false;
                }),
                EXIT_ANIMATION_DURATION_MS,
            );
        }
    }

    onChange: CheckedStateCheckboxChangeEventHandler = (event) => {
        if (this.props.onOpen && this.props.onClose) {
            this.toggle(isChecked(event), this.props.onOpen, this.props.onClose);
        }
    };

    renderTitle = ({title}: ModalProps) => {
        const titleNode = (
            <div
                className={classNames({
                    [styles['title-spacer']]: !this.props.requireExplicitAction,
                })}
            >
                <FocusTrappingDialog.Title
                    id={this.labelledById}
                    className="ud-modal-title"
                    show={true}
                >
                    {title}
                </FocusTrappingDialog.Title>
            </div>
        );
        return [this.labelledById, titleNode];
    };

    render() {
        const {className, children, fullPage, isOpen, loading, requireExplicitAction} = this.props;
        if (typeof document === 'undefined' || (!isOpen && !this.shouldRenderClosedModal)) {
            return null;
        }

        const [labelledById, title] = (this.props.renderTitle ?? this.renderTitle)(this.props);

        const modal = (
            <ModalContainer containerRef={this.containerRef}>
                <CheckedStateCheckbox
                    id={this.id}
                    className="ud-full-page-overlay-checkbox"
                    closeOnEscape={true}
                    checked={this.onChangeIsOpen}
                    onChange={this.onChange}
                />
                <div
                    className={classNames(
                        'ud-full-page-overlay-container',
                        styles['scroll-wrapper'],
                        {[styles['desktop-centered']]: !fullPage},
                    )}
                >
                    {!fullPage && (
                        <FullPageOverlay
                            cssToggleId={requireExplicitAction ? undefined : this.id}
                            className={styles.overlay}
                        />
                    )}
                    <FocusTrappingDialog
                        ref={this.dialogRef}
                        labelledById={labelledById as string}
                        className={classNames(
                            className,
                            'ud-modal',
                            styles.dialog,
                            fullPage ? styles['full-size'] : styles['default-size'],
                            {
                                [styles['dialog-loading']]: loading,
                            },
                        )}
                    >
                        {loading && <MainContentLoader color="inherit" className={styles.loader} />}
                        {!loading && title}
                        {!loading && children}
                        {!requireExplicitAction && (
                            <IconButton
                                cssToggleId={this.id}
                                udStyle="ghost"
                                size="medium"
                                className={classNames('ud-modal-close', styles['close-button'])}
                                data-purpose="close-popup"
                            >
                                <CloseIcon
                                    color="neutral"
                                    label={this.props.gettext('close modal')}
                                />
                            </IconButton>
                        )}
                    </FocusTrappingDialog>
                </div>
            </ModalContainer>
        );

        // Explicitly fall back to default; otherwise TS would either force a cast or
        // prevent a call to ReactDOM.createPortal with an undefined second argument.
        const getContainer = this.props.getContainer ?? defaultGetContainer;

        return ReactDOM.createPortal(modal, getContainer());
    }
}

export const Modal = withI18n(ModalBase);

interface ModalContainerProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Internal component to handle Modal in Popover edge cases
 *
 * @remarks
 * inside quick view box popover. In particular:
 * - If you click on the modal, it should not count as "root closing" the parent popover.
 * - If you hover on the modal, it should not count as hovering on the parent popover.
 *
 * @internal
 */
const ModalContainer = ({containerRef, children}: PropsWithChildren<ModalContainerProps>) => {
    const {onMount, onUnmount} = useContext(PopperModalContext);
    const {ignoreRootClose} = useContext(RootCloseWrapperContext);

    useEffect(() => {
        onMount();

        return () => {
            onUnmount();
        };
    }, [onMount, onUnmount]);

    return (
        <>
            {/* onClick is is only being used to capture bubbled events. */}
            {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
                ref={containerRef}
                onClick={ignoreRootClose}
                className={styles['dialog-container']}
            >
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                {children}
            </div>
        </>
    );
};
