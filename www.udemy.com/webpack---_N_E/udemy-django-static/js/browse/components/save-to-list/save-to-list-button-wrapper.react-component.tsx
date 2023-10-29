import {observer} from 'mobx-react';
import React from 'react';

import {useDeviceType} from '@udemy/hooks';
import {Button, ButtonProps, IconButton} from '@udemy/react-core-components';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {PersonalPlanCourse} from 'udemy-django-static/js/browse/types/course';
import {SaveToListPopover} from 'udemy-django-static/js/course-taking//header/save-to-list-popover.react-component';

import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import {SaveToListModal} from './save-to-list-modal.react-component';

interface SaveToListButtonProps {
    onClick: () => void;
    round?: boolean;
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    labelPosition?: 'left' | 'right';
}
const SaveToListButton = ({
    onClick,
    round = false,
    size = 'large',
    labelPosition = 'left',
    ...givenButtonProps
}: SaveToListButtonProps) => {
    const buttonProps: ButtonProps = {
        udStyle: 'secondary',
        size,
        ...givenButtonProps,
    };
    const deviceType = useDeviceType();
    const label = deviceType === 'desktop' ? gettext('Save') : gettext('Save to list');
    if (round) {
        return (
            <IconButton {...buttonProps} round={true} onClick={onClick}>
                <ExpandPlusIcon label={label} color="inherit" />
            </IconButton>
        );
    }
    return (
        <Button onClick={onClick} {...buttonProps}>
            {labelPosition === 'left' && <span>{label}</span>}
            <ExpandPlusIcon label={false} color="inherit" size={size} />
            {labelPosition === 'right' && <span>{label}</span>}
        </Button>
    );
};

interface SaveToListButtonWrapperProps {
    course: PersonalPlanCourse;
    uiRegion: string;
    showPopover?: boolean;
    popoverName?: string;
}

export const SaveToListButtonWrapper = observer(
    ({
        course,
        uiRegion,
        showPopover = false,
        popoverName = '',
        ...saveToListButtonProps
    }: SaveToListButtonWrapperProps) => {
        const [store] = React.useState(() => new SaveToListButtonStore(course, uiRegion));
        if (!course.is_in_user_subscription) {
            return null;
        }

        function onSelectListModal() {
            store.openModal();
        }

        let button = <SaveToListButton onClick={onSelectListModal} {...saveToListButtonProps} />;

        if (showPopover) {
            button = (
                <SaveToListPopover
                    text={gettext('Save to list')}
                    title={gettext('Organize and save courses to lists')}
                    popoverName={popoverName}
                    trigger={button}
                />
            );
        }

        return (
            <>
                {button}
                <SaveToListModal saveToListButtonStore={store} />
            </>
        );
    },
);
