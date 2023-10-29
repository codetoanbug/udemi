import {ClientSideRender} from '@udemy/design-system-utils';
import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {BundleUnit, BundleUnitSkeleton} from '@udemy/react-discovery-units';
import {PropTypes} from 'prop-types';
import React from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {isomorphic} from 'utils/isomorphic-rendering';

const Bundle = isomorphic(({courseId, ...restOfProps}) => {
    return (
        <div className="component-margin">
            <ClientSideRender
                uiRegion={UI_REGION.RECOMMENDATIONS}
                placeholder={<BundleUnitSkeleton />}
            >
                <div>
                    <FunnelLogContextProvider context="clp-bundle" subcontext="bundle">
                        <BundleUnit
                            pageType="clp-bundle"
                            pageObjectId={courseId}
                            {...restOfProps}
                        />
                    </FunnelLogContextProvider>
                </div>
            </ClientSideRender>
        </div>
    );
});

Bundle.propTypes = {
    courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Bundle;
