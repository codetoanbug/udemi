import React from 'react';

import {I18nApi} from '@udemy/i18n';
import {UFBLogo} from '@udemy/react-brand-components';
import {Organization, UDData} from '@udemy/ud-data';

import {HeaderStore} from '../header.mobx-store';
import {NotificationBadgeContext} from '../types/notification-badge-context';
import {UfbContext} from '../types/ufb-context';
import {CustomCategoriesModel, LearningPathsMenuModel} from '../ufb-browse-types';
import {BrowseSection} from './mobile-nav/browse-section.react-component';
import {ManageAndTeachSection} from './mobile-nav/manage-and-teach-section.react-component';
import {SubNavs} from './mobile-nav/sub-navs.react-component';

export function createUFBContext(
    udData: Pick<UDData, 'Config' | 'browse'>,
    i18n: Pick<I18nApi, 'gettext' | 'interpolate'>,
): UfbContext {
    return {
        get browseSection() {
            return <BrowseSection />;
        },
        get manageAndTeachSection() {
            return <ManageAndTeachSection />;
        },
        get subNavs() {
            return <SubNavs />;
        },
        get badgeContext() {
            const context: NotificationBadgeContext = {unseenCredits: 0};
            if (!udData.Config.features.notifications) {
                context.unreadActivityNotifications = 0;
            }
            if (!udData.Config.brand.is_messaging_enabled) {
                context.unreadMessages = 0;
            }
            if (!udData.Config.features.shopping_cart) {
                context.cartBuyables = 0;
            }
            return context;
        },
        get logo() {
            return <UFBLogo />;
        },
        createStores(headerStore: HeaderStore) {
            return {
                learningPathsMenuModel: new LearningPathsMenuModel(headerStore, i18n),
                customCategoriesModel: new CustomCategoriesModel(headerStore, i18n, udData),
            };
        },
        urls() {
            const orgId = (udData.Config.brand.organization as Organization).id;
            return {
                ASSESSMENTS: '/skills-assessment/',
                BROWSE: '/organization/home/',
                LABS: '/labs/listing/',
                LEARNING_PATHS: '/learning-paths/',
                MY_LEARNING_PATHS: '/learning-paths/my/',
                PRO_ONBOARDING: '/organization/onboarding-pro/',
                PRO_PATHS: '/learning-paths/pro/',
                SEARCH: '/organization/search/',
                SEARCH_SUGGESTIONS: `/organizations/${orgId}/search-suggestions/`,
            };
        },
    };
}
