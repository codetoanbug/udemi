import {action, observable} from 'mobx';
import React from 'react';

import {I18nApi} from '@udemy/i18n';
import {FOLDERS_PAGE_SIZE} from '@udemy/learning-path';
import {Image} from '@udemy/react-core-components';
import {tokens} from '@udemy/styles';
import {udApi} from '@udemy/ud-api';
import {Organization, UDData, useUDData} from '@udemy/ud-data';

import {HeaderStore} from './header.mobx-store';
import {parseOrgCustomCategories} from './parse-org-custom-categories';
import {BrowseNavItem} from './types/browse-nav-item';

export const UFB_BROWSE_TYPE = {
    LEARNING_PATHS: 'learning_paths',
    LEARNING_PATH_FOLDER: 'learning_path_folder',
    CUSTOM_CATEGORIES: 'org_custom_categories',
    CUSTOM_CATEGORY: 'org_custom_category',
};

interface Folder {
    id: number;
    url: string;
    title: string;
}

export class LearningPathsMenuModel {
    @observable.ref children: BrowseNavItem[] = [];
    type: string;
    id: number;
    absolute_url: string;

    constructor(headerStore: HeaderStore, private readonly i18n: Pick<I18nApi, 'gettext'>) {
        this.type = UFB_BROWSE_TYPE.LEARNING_PATHS;
        this.id = 0;
        this.absolute_url = headerStore.urls.LEARNING_PATHS ?? '';
        this.i18n = i18n;
    }

    get title() {
        return <FaviconTitle>{this.i18n.gettext('Learning paths')}</FaviconTitle>;
    }

    async loadChildren() {
        const response = await udApi.get('/structured-data/tags/learning_path_folder/', {
            params: {page_size: FOLDERS_PAGE_SIZE},
        });
        this._setChildren(response.data.results);
    }

    @action _setChildren(folders: Folder[]) {
        this.children = folders.map((folder) => {
            return {
                type: UFB_BROWSE_TYPE.LEARNING_PATH_FOLDER,
                id: folder.id,
                absolute_url: folder.url,
                title: folder.title,
            };
        });
    }
}

export class CustomCategoriesModel {
    @observable.ref children: BrowseNavItem[] = [];
    type: string;
    id: number;
    absolute_url: string;

    constructor(
        headerStore: HeaderStore,
        private readonly i18n: Pick<I18nApi, 'gettext' | 'interpolate'>,
        private readonly udData: Pick<UDData, 'Config' | 'browse'>,
    ) {
        this.type = UFB_BROWSE_TYPE.CUSTOM_CATEGORIES;
        this.id = 0;
        this.absolute_url = headerStore.urls.BROWSE;
        this.i18n = i18n;
        this.udData = udData;
    }

    get title() {
        const title = this.udData.Config.features.organization.learning_path.enabled
            ? this.i18n.gettext('Categories')
            : this.i18n.interpolate(
                  this.i18n.gettext('%(companyName)s collection'),
                  {companyName: this.udData.Config.brand.title},
                  true,
              );
        return <FaviconTitle>{title}</FaviconTitle>;
    }

    @action loadChildren() {
        this.children = parseOrgCustomCategories(this.udData.browse);
    }
}

const FaviconTitle = ({children}: {children: React.ReactNode}) => {
    const {Config} = useUDData();
    const organization = Config.brand.organization as Organization;

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {organization.favicon_image > 0 && (
                <Image
                    src={organization.favicon_url}
                    alt=""
                    width={20}
                    height={20}
                    style={{marginRight: tokens['space-xs']}}
                />
            )}
            {children}
        </div>
    );
};
