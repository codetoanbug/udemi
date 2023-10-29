import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import AvailabilityButton from './availability-button.react-component';
import BulkDownloadModal from './bulk-download-modal.react-component';
import CaptionsActionMenu from './captions-action-menu.react-component';
import LanguageSelector from './language-selector.react-component';
import UncaptionedLectureIndicator from './uncaptioned-lecture-indicator.react-component';

@inject('store')
@observer
export default class CaptionsHeader extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    renderActionButtons() {
        const {
            canUserEditCourse,
            currentLanguageLoaded,
            isBulkDownloadModalVisible,
            triggerBulkDownload,
            closeBulkDownloadModal,
        } = this.props.store;
        return (
            <>
                {/* TODO if the loader becomes used by other things, introduce a new isActionLoading computed */}
                {canUserEditCourse && currentLanguageLoaded && <AvailabilityButton />}
                <CaptionsActionMenu />
                <BulkDownloadModal
                    isOpen={isBulkDownloadModalVisible}
                    onClose={closeBulkDownloadModal}
                    handleExport={triggerBulkDownload}
                />
            </>
        );
    }

    render() {
        const {lecturesLoaded, currentLanguageLoaded, relativePath} = this.props.store;
        return (
            <SubHeader title={gettext('Captions')} actionButtons={this.renderActionButtons()}>
                {currentLanguageLoaded && <LanguageSelector relativePath={relativePath} />}
                {lecturesLoaded && <UncaptionedLectureIndicator />}
            </SubHeader>
        );
    }
}
