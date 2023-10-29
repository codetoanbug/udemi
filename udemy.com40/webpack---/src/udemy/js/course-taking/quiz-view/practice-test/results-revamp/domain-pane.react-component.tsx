import {observer} from 'mobx-react';
import React from 'react';

import styles from './domain-pane.less';

export interface DomainPaneProps {
    data: string;
}
const DomainPaneComponent = ({data}: DomainPaneProps) => {
    return (
        <div data-purpose="domain-pane" className={styles['domain-pane']}>
            <div className={`${styles['domain-pane-header']} ud-heading-md`}>
                {gettext('Domain')}
            </div>
            <div className={'ud-text-md'}>{data}</div>
        </div>
    );
};

export const DomainPane = observer(DomainPaneComponent);
