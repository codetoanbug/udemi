import {Button} from '@udemy/react-core-components';
import React from 'react';

import {OccupationVisibilityStore} from 'occupation/stores/occupation-visibility/occupation-visibility.mobx-store';
import {PERSONALIZE_URL} from 'personalize/constants';

import {OccupationModal} from '../occupation-modal/occupation-modal.react-component';

interface OccupationModalButtonProps {
    buttonText: string;
    onClickCallback?: () => void;
    nextUrl?: string;
    enableLearnerGoalCollection?: boolean;
}

export const OccupationModalButton = ({
    buttonText,
    onClickCallback,
    nextUrl,
    enableLearnerGoalCollection,
}: OccupationModalButtonProps) => {
    const [occupationVisibilityStore] = React.useState(
        () => new OccupationVisibilityStore(nextUrl),
    );

    const onClick = () => {
        occupationVisibilityStore.openModal();
        onClickCallback?.();
    };

    return (
        <>
            <Button
                data-purpose="occupation-link"
                className="ud-link-underline"
                componentClass={enableLearnerGoalCollection ? 'a' : 'button'}
                size="xsmall"
                href={enableLearnerGoalCollection ? PERSONALIZE_URL : undefined}
                udStyle="ghost"
                onClick={enableLearnerGoalCollection ? undefined : onClick}
            >
                {buttonText}
            </Button>
            <OccupationModal occupationVisibilityStore={occupationVisibilityStore} />
        </>
    );
};
