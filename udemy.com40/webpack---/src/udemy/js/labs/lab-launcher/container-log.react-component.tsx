import {Panel} from '@udemy/react-structure-components';
import React from 'react';

import './container-log.less';

export interface ContainerLogProps {
    logs: Record<'previous' | 'current', string>;
}

export const ContainerLog = ({logs}: ContainerLogProps) => {
    const {previous, current} = logs;

    return (
        <div styleName="wrapper">
            {previous && (
                <>
                    <span styleName="label">{gettext('Previous run')}</span>
                    <Panel styleName="logs-panel">
                        <code>{previous}</code>
                    </Panel>
                </>
            )}
            {current && (
                <>
                    <span styleName="label">{gettext('Current run')}</span>
                    <Panel styleName="logs-panel">
                        <code>{current}</code>
                    </Panel>
                </>
            )}
        </div>
    );
};
