/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {CheckedStateCheckbox} from '@udemy/react-checked-state-components';
import {Button} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import {pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import styles from './show-more.module.less';

/** React props interface for the ShowMore component. */
interface ShowMoreButtonProps {
    /**
     * Unique id for the toggle button.  Used for the `cssToggleId` mechanism.
     * @see {@link CheckedStateCheckbox}
     */
    inputId: string;
    /** Text to display when `ShowMore` is in the collapsed state. */
    moreButtonLabel?: string;
    /** Text to display when `ShowMore` is in the expanded state. */
    lessButtonLabel?: string;
    /** The element to render for the `ShowMore` toggle. */
    buttonComponent: React.ElementType;
    /** Flag to make the toggle button the full width of the `ShowMore` component. */
    fullWidthButton: boolean;
    /** Flag to hide the `ExpandIcon` and `CollapseIcon` */
    hideIcons: boolean;
    /** `aria-label` attribute to apply to the `ShowMoreButton` when expanded  */
    ariaLabelExpanded?: string;
    /** `aria-label` attribute to apply to the `ShowMoreButton` when collapsed  */
    ariaLabelCollapsed?: string;
    /** Flag tied to if the parent `ShowMore` component is in the expanded or collapsed state. */
    isExpanded: boolean;
}

/**
 * The ShowMoreButton component.
 *
 * @remarks
 * The display of text within this component is toggled via CSS based on expanded state of `ShowMore`
 */
const ShowMoreButton = ({
    inputId,
    buttonComponent: ButtonComponent,
    fullWidthButton,
    hideIcons,
    isExpanded,
    ...props
}: ShowMoreButtonProps) => {
    const {gettext} = useI18n();
    const {
        lessButtonLabel = gettext('Show less'),
        moreButtonLabel = gettext('Show more'),
        ariaLabelExpanded = gettext('Show less'),
        ariaLabelCollapsed = gettext('Show more'),
    } = props;

    return (
        <ButtonComponent
            udStyle="ghost"
            cssToggleId={inputId}
            className={classNames(styles['focusable-label'], {
                [styles['full-width']]: fullWidthButton,
            })}
            size="medium"
            aria-label={isExpanded ? ariaLabelExpanded : ariaLabelCollapsed}
        >
            <span>
                <span className={classNames(styles['show-more'])}>{moreButtonLabel}</span>
                <span className={classNames(styles['show-less'])}>{lessButtonLabel}</span>
            </span>
            {!hideIcons && <ExpandIcon label={false} className={classNames(styles['show-more'])} />}
            {!hideIcons && (
                <CollapseIcon label={false} className={classNames(styles['show-less'])} />
            )}
        </ButtonComponent>
    );
};

/** React props interface for the ShowMore component */
export interface ShowMoreProps extends React.ComponentPropsWithoutRef<'div'> {
    /** Optional className to apply to the content wrapping `<div>` within `ShowMore`. */
    contentClassName?: string;
    /**
     * The height of the `ShowMore` when collapsed.
     *
     * @remarks
     * This is expected to be a `px` value. It will be converted to `rem` within the component.
     */
    collapsedHeight: number;
    /** Flag to set the initial state of the `ShowMore` component (either expanded or collapsed states) */
    defaultExpanded?: boolean;
    /** Flag to make the toggle button the full width of the `ShowMore` component. */
    fullWidthButton?: boolean;
    /** Text to display when `ShowMore` is in the collapsed state. */
    moreButtonLabel?: string;
    /** Text to display when `ShowMore` is in the expanded state. */
    lessButtonLabel?: string;
    /**
     * The element to render for the `ShowMore` toggle.
     *
     * @defaultValue {@link Button} component in `ShowMore`
     */
    buttonComponent?: React.ElementType;
    /** Optional event handler triggered when `ShowMore` state is toggled. */
    onToggle?: (isExpanded: boolean) => void;
    /** Optional flag to add gradient to gradually fade out collapsed content within `ShowMore`. */
    withGradient?: boolean;
    /** Flag to hide the `ExpandIcon` and `CollapseIcon` */
    hideIcons?: boolean;
    /** `aria-label` text for the buttonComponent to display when `ShowMore` is in the expanded state. */
    ariaLabelExpanded?: string;
    /** `aria-label` text for the buttonComponent to display when `ShowMore` is in the collapsed state. */
    ariaLabelCollapsed?: string;
}

/**
 * The ShowMore component.
 *
 * @remarks
 * A collapsible region of text, with button to toggle to an expanded state.
 *
 * @privateRemarks
 * This component works even when JavaScript has not loaded, via the `cssToggleId` mechanism.
 */
@observer
export class ShowMore extends React.Component<ShowMoreProps> {
    static defaultProps = {
        defaultExpanded: undefined,
        fullWidthButton: false,
        lessButtonLabel: undefined,
        moreButtonLabel: undefined,
        buttonComponent: Button,
        onToggle: noop,
        withGradient: false,
        hideIcons: false,
        ariaLabelExpanded: undefined,
        ariaLabelCollapsed: undefined,
    };

    constructor(props: ShowMoreProps) {
        super(props);
        this.contentContainerRef = React.createRef();
        this.contentRef = React.createRef();
        this.inputId = getUniqueId('show-more');
        this.isExpanded = this.props.defaultExpanded ?? false;
    }

    componentDidMount() {
        this.checkOverflow();
    }

    componentDidUpdate() {
        this.checkOverflow();
    }

    contentContainerRef: React.RefObject<HTMLDivElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    inputId: string;

    @action
    checkOverflow = () => {
        const contentHeight = this.contentRef.current?.offsetHeight ?? 0;
        const contentContainerHeight = this.props.collapsedHeight;
        this.doesContentOverflow = contentHeight > contentContainerHeight;
    };

    @action
    toggle = () => {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) this.contentRef.current?.focus();
        this.props.onToggle?.(this.isExpanded);
    };

    @observable doesContentOverflow = true;
    @observable isExpanded;

    render() {
        const {
            children,
            className,
            contentClassName,
            collapsedHeight,
            fullWidthButton,
            lessButtonLabel,
            moreButtonLabel,
            ariaLabelExpanded,
            ariaLabelCollapsed,
            buttonComponent,
            withGradient,
            hideIcons,
        } = this.props;

        return (
            <div className={classNames(className, styles.container)}>
                <CheckedStateCheckbox
                    id={this.inputId}
                    onChange={this.toggle}
                    defaultChecked={this.isExpanded}
                />
                <div
                    className={classNames(contentClassName, styles.content, {
                        [styles['with-gradient']]: withGradient && this.doesContentOverflow,
                    })}
                    style={{maxHeight: `${pxToRem(collapsedHeight)}rem`}}
                    ref={this.contentContainerRef}
                >
                    <div tabIndex={this.isExpanded ? 0 : -1} ref={this.contentRef}>
                        {children}
                    </div>
                </div>
                {this.doesContentOverflow &&
                    buttonComponent !== undefined &&
                    fullWidthButton !== undefined && (
                        <ShowMoreButton
                            inputId={this.inputId}
                            lessButtonLabel={lessButtonLabel}
                            moreButtonLabel={moreButtonLabel}
                            ariaLabelExpanded={ariaLabelExpanded}
                            ariaLabelCollapsed={ariaLabelCollapsed}
                            buttonComponent={buttonComponent}
                            fullWidthButton={fullWidthButton}
                            hideIcons={!!hideIcons}
                            isExpanded={this.isExpanded}
                        />
                    )}
            </div>
        );
    }
}
