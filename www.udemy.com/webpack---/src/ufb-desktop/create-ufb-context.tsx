import React from 'react';

import {I18nApi} from '@udemy/i18n';
import {UDData} from '@udemy/ud-data';

import {UfbContext} from '../types/ufb-context';
import {UFB_BROWSE_TYPE} from '../ufb-browse-types';
import {createUFBContext as createUFBMobileContext} from '../ufb-mobile/create-ufb-context';
import {BrowseButtons} from './browse/browse-buttons.react-component';
import {BrowseNavCustomCategories} from './browse/browse-nav-custom-categories.react-component';
import {BrowseNavLearningPathFolders} from './browse/browse-nav-learning-path-folders.react-component';
import {BrowseNavLevelOneItems} from './browse/browse-nav-level-one-items.react-component';
import {ManageDropdown} from './manage/manage-dropdown.react-component';
import {PackageAlert} from './manage/package-alert.react-component';
import {ProFeaturesPopover} from './user-profile/pro-features-popover.react-component';

export function createUFBContext(
    udData: Pick<UDData, 'Config' | 'browse'>,
    i18n: Pick<I18nApi, 'gettext' | 'interpolate'>,
): UfbContext {
    const mobileContext = createUFBMobileContext(udData, i18n);
    const isLearningPathEnabled = udData.Config.features?.organization?.learning_path?.enabled;
    return {
        mobileContext,
        urls: mobileContext.urls,
        badgeContext: mobileContext.badgeContext,
        logo: mobileContext.logo,
        browseNavDropdownText: isLearningPathEnabled ? i18n.gettext('Explore') : undefined,
        get browseButtons() {
            return <BrowseButtons />;
        },
        instructorDropdownText: isLearningPathEnabled
            ? i18n.gettext('Teach')
            : i18n.gettext('Instructor'),
        prospectiveInstructorDropdownText: isLearningPathEnabled
            ? i18n.gettext('Teach')
            : i18n.gettext('Create a course'),
        prospectiveInstructorHeadline: i18n.gettext(
            'Create or add custom courses to share within your organization.',
        ),
        prospectiveInstructorCTAText: i18n.gettext('Try it now'),
        get packageAlert() {
            return <PackageAlert />;
        },
        get manageDropdown() {
            return <ManageDropdown />;
        },
        get proFeaturesPopover() {
            return <ProFeaturesPopover />;
        },
        getBrowseNavLevelOneItems(itemFinders) {
            return <BrowseNavLevelOneItems itemFinders={itemFinders} />;
        },
        getBrowseNavLevelTwoItems(selectedLevelOneItem) {
            if (selectedLevelOneItem.type === UFB_BROWSE_TYPE.LEARNING_PATHS) {
                return <BrowseNavLearningPathFolders />;
            }
            if (selectedLevelOneItem.type === UFB_BROWSE_TYPE.CUSTOM_CATEGORIES) {
                return <BrowseNavCustomCategories />;
            }
            return null;
        },
    };
}
