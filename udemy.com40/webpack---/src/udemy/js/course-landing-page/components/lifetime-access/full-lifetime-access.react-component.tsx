import React from 'react';

import './full-lifetime-access.less';

interface LifetimeAccessComponentContextProps {
    hasLifetimeAccess: boolean;
}

interface FullLifetimeAccessProps {
    lifetimeAccessContext?: LifetimeAccessComponentContextProps;
    style?: string;
}

export const FullLifetimeAccess = ({lifetimeAccessContext, style}: FullLifetimeAccessProps) => {
    if (!lifetimeAccessContext?.hasLifetimeAccess) {
        return null;
    }
    return (
        <div
            className="ud-text-xs dark-bg-text"
            styleName={style ?? 'full-lifetime-access'}
            data-purpose="full-lifetime-access"
        >
            {gettext('Full Lifetime Access')}
        </div>
    );
};
