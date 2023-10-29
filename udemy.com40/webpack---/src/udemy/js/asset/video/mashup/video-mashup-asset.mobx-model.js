import VideoAssetModel from '../video-asset.mobx-model';

export default class VideoMashupAssetModel extends VideoAssetModel {
    static requestFields = VideoAssetModel.requestFields
        .concat(['slides', 'length'])
        .filter((field) => field !== 'thumbnail_sprite');

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            slides: 'slides',
            length: 'length',
        };
    }
}
