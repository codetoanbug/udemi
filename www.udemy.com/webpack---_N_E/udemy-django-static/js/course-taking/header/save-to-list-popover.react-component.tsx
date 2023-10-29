import {observer} from 'mobx-react';
import React from 'react';

import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';

import {SaveToListPopoverStore} from './save-to-list-popover.mobx-store';

import styles from './save-to-list-popover.module.less';

interface SaveToListPopoverProps {
    popoverName: string;
    trigger: React.ReactElement;
    title: string;
    text: string;
}

@observer
export class SaveToListPopover extends React.Component<SaveToListPopoverProps> {
    constructor(props: SaveToListPopoverProps) {
        super(props);
        this.saveToListPopoverStore = new SaveToListPopoverStore(props.popoverName);
    }

    private saveToListPopoverStore: SaveToListPopoverStore;

    render() {
        return (
            <Popover
                detachFromTarget={true}
                isOpen={this.saveToListPopoverStore.isPopoverOpen}
                placement="bottom-start"
                trigger={this.props.trigger}
            >
                <div className={styles['save-to-list-popover-content']}>
                    <div data-purpose="title" className="ud-heading-sm">
                        {this.props.title}
                    </div>
                    <div data-purpose="text" className="ud-text-sm">
                        {this.props.text}
                    </div>
                    <Button
                        data-purpose="dismiss-button"
                        udStyle="secondary"
                        size="small"
                        onClick={this.saveToListPopoverStore.onDismissPopover}
                    >
                        {gettext('Dismiss')}
                    </Button>
                </div>
            </Popover>
        );
    }
}
