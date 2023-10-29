import {useI18n} from '@udemy/i18n';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {ModalTrigger} from '@udemy/react-dialog-components';
import React from 'react';

import {UPDATE_LEARNING_PATH, UPDATE_LEARNING_PATH_BUTTON} from 'learning-path/constants';
import LearningPath from 'learning-path/learning-path.mobx-model';
import {LearningPathDetailsModal} from 'learning-path/list-page/learning-path-details-modal.react-component';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';
import {noop} from 'utils/noop';

export interface EditPathTitleDescriptionLearningPathMenuItemProps {
    learningPath: LearningPath;
    resourceContext: string;
}

export const EditPathTitleDescriptionLearningPathMenuItem = ({
    learningPath,
    resourceContext,
}: {
    learningPath: LearningPath;
    resourceContext: string;
}) => {
    const {gettext} = useI18n();
    const handleClick = () => {
        trackClickAction(resourceContext, 'Edit', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: learningPath.id,
        });
    };

    const handleSuccess = (title: string, description: string) => {
        learningPath.setTitle(title);
        learningPath.setDescription(description);
    };

    return (
        <>
            <ModalTrigger
                trigger={
                    <ContextMenuItem
                        icon={<EditIcon label={false} />}
                        title={gettext('Edit title and description')}
                        onClick={handleClick}
                    />
                }
                renderModal={({isOpen, onClose}) => (
                    <LearningPathDetailsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        onSuccess={handleSuccess}
                        onCancel={noop}
                        initialTitle={learningPath.title}
                        initialDescription={learningPath.description}
                        modalTitle={UPDATE_LEARNING_PATH.TEXT}
                        modalConfirmText={UPDATE_LEARNING_PATH_BUTTON.TEXT}
                    />
                )}
            />
        </>
    );
};

EditPathTitleDescriptionLearningPathMenuItem.shouldRender = function (
    props: EditPathTitleDescriptionLearningPathMenuItemProps,
) {
    return props.learningPath.canUserEdit && props.learningPath.isOrgLearningPath;
};
