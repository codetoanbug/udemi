import {withI18n} from '@udemy/i18n';
import {Checkbox} from '@udemy/react-form-components';
import {Tooltip} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    getAutoAssignActiveRuleForGroup,
    getDefaultAutoAssignAllUsersMessage,
    getDefaultAutoAssignMessage,
} from 'organization-common/assign-resource/constants';
import {RESOURCE_TYPES} from 'organization-common/constants';
import udLink from 'utils/ud-link';

import styles from './assign-resource-modal.less';
import AssignResourceStore from './assign-resource.mobx-store';

@observer
class InternalAutoAssignToggle extends Component {
    static propTypes = {
        assignStore: PropTypes.instanceOf(AssignResourceStore).isRequired,
        gettext: PropTypes.func.isRequired,
    };

    get tooltipContent() {
        const {gettext} = this.props;
        const {
            isCourseImported,
            isAllUsersSelected,
            isGroupAutoAssignRuleActive,
            resourceType,
        } = this.props.assignStore;

        if (isCourseImported && resourceType === RESOURCE_TYPES.COURSE) {
            return gettext('Imported courses cannot be auto-assigned.');
        }
        if (isAllUsersSelected && isGroupAutoAssignRuleActive) {
            return getAutoAssignActiveRuleForGroup(gettext)[resourceType];
        }
    }

    renderCheckboxAndLabel = () => {
        const {
            selectedGroups,
            resourceType,
            isAutoAssignEnabled,
            toggleAutoAssign,
            shouldDisableAutoAssignToggle,
            isAllUsersSelected,
        } = this.props.assignStore;

        const {gettext} = this.props;

        let numberGroups = 'single';
        if (selectedGroups.length > 1) {
            numberGroups = 'multi';
        }

        return (
            <Checkbox
                defaultChecked={isAutoAssignEnabled}
                onChange={toggleAutoAssign}
                disabled={shouldDisableAutoAssignToggle}
                data-purpose="auto-assign-toggle-checkbox"
            >
                {isAllUsersSelected
                    ? getDefaultAutoAssignAllUsersMessage(gettext)[resourceType]
                    : getDefaultAutoAssignMessage(gettext)[resourceType][numberGroups]}
            </Checkbox>
        );
    };

    render() {
        const {shouldDisableAutoAssignToggle} = this.props.assignStore;
        const {gettext} = this.props;

        return (
            <div data-purpose="auto-assign-toggle" className={styles['auto-assign-container']}>
                {shouldDisableAutoAssignToggle ? (
                    <Tooltip placement="bottom" trigger={this.renderCheckboxAndLabel()}>
                        {this.tooltipContent}
                    </Tooltip>
                ) : (
                    this.renderCheckboxAndLabel()
                )}
                <div className={styles['link-and-tooltip']}>
                    <a
                        href={udLink.toSupportLink('auto_assign_rule_info', true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ud-heading-sm"
                    >
                        {gettext('Learn more')}
                    </a>
                </div>
            </div>
        );
    }
}

const AutoAssignToggle = withI18n(InternalAutoAssignToggle);
export default AutoAssignToggle;
