import autobind from 'autobind-decorator';
import {reaction, action} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';

import MobilePathEditorsModal from 'learning-path/path-editors-modals/mobile-path-editors-modal.react-component';
import {showErrorToast, showSuccessToast, dismissAllToasts} from 'organization-common/toasts';

import {BASE_PATH, ERROR_DUPLICATE_TITLE} from '../constants';
import LearningPathStore from '../learning-path.mobx-store';
import {getFirstItemInViewport, updateScrollWithOffset} from '../utils';
import {AssessmentHighlight} from './assessment-highlight/assessment-highlight.react-component';
import {
    LEARNING_PATH_ERROR_MESSAGES,
    LEARNING_PATH_SUCCESS_MESSAGES,
    PATH_LAST_EDIT_POLLING_TIMEOUT,
} from './constants';
import CourseRecommendations from './course-recommendations/course-recommendations.react-component';
import SectionsList from './curriculum/sections-list.react-component';
import HistoryLogPanel from './history-log-panel.react-component';
import InfoPanelDesktop from './info-panel/info-panel-desktop.react-component';
import InfoPanelMobile from './info-panel/info-panel-mobile.react-component';
import {LearningPathHeaderV2} from './learning-path-header-v2.react-component';
import LearningPathHeader from './learning-path-header.react-component';

import './learning-path-view.less';

@inject('learningPathStore')
@withRouter
@observer
export default class LearningPathView extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.onAutoSaveErrorDisposer = reaction(
            () => this.props.learningPathStore.isSavingFailed,
            this._onAutoSaveError,
        );
        this.lastEditPollingDisposer = reaction(
            () => this.props.learningPathStore.isEditModeEnabled,
            this._toggleLastEditPolling,
        );
    }

    componentWillUnmount() {
        if (this.onAutoSaveErrorDisposer) {
            this.onAutoSaveErrorDisposer();
        }
        if (this.lastEditPollingDisposer) {
            this.lastEditPollingDisposer();
        }
        this.stopPollingPathLastEdit();
    }

    startPollingPathLastEdit() {
        // fetches the timestamp of the last edit on the path and periodically poll udpates
        this.props.learningPathStore.checkPathLastEdit();
        const pollPathLastEdit = () => {
            this.pathLastEditTimeout = setTimeout(async () => {
                await this.props.learningPathStore.checkPathLastEdit();
                pollPathLastEdit();
            }, PATH_LAST_EDIT_POLLING_TIMEOUT);
        };
        pollPathLastEdit();
    }

    stopPollingPathLastEdit() {
        clearTimeout(this.pathLastEditTimeout);
        this.pathLastEditTimeout = null;
    }

    actionCallbacks = {
        onDeleteError: this.onDeleteError,
        onDeleteSuccess: this.onDeleteSuccess,
        handleEditClick: this.handleEditClick,
        handleDoneEditingClick: this.handleDoneEditingClick,
    };

    scrollItem() {
        // eslint-disable-next-line react/no-find-dom-node
        this.node = ReactDOM.findDOMNode(this);
        const infoPanel = this.node.querySelector('#info-panel-desktop');
        const item = getFirstItemInViewport(infoPanel);

        if (item && (this.props.learningPathStore.isMobileViewportSize || infoPanel)) {
            const offset = item.getBoundingClientRect().top;
            // we need to wait for the edit mode to be rendered
            setTimeout(() => {
                updateScrollWithOffset(infoPanel, item.id, offset);
            });
        }
    }

    @autobind
    handleEditClick() {
        this.props.history.push(this.props.learningPathStore.learningPath.editUrl);
        this.scrollItem();
    }

    @autobind
    @action
    handleDoneEditingClick() {
        const {learningPathStore, history} = this.props;
        if (!learningPathStore.isSaving) {
            // We do not want the changedData or error notification to persist when Done is clicked
            learningPathStore.learningPath.formData = {};
            dismissAllToasts();
            history.push(learningPathStore.learningPath.resourceUrl);
        }
        this.scrollItem();
    }

    @autobind
    _onAutoSaveError() {
        const {learningPathStore} = this.props;
        if (learningPathStore.isSavingFailed) {
            // show notification on error
            const isDuplicateTitleError =
                learningPathStore.learningPath.apiError?.response?.data?.results[0] ===
                ERROR_DUPLICATE_TITLE;
            const errorMsg = isDuplicateTitleError
                ? LEARNING_PATH_ERROR_MESSAGES.PATH_TITLE_EXISTS
                : LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_SAVE_CHANGES;
            showErrorToast(errorMsg);
        }
    }

    @autobind
    _toggleLastEditPolling() {
        const {isEditModeEnabled} = this.props.learningPathStore;
        if (isEditModeEnabled) {
            this.startPollingPathLastEdit();
        } else {
            this.stopPollingPathLastEdit();
        }
    }

    @autobind
    onDeleteSuccess() {
        showSuccessToast(LEARNING_PATH_SUCCESS_MESSAGES.DELETED_PATH);
        this.stopPollingPathLastEdit();
        return this.props.history.push(BASE_PATH);
    }

    @autobind
    onDeleteError() {
        showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_DELETE);
    }

    render() {
        const {location, learningPathStore} = this.props;
        const {
            isMobilePathEditorsModalVisible,
            hideMobilePathEditorsModal,
            isCourseRecommendationsVisible,
            showNewLearningPathPageUIEnabled,
        } = learningPathStore;

        const {
            isHistoryLogVisible,
            isHistoryLogLoadingError,
            isProPath,
        } = learningPathStore.learningPath;

        const isCreatingPath = location.state && location.state.name === 'create';

        if (isCourseRecommendationsVisible) {
            return <CourseRecommendations />;
        }

        return (
            <>
                <Provider actionCallbacks={this.actionCallbacks}>
                    <>
                        {!showNewLearningPathPageUIEnabled ? (
                            <>
                                <InfoPanelMobile />
                                <div styleName="header-container">
                                    <LearningPathHeader isCreatingPath={isCreatingPath} />
                                </div>
                                <InfoPanelDesktop />
                            </>
                        ) : (
                            <>
                                <LearningPathHeaderV2 isCreatingPath={isCreatingPath} />
                                {isProPath &&
                                    learningPathStore.learningPath?.assessmentToHighlight && (
                                        <AssessmentHighlight />
                                    )}
                            </>
                        )}
                        <div styleName="section-list">
                            <SectionsList />
                        </div>
                    </>
                </Provider>
                <HistoryLogPanel
                    isHistoryLogVisible={isHistoryLogVisible}
                    isHistoryLogLoadingError={isHistoryLogLoadingError}
                />
                <MobilePathEditorsModal
                    isVisible={isMobilePathEditorsModalVisible}
                    onHide={hideMobilePathEditorsModal}
                    learningPath={learningPathStore.learningPath}
                />
            </>
        );
    }
}
