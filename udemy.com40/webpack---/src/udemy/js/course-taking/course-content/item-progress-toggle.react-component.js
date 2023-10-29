import {Checkbox} from '@udemy/react-form-components';
import {Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {TRIAL_MESSAGES} from 'organization-trial/constants';
import LockedStateIcon from 'organization-trial/locked-state-icon/locked-state-icon.react-component';
import getConfigData from 'utils/get-config-data';

import {TRACKING_CATEGORIES, PROGRESS_ACTIONS} from '../constants';
import CurriculumItem from '../curriculum/curriculum-item.mobx-model';
import requires from '../registry/requires';
import {STATUS_TOGGLE_OPTIONS} from './constants';

import './curriculum-item-link.less';

const udConfig = getConfigData();

const stopPropagation = (event) => event.stopPropagation();

@requires('courseTakingStore')
@observer
export default class ItemProgressToggle extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        item: PropTypes.instanceOf(CurriculumItem).isRequired,
        isCurrentItem: PropTypes.bool.isRequired,
        isLockedForTrial: PropTypes.bool.isRequired,
    };

    @autobind
    handleProgressChange(ev) {
        this.props.item.toggleComplete();

        const action = ev.target.checked
            ? PROGRESS_ACTIONS.MARK_COMPLETE
            : PROGRESS_ACTIONS.MARK_RESET;
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.PROGRESS, action);
    }

    get progressToggle() {
        if (!this.props.item.canBeCompleted) {
            return STATUS_TOGGLE_OPTIONS.HIDDEN;
        } else if (!this.props.item.canUserToggleCompletion) {
            return STATUS_TOGGLE_OPTIONS.DISABLED;
        }
        return STATUS_TOGGLE_OPTIONS.ENABLED;
    }

    render() {
        if (this.props.isLockedForTrial) {
            return (
                <LockedStateIcon
                    detachFromTarget={true}
                    getScrollContainers={this.props.courseTakingStore.getSidebarScrollContainers}
                    placement="left"
                    tooltipMessage={TRIAL_MESSAGES.CONTENT_LOCKED}
                    theme={this.props.isCurrentItem ? 'neutral' : 'subdued'}
                />
            );
        }

        const isProgressToggleDisabled =
            [STATUS_TOGGLE_OPTIONS.HIDDEN, STATUS_TOGGLE_OPTIONS.DISABLED].includes(
                this.progressToggle,
            ) || udConfig.brand.has_organization;

        const progressScreenReaderText = this.props.item.isCompleted
            ? gettext('Lecture completed. Progress cannot be changed for this item.')
            : gettext('Lecture incomplete. Progress cannot be changed for this item.');

        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        const progressToggle = (
            <div onClick={stopPropagation}>
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <Checkbox
                    checked={this.props.item.isCompleted}
                    disabled={isProgressToggleDisabled}
                    onChange={this.handleProgressChange}
                    styleName="progress-toggle"
                    data-purpose="progress-toggle-button"
                >
                    <span className="ud-sr-only">{progressScreenReaderText}</span>
                </Checkbox>
            </div>
        );

        if (!isProgressToggleDisabled) {
            return progressToggle;
        }

        // a11yRole = none because the aria-describedby used in the tooltip is ignored when using NVDA virtual cursor.
        // The solution was to ignore this tooltip and use the text in the ud-sr-only text in the input checkbox
        return (
            <Tooltip
                detachFromTarget={true}
                getScrollContainers={this.props.courseTakingStore.getSidebarScrollContainers}
                placement="left"
                trigger={progressToggle}
                role="tooltip"
                a11yRole="none"
            >
                {gettext('Progress cannot be changed for this item')}
            </Tooltip>
        );
    }
}
