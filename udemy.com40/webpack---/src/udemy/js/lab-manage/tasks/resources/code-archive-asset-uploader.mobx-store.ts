import AssetUploaderStore from 'course-manage-v2/asset-creator/asset-uploader.mobx-store';

export class CodeArchiveAssetUploaderStore extends AssetUploaderStore {
    // Overwrite allowed extensions to have zip only for code archives
    get allowedExtensionsDotted() {
        return ['.zip'];
    }
}
