import React from 'react';

import {ActivityNotificationsStore} from '@udemy/activity-notifications';

import {BrowseNavStore} from '../desktop/browse/browse-nav.mobx-store';
import {MyLearningStore} from '../desktop/my-learning/my-learning.mobx-store';
import {HeaderStore} from '../header.mobx-store';
import {MobileNavStore} from '../mobile/mobile-nav/mobile-nav.mobx-store';
import {UfbContext} from '../types/ufb-context';
import {CustomCategoriesModel, LearningPathsMenuModel} from '../ufb-browse-types';

export interface HeaderContextType {
    activityNotificationsStore?: ActivityNotificationsStore;
    browseNavStore?: BrowseNavStore;
    headerStore?: HeaderStore;
    mobileNavStore?: MobileNavStore;
    myLearningStore?: MyLearningStore;
    ufbContext?: UfbContext;
    customCategoriesModel?: CustomCategoriesModel; // this is a store created in `/ufb-mobile/create-ufb-context.tsx`
    learningPathsMenuModel?: LearningPathsMenuModel; // this is a store created in `/ufb-mobile/create-ufb-context.tsx`
}

export const HeaderContext = React.createContext<HeaderContextType | null>(null);

export interface HeaderProviderProps extends HeaderContextType {
    children: React.ReactNode;
}

export const HeaderContextProvider = ({children, ...context}: HeaderProviderProps) => {
    return <HeaderContext.Provider value={context}>{children}</HeaderContext.Provider>;
};
