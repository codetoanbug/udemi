import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import wrappedAssetComponent from '../asset.react-component';
import ArticleAssetModel from './article-asset.mobx-model';

import './article-asset.less';

const ArticleAsset = inject('store')(
    observer(({store}) => {
        return (
            <div styleName="container">
                <RichTextViewer styleName="content" unsafeHTML={store.asset.body} />
            </div>
        );
    }),
);
ArticleAsset.wrappedComponent.propTypes = {
    store: PropTypes.object.isRequired,
};

export default wrappedAssetComponent('ArticleAsset', ArticleAsset, ArticleAssetModel);
