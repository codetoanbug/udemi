import {useI18n} from '@udemy/i18n';
import AddToGroupIcon from '@udemy/icons/dist/add-to-group.ud-icon';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';
import {observer} from 'mobx-react';
import React from 'react';

import {BrowseCourse} from 'browse/types/course';
import AddCourseToLearningPathModal from 'learning-path/add-course-to-learning-path/add-course-to-learning-path-modal.react-component';
import {isLearningPathEnabled} from 'organization-common/utils';

import {AddCourseToLearningPathButtonStore} from './add-course-to-learning-path-button.mobx-store';

export interface AddCourseToLearningPathButtonProps {
    course: BrowseCourse;
    store: AddCourseToLearningPathButtonStore;
    buttonProps?: ButtonProps;
}

export const AddCourseToLearningPathButton = observer(
    ({course, store, buttonProps}: AddCourseToLearningPathButtonProps) => {
        const {Config: udConfig} = useUDData();
        const {gettext} = useI18n();

        // eslint-disable-next-line @typescript-eslint/naming-convention
        if (!isLearningPathEnabled({Config: udConfig})) {
            return null;
        }
        const organizationId = udConfig.brand.has_organization && udConfig.brand.organization?.id;

        const openLearningPathModal = () => {
            store.setIsLearningPathModalVisible(true);
        };

        const closeLearningPathModal = () => {
            store.setIsLearningPathModalVisible(false);
        };
        return (
            <>
                <Button onClick={openLearningPathModal} {...{udStyle: 'secondary', ...buttonProps}}>
                    <AddToGroupIcon label={gettext('Add to learning path')} />
                    <span data-purpose="add-to-learning-path-button-text">{gettext('Add')}</span>
                </Button>
                <AddCourseToLearningPathModal
                    courseId={course.id}
                    isVisible={store.isLearningPathModalVisible}
                    onHide={closeLearningPathModal}
                    onCourseAdded={store.onCourseAdded}
                    organizationId={organizationId}
                    courseLearningPaths={course?.learningPathsIds ?? []}
                />
            </>
        );
    },
);
