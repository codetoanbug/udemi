import {observer} from 'mobx-react';
import React from 'react';

import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button, ButtonProps, IconButton} from '@udemy/react-core-components';

import {ShoppingCourse} from '../types/course-types';
import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import {SaveToListModal} from './save-to-list-modal.react-component';

type InternalSaveToListButtonProps = {
    /**
     * Position of the label
     */
    labelPosition?: 'left' | 'right';
    /**
     * Label shown on the button
     */
    label?: string;
} & ButtonProps;

const InternalSaveToListButton = ({
    round = false,
    size = 'large',
    labelPosition = 'left',
    label,
    onClick,
    ...givenButtonProps
}: InternalSaveToListButtonProps) => {
    const buttonProps: ButtonProps = {
        udStyle: 'secondary',
        size,
        ...givenButtonProps,
    };
    const isSmallLayout = useMatchMedia('sm-max');
    const {gettext} = useI18n();
    const defaultLabel = !isSmallLayout ? gettext('Save') : gettext('Save to list');
    const labelText = label ?? defaultLabel;
    if (round) {
        return (
            <IconButton {...buttonProps} round={true} onClick={onClick}>
                <ExpandPlusIcon label={labelText} color="inherit" />
            </IconButton>
        );
    }
    return (
        <Button data-testid="save-to-list-button" onClick={onClick} {...buttonProps}>
            {labelPosition === 'left' && <span>{labelText}</span>}
            <ExpandPlusIcon label={false} color="inherit" size={size} />
            {labelPosition === 'right' && <span>{labelText}</span>}
        </Button>
    );
};

/**
 * Props for the `SaveToListButton` component
 */
export type SaveToListButtonProps = {
    /**
     * Subset of course info that is required
     */
    course: ShoppingCourse;
    /**
     * The UI region in which this component is rendered
     */
    uiRegion: string;
    /**
     * Optional function to render a popover with the actual button as its trigger.
     * If not provided, the button will be rendered normally.
     * @param trigger Element that should be used to trigger the popover
     */
    renderPopover?(trigger: React.ReactElement): React.ReactElement;
} & InternalSaveToListButtonProps;

/**
 * Renders a button that, when clicked, opens a modal that allows the user to save the provided
 * course to an existing list or create a new list
 */
export const SaveToListButton = observer(
    ({course, uiRegion, renderPopover, ...saveToListButtonProps}: SaveToListButtonProps) => {
        const {gettext, interpolate} = useI18n();
        const [store] = React.useState(
            () => new SaveToListButtonStore(course, uiRegion, {gettext, interpolate}),
        );
        if (!course.is_in_user_subscription) {
            return null;
        }

        function onSelectListModal() {
            store.openModal();
        }

        let button = (
            <InternalSaveToListButton onClick={onSelectListModal} {...saveToListButtonProps} />
        );

        if (renderPopover) {
            button = renderPopover(button);
        }

        return (
            <>
                {button}
                <SaveToListModal saveToListButtonStore={store} />
            </>
        );
    },
);
