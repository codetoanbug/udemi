import React from 'react';

import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';

import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import {SaveToListMenuItem} from './save-to-list-context-menu-item.react-component';

export function createSaveToListContextMenu() {
    return {
        getSaveToListContextMenu(saveToListButtonStore: SaveToListButtonStore) {
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.MX_MY_LEARNING_UNIT}
                    udStyle="white-solid"
                >
                    <ResourceContextMenu.Menu>
                        <SaveToListMenuItem saveToListButtonStore={saveToListButtonStore} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
    };
}
