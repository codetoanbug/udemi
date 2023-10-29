import {observer} from 'mobx-react';
import PropTypes from 'prop-types';

import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import udMe from 'utils/ud-me';

const UFBCourseContextMenu = observer(({course}) => {
    if (udMe.isLoading) {
        return null;
    }

    return createUFBContextMenu().getCLPContextMenu(course);
});

UFBCourseContextMenu.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        isPublished: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
};

export default UFBCourseContextMenu;
