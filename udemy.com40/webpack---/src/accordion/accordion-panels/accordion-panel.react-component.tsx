import {Keys, getUniqueId} from '@udemy/design-system-utils';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {
    CheckedStateCheckbox,
    CheckedStateChangeEvent,
    CheckedStateRadioGroup,
} from '@udemy/react-checked-state-components';
import {Button} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {Accordion, AccordionProps, AccordionSize} from '../accordion.react-component';
import styles from './accordion-panel.module.less';

/**
 * The Udemy Design System typography classes to apply to the AccordionPanel, based off key of {@link AccordionSize}
 *
 * @privateRemarks
 * Used internally by panels, not exposed outside @udemy/react-reveal-components
 */
export const TYPOGRAPHY = {
    medium: 'ud-heading-md',
    large: 'ud-heading-lg',
    xlarge: 'ud-heading-xl',
};

/** React component props for the AccordionPanel component */
export interface AccordionPanelProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
    /** The AccordionPanel heading. Displayed on the toggler. */
    title: React.ReactElement | string;
    /** Custom renderTitle method, if desired. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderTitle?: (...props: any) => React.ReactElement;
    /** Default expanded property. Used if not a controlled component */
    defaultExpanded?: boolean;
    /** Expanded flag for the AccordionPanel */
    expanded?: boolean;
    /**
     * The toggle strategy for the AccordionPanel.
     *
     * @defaultValue
     * 'show-hide` in `AccordionPanel`
     *
     * @remarks
     * Setting `toggleStrategy` to `add-remove` removes collapsed panels from the DOM.
     * They are added back on toggle. */
    toggleStrategy?: 'add-remove' | 'show-hide';
    /** The event handler for a Toggle event */
    onToggle?: (...args: any[]) => void;
    /** The parent {@link Accordion} component. Injected via mobx-react. */
    $$udAccordion?: Accordion;
    /** Unique ID of the AccordionPanel instance (ex: accordion-panel--1) */
    id?: string;
    /** Unique ID of the panel toggler for the AccordionPanel instance (ex: accordion-panel-title--1) */
    titleId?: string;
}

/** The AccordionPanel component. */
@inject('$$udAccordion')
@observer
export class AccordionPanel extends React.Component<AccordionPanelProps> {
    static defaultProps = {
        renderTitle: ({children, ...props}: {children: React.ReactNode}) => (
            <h3 {...props}>{children}</h3>
        ),
        className: '',
        defaultExpanded: undefined,
        expanded: undefined,
        toggleStrategy: 'show-hide',
        onToggle: noop,
    };

    constructor(props: AccordionPanelProps) {
        super(props);
        this.id = props.id ?? getUniqueId('accordion-panel');
        this.titleId = props.titleId ?? getUniqueId('accordion-panel-title');
        if (this.props.defaultExpanded) {
            this._expanded = true;
            this.props.$$udAccordion?.setSelectedPanelId(this.id);
        }
    }

    componentDidUpdate(prevProps: AccordionPanelProps) {
        if (this.props.expanded !== prevProps.expanded && this.props.expanded !== this._expanded) {
            this.handleChange({
                target: {
                    id: this.id,
                    dataset: {checked: this.props.expanded ? 'checked' : ''},
                },
            });
        }
    }

    static $$udType = 'Accordion.Panel';

    id: string;
    titleId: string;
    @observable _expanded = false;

    get expanded() {
        if (this.props.expanded !== undefined) {
            return this.props.expanded;
        }
        if (this.props.$$udAccordion?.props.toggleBehavior === 'any') {
            return this._expanded;
        }
        return this.id === this.props.$$udAccordion?.selectedPanelId;
    }

    @action handleChange = (event: CheckedStateChangeEvent) => {
        this._expanded = !!event.target.dataset.checked;
        const selectedPanelId = this._expanded ? this.id : null;
        this.props.$$udAccordion?.setSelectedPanelId(selectedPanelId);
        this.props.onToggle?.(this._expanded, event);
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.keyCode === Keys.UP || event.keyCode === Keys.DOWN) {
            const accordion = this.props.$$udAccordion?.ref.current;
            if (accordion) {
                event.preventDefault();
                const togglers: HTMLElement[] = Array.from(
                    accordion.querySelectorAll('.js-panel-toggler'),
                );
                const thisIndex = togglers.findIndex((toggler) => toggler === event.currentTarget);
                const targetIndex = thisIndex + (event.keyCode === Keys.UP ? -1 : 1);
                const targetToggler: HTMLElement =
                    togglers[(targetIndex + togglers.length) % togglers.length];
                targetToggler?.focus?.();
            }
        }
    };

    render() {
        const {
            children,
            className,
            defaultExpanded,
            expanded,
            toggleStrategy,
            onToggle,
            title,
            renderTitle,
            $$udAccordion,
            id,
            titleId,
            ...props
        } = this.props;
        const {toggleBehavior, showExpandIcon, size} = $$udAccordion?.props as AccordionProps;
        const typography = TYPOGRAPHY[size as AccordionSize];
        const Input =
            toggleBehavior === 'any' ? CheckedStateCheckbox : CheckedStateRadioGroup.Radio;
        const toggler = (
            <Button
                aria-disabled={toggleBehavior === 'always-one' ? this.expanded : false}
                aria-expanded={this.expanded}
                className={classNames('js-panel-toggler', styles['panel-toggler'])}
                id={this.titleId}
                onKeyDown={this.handleKeyDown}
                typography={typography}
                udStyle="link"
            >
                <span className="ud-accordion-panel-title">{title}</span>
            </Button>
        );

        return (
            <div {...props} className={classNames(styles.panel, className)}>
                <Input id={this.id} checked={this.expanded} onChange={this.handleChange} />
                {/* Lots of nuance behind this HTML structure. See https://github.com/udemy/website-django/pull/46481. */}
                <Button
                    componentClass="div"
                    className={classNames(
                        'ud-accordion-panel-toggler',
                        styles['panel-toggler'],
                        styles['outer-panel-toggler'],
                    )}
                    cssToggleId={this.id}
                    typography={typography}
                    udStyle="link"
                >
                    {renderTitle?.({
                        className: 'ud-accordion-panel-heading',
                        children: toggler,
                    })}
                    {showExpandIcon && (
                        <ExpandIcon
                            className={styles['expand-icon']}
                            label={false}
                            color="neutral"
                            size={size === 'xlarge' ? 'medium' : 'small'}
                        />
                    )}
                </Button>
                {(toggleStrategy === 'show-hide' || this.expanded) && (
                    <div
                        className={styles['content-wrapper']}
                        aria-labelledby={this.titleId}
                        aria-hidden={!this.expanded}
                        role="group"
                    >
                        <div className={classNames('ud-accordion-panel-content', styles.content)}>
                            {children}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
