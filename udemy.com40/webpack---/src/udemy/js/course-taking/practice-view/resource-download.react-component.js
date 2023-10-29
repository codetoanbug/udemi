import PropTypes from 'prop-types';
import React from 'react';

import ResourceList from '../course-content/resource-list.react-component';

const ResourceDownload = ({practice, resources}) => {
    return (
        <div id="download">
            <h4 className="ud-heading-sm">{gettext('Download resource files')}</h4>
            <ResourceList item={practice} resources={resources} />
        </div>
    );
};

ResourceDownload.propTypes = {
    practice: PropTypes.object.isRequired,
    resources: PropTypes.array.isRequired,
};

export {ResourceDownload as default};
