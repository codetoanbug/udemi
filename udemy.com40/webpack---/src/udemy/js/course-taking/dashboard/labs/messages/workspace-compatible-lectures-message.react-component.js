import {LocalizedHtml} from '@udemy/i18n';
import WorkspaceIcon from '@udemy/icons/dist/workspace.ud-icon';
import {Popover} from '@udemy/react-popup-components';
import React from 'react';

import './messages.less';

const WorkspaceCompatibleLecturesMessage = () => {
    const workspaceIcon = <WorkspaceIcon styleName="workspace-icon" label={false} />;

    const popoverTrigger = (
        <span styleName="compatible-lectures">
            <LocalizedHtml
                html={gettext(
                    '<span class="workspaceIcon">%(icon)s</span><span>compatible lectures</span>',
                )}
                interpolate={{workspaceIcon}}
            />
        </span>
    );

    const compatibleLecturesPopover = (
        <Popover
            styleName="compatible-lectures-popover"
            placement="bottom"
            trigger={popoverTrigger}
            canToggleOnHover={true}
        >
            {gettext(
                'Compatible lectures within this course are highlighted to help you find hands-on opportunities.',
            )}
        </Popover>
    );

    return (
        <div data-purpose="workspace-compatible-lectures-message">
            <LocalizedHtml
                html={gettext(
                    'Get hands-on during <span class="popover">Compatible lectures within this course are highlighted to help you find hands-on opportunities.</span> of this course in a risk-free environment with no set-up required.',
                )}
                interpolate={{popover: compatibleLecturesPopover}}
            />
        </div>
    );
};

export default WorkspaceCompatibleLecturesMessage;
