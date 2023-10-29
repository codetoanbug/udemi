import {inject} from 'mobx-react';
import React from 'react';

import './asset.less';

export default inject('store')(({store}) => {
    // This template is used for all asset types, but only makes sense for video assets,
    // as they are the only type to have 'processing errors'.
    return (
        <div className="udlite-in-udheavy unsupported-asset" styleName="unsupported-asset">
            <div className="unsupported-asset-content">
                <p>{gettext('Your video failed to process for the following reasons:')}</p>
                <ul styleName="bulleted-list">
                    {(store.asset.processingErrors || []).map((error, id) => (
                        <li key={id}>
                            <span>{error.message}</span>
                            {error.help_link && ' '}
                            {error.help_link && (
                                <a
                                    href={error.help_link}
                                    className="ud-link-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {gettext('Get Help')}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});
