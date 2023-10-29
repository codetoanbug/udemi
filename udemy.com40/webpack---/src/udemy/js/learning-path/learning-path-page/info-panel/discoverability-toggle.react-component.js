import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import {BasicPopover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import LearningPathStore from '../../learning-path.mobx-store';
import {
    PRIVATE_VISIBILITY_OPTION,
    PUBLIC_VISIBILITY_OPTION,
    VISIBILITY_OPTIONS,
    PUBLIC_VISIBILITY_TOOLTIP,
    PRIVATE_VISIBILITY_TOOLTIP,
} from '../constants';
import pageEventTracker from '../page-event-tracker';
import DiscoverabilityModal from './discoverability-modal.react-component';

import './info-panel.less';

@inject('learningPathStore')
@observer
export default class DiscoverabilityToggle extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    @observable selectedMode = this.currentlySelected;
    @observable isDiscoverabilityModalVisible = false;

    get currentlySelected() {
        return this.props.learningPathStore.learningPath.isPublic
            ? PUBLIC_VISIBILITY_OPTION
            : PRIVATE_VISIBILITY_OPTION;
    }

    @autobind
    @action
    showDiscoverabilityModal() {
        this.isDiscoverabilityModalVisible = true;
    }

    @autobind
    @action
    hideDiscoverabilityModal() {
        this.isDiscoverabilityModalVisible = false;
    }

    @autobind
    @action
    onPublishModeSelect(mode) {
        // if the path visibility matches the mode that the user selected
        // (eg. path is Public and user selects Public), we don't open the modal
        if (mode === this.currentlySelected) {
            return;
        }
        // triggers the discoverability modal and we pass the mode that was selected.
        // As we don't want to change the label yet, we are not using currentlySelected
        this.selectedMode = mode;
        this.showDiscoverabilityModal();
    }

    @autobind
    onConfirmPublishMode() {
        // from the modal, when the user select the mode, we change the publish mode
        this.props.learningPathStore.onPublishModeSelect(this.selectedMode);
        this.hideDiscoverabilityModal();
        pageEventTracker.discoverabilityOptionSelected(this.selectedMode);
    }

    render() {
        const {
            isMobileViewportSize,
            learningPath,
            isEditModeEnabled,
        } = this.props.learningPathStore;

        if (!isEditModeEnabled) {
            return (
                <span
                    styleName={classNames(
                        'discoverability',
                        isMobileViewportSize ? 'discoverability-mobile' : 'discoverability-desktop',
                    )}
                    data-purpose="path-visibility"
                >
                    {VISIBILITY_OPTIONS[this.currentlySelected].TEXT}
                </span>
            );
        }

        return (
            <>
                <Dropdown
                    placement={isMobileViewportSize ? 'bottom-end' : 'bottom-start'}
                    styleName="discoverability-dropdown"
                    trigger={
                        <Dropdown.Button
                            data-purpose="discoverability-dropdown"
                            size={isMobileViewportSize ? 'small' : 'xsmall'}
                            udStyle="ghost"
                        >
                            {learningPath.formData.isPublic
                                ? VISIBILITY_OPTIONS.public.TEXT
                                : VISIBILITY_OPTIONS.private.TEXT}
                        </Dropdown.Button>
                    }
                >
                    <Dropdown.Menu>
                        {Object.keys(VISIBILITY_OPTIONS).map((key) => {
                            return (
                                <Dropdown.MenuItem
                                    key={key}
                                    onClick={() => this.onPublishModeSelect(key)}
                                    data-purpose={`make-${key}`}
                                >
                                    {VISIBILITY_OPTIONS[key].TEXT}
                                </Dropdown.MenuItem>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <BasicPopover
                    styleName="popover-icon"
                    trigger={<InfoIcon label={gettext('Get info')} size="small" />}
                    placement={isMobileViewportSize ? 'bottom-end' : 'bottom'}
                    canToggleOnHover={true}
                    a11yRole="description"
                >
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'info-panel:discoverability',
                            html: interpolate(
                                this.selectedMode === PUBLIC_VISIBILITY_OPTION
                                    ? PUBLIC_VISIBILITY_TOOLTIP.TEXT
                                    : PRIVATE_VISIBILITY_TOOLTIP.TEXT,
                            ),
                        })}
                    />
                </BasicPopover>

                <DiscoverabilityModal
                    isVisible={this.isDiscoverabilityModalVisible}
                    onHide={this.hideDiscoverabilityModal}
                    selectedMode={this.selectedMode}
                    onConfirmPublishMode={this.onConfirmPublishMode}
                    numberOfEnrollments={learningPath.numberOfEnrollments}
                    folderTitles={learningPath.folderTitles}
                />
            </>
        );
    }
}
