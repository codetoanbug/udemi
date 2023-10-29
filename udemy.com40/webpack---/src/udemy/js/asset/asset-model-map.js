import ArticleAssetModel from './article/article-asset.mobx-model';
import {ASSET_TYPE} from './constants';
import DeprecatedAssetModel from './deprecated/deprecated-asset.mobx-model';
import EBookAssetModel from './ebook/ebook-asset.mobx-model';
import IFrameAssetModel from './iframe/iframe-asset.mobx-model';
import ImportContentAssetModel from './import-content/import-content-asset.mobx-model';
import PresentationAssetModel from './presentation/presentation-asset.mobx-model';
import VideoMashupAssetModel from './video/mashup/video-mashup-asset.mobx-model';
import VideoAssetModel from './video/video-asset.mobx-model';

export default {
    [ASSET_TYPE.ARTICLE]: ArticleAssetModel,
    [ASSET_TYPE.AUDIO]: VideoAssetModel,
    [ASSET_TYPE.EBOOK]: EBookAssetModel,
    [ASSET_TYPE.EXTERNAL_LINK]: DeprecatedAssetModel,
    [ASSET_TYPE.FILE]: DeprecatedAssetModel,
    [ASSET_TYPE.IFRAME]: IFrameAssetModel,
    [ASSET_TYPE.IMPORT_CONTENT]: ImportContentAssetModel,
    [ASSET_TYPE.PRESENTATION]: PresentationAssetModel,
    [ASSET_TYPE.VIDEO]: VideoAssetModel,
    [ASSET_TYPE.VIDEO_MASHUP]: VideoMashupAssetModel,
};
