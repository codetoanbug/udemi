import {inject} from 'mobx-react';
import React from 'react';

import './asset.less';

export default inject('store')(({store}) => {
    const message = store.asset ? store.asset.delayedAssetMessage : '';
    return (
        <div className="udlite-in-udheavy unsupported-asset" styleName="unsupported-asset">
            <div className="unsupported-asset-content">
                <p>{message}</p>
            </div>
        </div>
    );
});
