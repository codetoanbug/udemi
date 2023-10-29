import {Loader, SuspenseUntilInView} from '@udemy/react-reveal-components';
import React from 'react';

import getConfigData from 'utils/get-config-data';

const UFBCourseContextMenu = React.lazy(() =>
    import(
        /* webpackChunkName: "course-landing-page-lazy-course-context-menu" */ './ufb-course-context-menu.react-component'
    ),
);

const UFBCourseContextMenuLazy = (props) => {
    if (!getConfigData().brand.has_organization) {
        return null;
    }

    return (
        <div className="clp-lead__element-row">
            <div className="clp-lead__element-item">
                <SuspenseUntilInView fallback={<Loader />}>
                    <UFBCourseContextMenu {...props} />
                </SuspenseUntilInView>
            </div>
        </div>
    );
};

export default UFBCourseContextMenuLazy;
