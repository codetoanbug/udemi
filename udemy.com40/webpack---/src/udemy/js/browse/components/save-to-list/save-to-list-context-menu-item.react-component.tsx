import {withI18n, WithI18nProps} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {observer} from 'mobx-react';
import React from 'react';

import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import {SaveToListModal} from './save-to-list-modal.react-component';

export interface SaveToListMenuItemProps {
    saveToListButtonStore: SaveToListButtonStore;
}

@observer
export class InternalSaveToListMenuItem extends React.Component<
    SaveToListMenuItemProps & WithI18nProps
> {
    static shouldRender(args: SaveToListMenuItemProps) {
        return args.saveToListButtonStore.course.is_in_user_subscription;
    }

    onSelectListModal = () => {
        this.props.saveToListButtonStore.openModal();
    };

    render() {
        const {gettext} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={<ExpandPlusIcon color="inherit" label={false} />}
                    title={gettext('Save course to list')}
                    onClick={this.onSelectListModal}
                />
                <SaveToListModal saveToListButtonStore={this.props.saveToListButtonStore} />
            </>
        );
    }
}

export const SaveToListMenuItem = Object.assign({}, withI18n(InternalSaveToListMenuItem), {
    shouldRender: InternalSaveToListMenuItem.shouldRender,
});
