import {Popover, defaultRenderContent} from '@udemy/react-popup-components';
import {tokens, pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ControlBarDropdown, {
    ControlBarButton,
} from 'course-taking/curriculum/controls/control-bar-dropdown.react-component';
import {ShakaVideoPlayerStore} from 'shaka-video-player/shaka-video-player.mobx-store';

import styles from './video-control-bar-dropdown.less';

function renderTooltipContent({className, ...props}: any) {
    return defaultRenderContent({
        className: classNames(className, styles['tooltip-content']),
        ...props,
    });
}

function getButtonProps(props: any) {
    let tooltipProps = props.tooltipProps;
    if (tooltipProps) {
        tooltipProps = {...tooltipProps, renderContent: renderTooltipContent};
    }
    return {darkMode: true, size: 'small', ...props, tooltipProps};
}

export const VideoControlBarButton = (props: any) => (
    <ControlBarButton {...getButtonProps(props)} />
);

interface VideoControlBarDropdownProps {
    videoPlayerStore: ShakaVideoPlayerStore;
}
@inject('videoPlayerStore')
export class VideoControlBarDropdown extends React.Component<VideoControlBarDropdownProps> {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Button: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Menu: typeof ControlBarDropdown.Menu;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static MenuItem: typeof ControlBarDropdown.MenuItem;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Popover: typeof VideoControlBarDropdownPopover;

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

VideoControlBarDropdown.Button = (props: any) => (
    <ControlBarDropdown.Button {...getButtonProps(props)} />
);

VideoControlBarDropdown.Menu = ControlBarDropdown.Menu;

VideoControlBarDropdown.MenuItem = ControlBarDropdown.MenuItem;

interface VideoControlBarDropdownPopoverProps {
    $$udControlBarDropdown: any;
}

@inject('$$udControlBarDropdown')
class VideoControlBarDropdownPopover extends React.Component<VideoControlBarDropdownPopoverProps> {
    static propTypes = {
        $$udControlBarDropdown: PropTypes.object.isRequired,
    };

    getScrollContainers = (): HTMLElement[] => {
        return [document.getElementById(this.props.$$udControlBarDropdown.menuId) as HTMLElement];
    };

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
