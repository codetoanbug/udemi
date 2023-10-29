import {Tracker} from '@udemy/event-tracking';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Avatar, Image, Link} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {showErrorToast, showSuccessToast} from 'organization-common/toasts';
import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {PRO_PATH_FAVICON, UDEMY_PRO_LEARNING_PATH, LEARNING_PATH} from '../constants';
import EditorsDetailsDesktop from '../learning-path-page/info-panel/editors-details-desktop.react-component';
import LearningPath from '../learning-path.mobx-model';
import {LearningPathSearchResultClickEvent} from '../tracking-events';
import {CARD_IMAGE_SIZE, LIST_PAGE_ERROR_MESSAGES, LIST_PAGE_SUCCESS_MESSAGES} from './constants';
import ListPageStore from './list-page.mobx-store';

import './learning-path-card.less';

const udConfig = getConfigData();

@withRouter
@inject('listPageStore', 'resourceContextMenu')
@observer
export default class LearningPathCard extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        history: PropTypes.object.isRequired,
        isMobileViewportSize: PropTypes.bool.isRequired,
        resourceContextMenu: PropTypes.object.isRequired,
    };

    actionCallbacks = {
        onDeleteSuccess: this.onDeleteSuccess,
        onDeleteError: this.onDeleteError,
        handleAddNewFolder: this.addNewFolderFromModal,
        handleRemovePathFromFolder: this.removePathFromFolder,
    };

    @autobind
    onDeleteSuccess() {
        showSuccessToast(LIST_PAGE_SUCCESS_MESSAGES.DELETED_PATH);
        return this.props.listPageStore.loadPaths();
    }

    @autobind
    onDeleteError() {
        showErrorToast(LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_DELETE);
    }

    @autobind
    async removePathFromFolder() {
        try {
            await this.props.listPageStore.activeFolder.removePath(this.props.learningPath);
            this.props.listPageStore.loadPaths();
            showSuccessToast(
                interpolate(
                    LIST_PAGE_SUCCESS_MESSAGES.REMOVED_FROM_FOLDER,
                    {pathTitle: this.props.learningPath.title},
                    true,
                ),
            );
        } catch (e) {
            showErrorToast(LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_REMOVE_FROM_FOLDER);
        }
    }

    @autobind
    addNewFolderFromModal(folder) {
        this.props.listPageStore.updateFoldersList(folder);
    }

    renderActionsContextMenu() {
        const isAddToFoldersVisible = this.props.listPageStore.folders.length !== 0;
        const isActiveFolder = !!this.props.listPageStore.activeFolder;

        const contextMenu = this.props.resourceContextMenu.getListPageLearningPathCardContextMenu(
            this.props.learningPath,
            isAddToFoldersVisible,
            isActiveFolder,
        );

        return (
            <Provider actionCallbacks={this.actionCallbacks}>
                <div>{contextMenu}</div>
            </Provider>
        );
    }

    renderPathDuration() {
        return (
            <Duration
                data-purpose="path-card-duration"
                numSeconds={this.props.learningPath.duration * 60}
            />
        );
    }

    renderEnrolledText() {
        return (
            <div styleName="enrolled-text" data-purpose="enrolled-text" className="ud-heading-sm">
                <TickIcon color="inherit" label={false} />
                {gettext('Enrolled')}
            </div>
        );
    }

    renderEditors() {
        const {owner, editors, isProPath} = this.props.learningPath;

        if (isProPath) {
            return (
                <span
                    styleName="editor-name"
                    data-purpose="feature-editor-name"
                    className="ud-text-sm"
                >
                    {gettext('Curated by Udemy Business Pro')}
                </span>
            );
        }
        return (
            <>
                <Avatar user={owner} srcKey="image_50x50" alt="NONE" size="small" />
                <span
                    styleName="editor-name"
                    data-purpose="feature-editor-name"
                    className="ud-text-sm"
                >
                    <EditorsDetailsDesktop owner={owner} editors={editors} isPopover={false} />
                </span>
            </>
        );
    }

    @autobind
    trackSearchEvent() {
        const {activeListType, search: searchQuery, currentPage} = this.props.listPageStore;
        const {id} = this.props.learningPath;

        if (searchQuery) {
            const searchEvent = new LearningPathSearchResultClickEvent({
                context: activeListType,
                search: searchQuery,
                currentPage,
                userRole: udMe.organization.role,
                pathId: id,
            });
            Tracker.publishEvent(searchEvent);
        }
    }

    render() {
        const {learningPath, isMobileViewportSize} = this.props;
        const org = udConfig.brand.organization;
        const faviconUrl = learningPath.isProPath ? PRO_PATH_FAVICON : org.favicon_url;
        const pathTypeHeader = learningPath.isProPath
            ? UDEMY_PRO_LEARNING_PATH.TEXT
            : LEARNING_PATH.TEXT;

        return (
            <div styleName="card-container">
                <Link
                    onClick={this.trackSearchEvent}
                    to={learningPath.resourceUrl}
                    data-purpose="path-card"
                    styleName="card"
                >
                    <div styleName="path-details-column">
                        <div styleName="path-detail-container" className="ud-text-xs">
                            <span styleName="item">{pathTypeHeader}</span>
                            <span styleName="item">{this.renderPathDuration()}</span>
                            {!isMobileViewportSize && (
                                <span styleName="item">
                                    {ninterpolate(
                                        '%s enrollment',
                                        '%s enrollments',
                                        learningPath.numberOfEnrollments,
                                    )}
                                </span>
                            )}
                        </div>
                        <div
                            data-purpose="path-title"
                            styleName="path-title"
                            className="ud-heading-lg"
                        >
                            {learningPath.title}
                        </div>
                        <div styleName="org-details-container">
                            {org.favicon_image > 0 || learningPath.isProPath ? (
                                <Image
                                    src={faviconUrl}
                                    alt={gettext('Organization logo')}
                                    width={CARD_IMAGE_SIZE}
                                    height={CARD_IMAGE_SIZE}
                                />
                            ) : null}
                            {this.renderEditors()}
                        </div>
                        {isMobileViewportSize &&
                            learningPath.isUserEnrolled &&
                            this.renderEnrolledText()}
                    </div>
                </Link>
                <div styleName="actions-column">
                    {this.renderActionsContextMenu()}
                    {!isMobileViewportSize &&
                        learningPath.isUserEnrolled &&
                        this.renderEnrolledText()}
                </div>
            </div>
        );
    }
}
