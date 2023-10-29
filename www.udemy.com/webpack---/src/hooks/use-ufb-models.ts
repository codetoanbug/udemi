import React from 'react';

import {HeaderContext} from '../contexts/header-context';

export function useUfbModels() {
    const context = React.useContext(HeaderContext);
    if (!context?.customCategoriesModel) {
        throw new Error('customCategoriesModel is not set in HeaderContext');
    }
    if (!context?.learningPathsMenuModel) {
        throw new Error('learningPathsMenuModel is not set in HeaderContext');
    }

    return {
        customCategoriesModel: context.customCategoriesModel,
        learningPathsMenuModel: context.learningPathsMenuModel,
    };
}
