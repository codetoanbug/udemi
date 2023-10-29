import React from 'react';

import './asset.less';

export default () => {
    return (
        <div className="udlite-in-udheavy unsupported-asset" styleName="unsupported-asset">
            <div className="unsupported-asset-content">
                <p>
                    {gettext(
                        "We've uploaded your file, and are processing it to ensure it works smoothly " +
                            "on Udemy. As soon as it's ready, we'll send you an email.",
                    )}
                </p>
            </div>
        </div>
    );
};
