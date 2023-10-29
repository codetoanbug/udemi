import {withI18n} from '@udemy/i18n';
import BookmarkOutlinedIcon from '@udemy/icons/dist/bookmark-outline.ud-icon';
import Saved from '@udemy/icons/dist/saved.ud-icon';
import {observer} from 'mobx-react';
import React from 'react';

import {SaveButtonStore} from 'browse/components/ub-save-button/save-button.mobx-store';
import {SaveButtonProps} from 'browse/components/ub-save-button/types';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

export const InternalSaveCourseMenuItem = observer(
    (props: {
        courseId: SaveButtonProps['courseId'];
        enrollment: SaveButtonProps['enrollment'];
        enableUBListExperiment: boolean;
    }) => {
        const [store] = React.useState(
            () => new SaveButtonStore(props.courseId, props.enrollment, gettext),
        );

        const keepMenuOpen = () => false;
        const handleClick = () => {
            store.toggleSaveCourse();
            return keepMenuOpen();
        };

        return (
            <ContextMenuItem
                icon={
                    store.isSaved ? <Saved label={false} /> : <BookmarkOutlinedIcon label={false} />
                }
                title={store.isSaved ? gettext('Saved') : gettext('Save')}
                onClick={handleClick}
            />
        );
    },
);

export const SaveCourseMenuItem = Object.assign({}, withI18n(InternalSaveCourseMenuItem), {
    shouldRender(props: {enableUBListExperiment: boolean}) {
        return props.enableUBListExperiment;
    },
});
