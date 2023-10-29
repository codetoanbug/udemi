import {observable} from 'mobx';

import AssetModel from '../asset.mobx-model';

export default class ArticleAssetModel extends AssetModel {
    @observable body = null;

    static requestFields = AssetModel.requestFields.concat(['body']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            body: {
                source: 'body',
                map: (body) => {
                    // This is pretty ugly but unfortunately this is what happens when you use an HTML
                    // editor without decent controls.
                    const el = document.createElement('div');
                    el.innerHTML = body;
                    // Open all links in new window.
                    Array.from(el.querySelectorAll('a')).forEach((a) => {
                        a.setAttribute('target', '_blank');
                    });
                    // Center images.
                    Array.from(el.querySelectorAll('img')).forEach((img) => {
                        img.setAttribute('align', 'middle');
                    });
                    return el.innerHTML;
                },
            },
        };
    }
}
