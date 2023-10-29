import {getUniqueId} from '@udemy/design-system-utils';
import {CheckedStateRadioGroup} from '@udemy/react-checked-state-components';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

import {AccordionPanel} from './accordion-panels/accordion-panel.react-component';

/** The potential sizes of an Accordion component */
export type AccordionSize = 'medium' | 'large' | 'xlarge';

/** React props interface for the Accordion component */
export interface AccordionProps extends React.ComponentPropsWithoutRef<'div'> {
    /**
     * The desired behavior when a user toggles an Accordion panel
     * - 'any': You can open or close any panel.
     * - 'always-one': You can only open one panel at a time. You cannot close the open panel unless you open another panel.
     * - 'max-one': You can only open one panel at a time. You can close the open panel.
     */
    toggleBehavior?: 'any' | 'always-one' | 'max-one';
    /** Flag to display the expand icon */
    showExpandIcon?: boolean;
    /** Children of Accordion panel */
    children: React.ReactNode;
    /** The {@link AccordionSize} of the Accordion */
    size?: AccordionSize;
    /** Unique name of the Accordion instance (ex: faq-accordion) */
    name?: string;
}

/** The Accordion component */
@observer
export class Accordion extends React.Component<AccordionProps> {
    static defaultProps = {
        toggleBehavior: 'any',
        showExpandIcon: true,
        size: 'large',
    };

    constructor(props: AccordionProps) {
        super(props);
        this.name = props.name ?? getUniqueId('accordion');
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Panel: typeof AccordionPanel;

    name: string;
    ref: React.RefObject<HTMLDivElement> = React.createRef(); // Used by Accordion.Panel for keyboard navigation.
    @observable selectedPanelId: string | null = null;

    @action setSelectedPanelId = (id: string | null) => {
        // Called by Accordion.Panel.
        this.selectedPanelId = id;
    };

    render() {
        const {toggleBehavior, showExpandIcon, size, ...passthroughProps} = this.props;
        const accordion = (
            <Provider $$udAccordion={this}>
                <div ref={this.ref} {...passthroughProps} />
            </Provider>
        );
        if (toggleBehavior === 'any') {
            return accordion;
        }
        return (
            <CheckedStateRadioGroup allowToggle={toggleBehavior === 'max-one'} name={this.name}>
                {accordion}
            </CheckedStateRadioGroup>
        );
    }
}

Accordion.Panel = AccordionPanel;
