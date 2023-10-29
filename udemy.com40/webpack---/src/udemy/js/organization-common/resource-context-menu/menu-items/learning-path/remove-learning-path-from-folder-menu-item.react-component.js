import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React from 'react';

import {isUserOrganizationAdminOrOwner} from 'learning-path/utils';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext', 'actionCallbacks')
@observer
export default class RemoveLearningPathFromFolderMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        isActiveFolder: PropTypes.bool.isRequired,
        actionCallbacks: PropTypes.shape({
            handleRemovePathFromFolder: PropTypes.func.isRequired,
        }).isRequired,
    };

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Remove from folder');
        return this.props.actionCallbacks.handleRemovePathFromFolder();
    }

    render() {
        return (
            <ContextMenuItem
                icon={<CancelIcon label={false} />}
                title={gettext('Remove from folder')}
                onClick={this.handleClick}
            />
        );
    }
}

RemoveLearningPathFromFolderMenuItem.shouldRender = function (props) {
    return isUserOrganizationAdminOrOwner() && props.isActiveFolder;
};
