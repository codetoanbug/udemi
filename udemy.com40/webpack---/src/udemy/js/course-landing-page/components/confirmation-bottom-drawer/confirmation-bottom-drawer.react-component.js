import {getUniqueId} from '@udemy/design-system-utils';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button} from '@udemy/react-core-components';
import {BottomDrawer} from '@udemy/react-dialog-components';
import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from 'utils/noop';

import ConfirmationBottomDrawerStore from './confirmation-bottom-drawer.mobx-store';
import {
    CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE,
    CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE,
    CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE,
} from './constants';

import './confirmation-bottom-drawer.less';

@observer
export default class ConfirmationBottomDrawer extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        initialOpenState: PropTypes.bool,
        onDrawerClose: PropTypes.func,
        onDrawerConfirmation: PropTypes.func,
        onDrawerInitialization: PropTypes.func,
        handleConfirmation: PropTypes.func.isRequired,
        messages: PropTypes.shape({
            title: PropTypes.shape({
                [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]: PropTypes.string.isRequired,
                [CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE]: PropTypes.string.isRequired,
                [CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE]: PropTypes.string.isRequired,
            }).isRequired,
            content: PropTypes.shape({
                [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]: PropTypes.string.isRequired,
            }).isRequired,
            controls: PropTypes.shape({
                cancelText: PropTypes.string.isRequired,
                closeText: PropTypes.string.isRequired,
                confirmText: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    };

    static defaultProps = {
        id: undefined,
        initialOpenState: false,
        onDrawerClose: noop,
        onDrawerConfirmation: noop,
        onDrawerInitialization: noop,
    };

    constructor(props) {
        super(props);
        this.id = this.props.id || getUniqueId('drawer');
        this.store = new ConfirmationBottomDrawerStore(props);
    }

    drawerContent() {
        const {messages} = this.props;
        let title;
        let content;
        let controls;

        switch (this.store.drawerState) {
            case CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE:
                title = messages.title[CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE];
                content = (
                    <div styleName="content">
                        <Loader size="xlarge" styleName="icon" color="neutral" />
                    </div>
                );
                controls = <div styleName="controls" />;
                break;
            case CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE:
                title = messages.title[CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE];
                content = (
                    <div styleName="content">
                        <SuccessIcon
                            size="xlarge"
                            styleName="icon"
                            color="positive"
                            label={false}
                        />
                    </div>
                );
                controls = (
                    <div styleName="controls controls-with-full-width-button">
                        <Button
                            udStyle="primary"
                            onClick={this.store.closeDrawer}
                            data-purpose="confirmation-drawer-close-button"
                        >
                            {messages.controls.closeText}
                        </Button>
                    </div>
                );
                break;
            case CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE:
            default:
                title = messages.title[CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE];
                content = (
                    <p
                        className="ud-text-md"
                        style={{justifyContent: 'flex-start'}}
                        styleName="content"
                        data-purpose="confirmation-drawer-content"
                    >
                        {messages.content[CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]}
                    </p>
                );
                controls = (
                    <div styleName="controls">
                        <Button
                            udStyle="secondary"
                            onClick={this.store.closeDrawer}
                            data-purpose="confirmation-drawer-cancel-button"
                        >
                            {messages.controls.cancelText}
                        </Button>
                        <Button
                            udStyle="primary"
                            onClick={this.store.confirmDrawer}
                            data-purpose="confirmation-drawer-confirm-button"
                        >
                            {messages.controls.confirmText}
                        </Button>
                    </div>
                );
                break;
        }

        const contentContainer = (
            <div
                styleName="confirmation-drawer-content-container"
                data-purpose="confirmation-drawer-content-container"
            >
                <div>{content}</div>
                {controls}
            </div>
        );

        return [title, contentContainer];
    }

    render() {
        const [title, content] = this.drawerContent();
        return (
            <BottomDrawer
                id={this.id}
                title={title}
                isOpen={this.store.drawerOpen}
                onClose={this.store.closeDrawer}
            >
                {content}
            </BottomDrawer>
        );
    }
}
