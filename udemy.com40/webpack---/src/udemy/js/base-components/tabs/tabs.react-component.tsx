import {Tabs as DSWTabs, Tab, TabsProps} from '@udemy/react-structure-components';
import {getRequestData, getDisplayName} from '@udemy/shared-utils';
import React from 'react';

export {Tab};

const Tabs = Object.assign(
    (props: TabsProps) => {
        const prioritizeTouch = getRequestData().isMobile;

        return <DSWTabs prioritizeTouch={prioritizeTouch} {...props} />;
    },
    {displayName: `WithLegacyCompatibility(${getDisplayName(DSWTabs)})`},
    // We must re-declare Tabs.Tab
    // eslint-disable-next-line @typescript-eslint/naming-convention
    {Tab},
);

// eslint-disable-next-line import/no-default-export
export default Tabs;
