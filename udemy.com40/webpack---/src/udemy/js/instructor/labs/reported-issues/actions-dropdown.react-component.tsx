import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {observer} from 'mobx-react';
import React from 'react';

import {ReportDetailAPIData} from '../types';
import {LabsReportedIssuesStore} from './labs-reported-issues.mobx-store';

interface ActionsDropdownProps {
    selectedReportDetail: ReportDetailAPIData;
    reportedIssueStore: LabsReportedIssuesStore;
}

export const ActionsDropdown = observer(
    ({selectedReportDetail, reportedIssueStore}: ActionsDropdownProps) => {
        const toggleRead = () => {
            reportedIssueStore.toggleRead(selectedReportDetail);
        };

        return (
            <Dropdown
                canToggleOnHover={true}
                detachFromTarget={true}
                placement="bottom-end"
                trigger={
                    <IconButton className="ud-link-neutral" udStyle="ghost">
                        <MoreIcon label={gettext('Reported issue actions')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem onClick={toggleRead}>
                        {selectedReportDetail.is_read
                            ? gettext('Mark as unread')
                            : gettext('Mark as read')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    },
);
