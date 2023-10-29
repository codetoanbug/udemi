import {Popover, defaultRenderContent} from '@udemy/react-popup-components';
import {tokens, pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ControlBarDropdown, {
    ControlBarButton,
} from 'course-taking/curriculum/controls/control-bar-dropdown.react-component';

import styles from './video-control-bar-dropdown.less';

function renderTooltipContent({className, ...props}, ...args) {
    props.className = classNames(className, styles['tooltip-content']);
    return defaultRenderContent(props, ...args);
}

function getButtonProps(props) {
    let tooltipProps = props.tooltipProps;
    if (tooltipProps) {
        tooltipProps = {...tooltipProps, renderContent: renderTooltipContent};
    }
    return {darkMode: true, size: 'small', ...props, tooltipProps};
}

export const VideoControlBarButton = (props) => <ControlBarButton {...getButtonProps(props)} />;

@inject('videoPlayerStore')
export default class VideoControlBarDropdown extends React.Component {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
    };

    render() {
        const {videoPlayerStore, ...props} = this.props;
        return (
            <ControlBarDropdown
                darkMode={true}
                menuMaxHeight={`${pxToRem(0.7 * videoPlayerStore.playerHeight)}rem`}
                menuOffset={tokens['space-lg']}
                {...props}
            />
        );
    }
}

VideoControlBarDropdown.Button = (props) => (
    <ControlBarDropdown.Button {...getButtonProps(props)} />
);
VideoControlBarDropdown.Menu = ControlBarDropdown.Menu;
VideoControlBarDropdown.MenuItem = ControlBarDropdown.MenuItem;

@inject('$$udControlBarDropdown')
class VideoControlBarDropdownPopover extends React.Component {
    static propTypes = {
        $$udControlBarDropdown: PropTypes.object.isRequired,
    };

    @autobind
    getScrollContainers() {
        return [document.getElementById(this.props.$$udControlBarDropdown.menuId)];
    }

    render() {
        const {$$udControlBarDropdown, ...props} = this.props;
        return (
            <Popover
                detachFromTarget={true}
                shouldCloseOtherPoppers={false}
                getScrollContainers={this.getScrollContainers}
                {...props}
            />
        );
    }
}

VideoControlBarDropdown.Popover = VideoControlBarDropdownPopover;
