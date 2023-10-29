import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {SaveToListPopoverStore} from './save-to-list-popover.mobx-store';

import './save-to-list-popover.less';

interface SaveToListPopoverProps extends WithI18nProps {
    popoverName: string;
    trigger: React.ReactElement;
    title: string;
    text: string;
}

@observer
class InternalSaveToListPopover extends React.Component<SaveToListPopoverProps> {
    static propTypes = {
        gettext: PropTypes.func.isRequired,
    };

    constructor(props: SaveToListPopoverProps) {
        super(props);
        this.saveToListPopoverStore = new SaveToListPopoverStore(props.popoverName);
    }

    private saveToListPopoverStore: SaveToListPopoverStore;

    render() {
        const {gettext} = this.props;
        return (
            <Popover
                detachFromTarget={true}
                isOpen={this.saveToListPopoverStore.isPopoverOpen}
                placement="bottom-start"
                trigger={this.props.trigger}
            >
                <div styleName="save-to-list-popover-content">
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

export const SaveToListPopover = withI18n(InternalSaveToListPopover);
