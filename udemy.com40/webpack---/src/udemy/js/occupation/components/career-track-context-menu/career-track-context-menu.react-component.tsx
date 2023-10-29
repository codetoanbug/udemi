import {ClientSideRender} from '@udemy/design-system-utils';
import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import {DATA_SCIENTIST_UNIT_TITLE, WEB_DEVELOPER_UNIT_TITLE} from 'occupation/constants';
import {CareerTrackPageLinkAddEvent, CareerTrackPageLinkRemoveEvent} from 'occupation/events';
import {LearningMapStore} from 'occupation/stores/learning-map/learning-map.mobx-store';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';

import styles from './career-track-context-menu.less';

interface CareerTrackContextMenuProps {
    title: string;
    learningMapStore: LearningMapStore;
}

export const CareerTrackContextMenu = observer(
    ({title, learningMapStore}: CareerTrackContextMenuProps) => {
        const {gettext} = useI18n();
        const trackAdd = () => {
            Tracker.publishEvent(
                new CareerTrackPageLinkAddEvent({
                    displayTitle: title,
                    nonInteraction: false,
                }),
            );
        };

        const trackRemove = () => {
            Tracker.publishEvent(
                new CareerTrackPageLinkRemoveEvent({
                    displayTitle: title,
                }),
            );
        };

        const toggleMyLearning = (
            learningMapStore: LearningMapStore,
            value: boolean,
            setter: (settingValue: boolean) => void,
        ) => {
            value ? trackRemove() : trackAdd();
            setter(!value);
        };

        const renderLoader = () => {
            return <Loader />;
        };

        const renderContextMenu = () => {
            let value = false;
            let setter: (settingValue: boolean) => void;

            if (title === WEB_DEVELOPER_UNIT_TITLE) {
                value = learningMapStore.userExploredWebDeveloperCareerTrack ?? false;
                setter = learningMapStore.setUserExploredWebDeveloperCareerTrack;
            } else if (title === DATA_SCIENTIST_UNIT_TITLE) {
                value = learningMapStore.userExploredDataScientistCareerTrack ?? false;
                setter = learningMapStore.setUserExploredDataScientistCareerTrack;
            }

            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.MX_MY_LEARNING_UNIT}
                    udStyle="white-solid"
                >
                    <ResourceContextMenu.Menu>
                        <ContextMenuItem
                            icon={null}
                            title={
                                value
                                    ? gettext('Remove from My Learning')
                                    : gettext('Add career guide to My Learning')
                            }
                            onClick={() => toggleMyLearning(learningMapStore, value, setter)}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        };

        const renderComponents = () => {
            const renderLoaderOrComponent = (settingLoaded: boolean) =>
                settingLoaded ? renderContextMenu() : renderLoader();
            if (title === WEB_DEVELOPER_UNIT_TITLE) {
                return renderLoaderOrComponent(
                    learningMapStore.webDeveloperCareerTrackSettingLoaded,
                );
            } else if (title === DATA_SCIENTIST_UNIT_TITLE) {
                return renderLoaderOrComponent(
                    learningMapStore.dataScientistCareerTrackSettingLoaded,
                );
            }
            return null;
        };

        return (
            <ClientSideRender placeholder={renderLoader()}>
                <div className={styles['context-menu']}>{renderComponents()}</div>
            </ClientSideRender>
        );
    },
);
