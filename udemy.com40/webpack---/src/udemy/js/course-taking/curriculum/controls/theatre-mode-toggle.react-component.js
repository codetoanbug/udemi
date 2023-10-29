import {Keys} from '@udemy/design-system-utils';
import CollapseHorizontalIcon from '@udemy/icons/dist/collapse-horizontal.ud-icon';
import ExpandHorizontalIcon from '@udemy/icons/dist/expand-horizontal.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from '../../registry/requires';
import {ControlBarButton} from './control-bar-dropdown.react-component';

@inject('fullscreenStore')
@inject(({codingExerciseStore}) => ({codingExerciseStore}))
@requires('courseTakingStore')
@observer
export default class TheatreModeToggle extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
        componentClass: PropTypes.elementType,
        codingExerciseStore: PropTypes.object,
    };

    static defaultProps = {
        componentClass: ControlBarButton,
        codingExerciseStore: undefined,
    };

    @observable isTooltipOpen = false;

    @autobind
    @action
    onToggleTooltip(isOpen) {
        this.isTooltipOpen = isOpen;
    }

    @autobind
    @action
    onToggleSidebar() {
        this.props.courseTakingStore.toggleSidebar();
        this.isTooltipOpen = false;
    }

    @autobind
    onKeyDown(event) {
        if (event.keyCode === Keys.ESCAPE && !this.props.courseTakingStore.hasSidebarContent) {
            this.onToggleSidebar();
        }
    }

    render() {
        const {canShowSidebar, hasSidebarContent} = this.props.courseTakingStore;
        if (!canShowSidebar || this.props.fullscreenStore.isFullscreen) {
            return null;
        }

        const ButtonComponent = this.props.componentClass;
        const label = hasSidebarContent ? gettext('Expanded view') : gettext('Exit expanded view');
        const Icon = hasSidebarContent ? ExpandHorizontalIcon : CollapseHorizontalIcon;
        const store = this.props.codingExerciseStore;
        return (
            <ButtonComponent
                data-purpose="theatre-mode-toggle-button"
                tooltipProps={{
                    a11yRole: 'none',
                    children: label,
                    isOpen: this.isTooltipOpen,
                    onToggle: this.onToggleTooltip,
                    detachFromTarget: true,
                }}
                onClick={() => {
                    this.onToggleSidebar();
                    if (store) {
                        store.trackEvent('expand');
                    }
                }}
                onKeyDown={this.onKeyDown}
            >
                <Icon label={label} size="medium" />
            </ButtonComponent>
        );
    }
}
