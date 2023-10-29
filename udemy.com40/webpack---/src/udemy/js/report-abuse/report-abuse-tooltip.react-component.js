import FlagIcon from '@udemy/icons/dist/flag.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import React from 'react';

export default function ReportAbuseTooltip(triggerProps) {
    return (
        <Tooltip
            placement="left"
            trigger={
                <Button udStyle="ghost" {...triggerProps}>
                    <FlagIcon label={gettext('Report abuse')} />
                </Button>
            }
        >
            {gettext('Report abuse')}
        </Tooltip>
    );
}
