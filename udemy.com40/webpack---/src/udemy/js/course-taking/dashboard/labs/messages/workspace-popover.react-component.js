import WorkspaceIcon from '@udemy/icons/dist/workspace.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {Popover} from '@udemy/react-popup-components';
import React from 'react';

import './messages.less';

const WorkspacePopover = (props) => {
    const popoverContent = (
        <div data-purpose="workspace-popover-content">
            <div>
                <span>
                    <b>{gettext('Workspaces available')} </b>
                    <ProBadge />
                </span>
            </div>
            <div>
                {gettext(
                    'Get hands-on during this lecture in a risk-free environment with no set-up required.',
                )}
            </div>
        </div>
    );

    return (
        <Popover
            data-purpose="workspace-popover"
            canToggleOnHover={true}
            placement="left"
            trigger={
                <WorkspaceIcon
                    data-purpose="workspace-icon"
                    styleName="workspace-icon"
                    label={false}
                />
            }
            {...props}
        >
            {popoverContent}
        </Popover>
    );
};

export default WorkspacePopover;
