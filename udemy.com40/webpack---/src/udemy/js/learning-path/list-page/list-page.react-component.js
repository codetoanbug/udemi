import autobind from 'autobind-decorator';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {showErrorToast} from 'organization-common/toasts';

import {BASE_PATH} from '../constants';
import LearningPathStore from '../learning-path.mobx-store';
import {DEFAULT_LIST_TYPE, FOLDER_LIST_TYPE, SEARCH_PARAMS} from './constants';
import EmptyState from './empty-state.react-component';
import EditableFolder from './folders/editable-folder.react-component';
import FolderContextMenu from './folders/folder-context-menu.react-component';
import FolderEmptyState from './folders/folder-empty-state.react-component';
import LearningPathList from './learning-path-list.react-component';
import listEventTracker from './list-event-tracker';
import ListPageBannerInfo from './list-page-banner-info.react-component';
import ListPageFilterBar from './list-page-filter-bar.react-component';
import ListPageHeaderMobile from './list-page-header-mobile.react-component';
import ListPageHeader from './list-page-header.react-component';
import ListPageNavMobile from './list-page-nav-mobile.react-component';
import ListPageNav from './list-page-nav.react-component';
import ListPageStore from './list-page.mobx-store';
import ProListPageFilterBar from './pro-list-page-filter-bar.react-component';

import './list-page.less';

@inject('learningPathStore', 'listPageStore')
@withRouter
@observer
export default class ListPage extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.loadFolders();

        this.modeReactionDisposer = reaction(() => this.props.match.params.action, this._pickMode, {
            fireImmediately: true,
        });

        this.initializePageDisposer = reaction(
            () => [
                this.props.match.params.folderId,
                this.props.match.params.activeListType,
                this.props.location.search,
            ],
            this.initializeListPage,
            {fireImmediately: true},
        );
    }

    componentWillUnmount() {
        if (this.initializePageDisposer) {
            this.initializePageDisposer();
        }

        if (this.modeReactionDisposer) {
            this.modeReactionDisposer();
        }
    }

    @autobind
    async loadFolders() {
        try {
            await this.props.listPageStore.loadFolders();
        } catch (e) {
            showErrorToast(e.message);
        }
    }

    @autobind
    _pickMode() {
        this.props.listPageStore.setFolderEditMode(this.props.match.params.action === 'edit');
    }

    @autobind
    async initializeListPage() {
        const {listPageStore, match} = this.props;
        const {folderId} = match.params;
        const activeListType = match.params.activeListType || DEFAULT_LIST_TYPE;
        const searchParamsURL = new URLSearchParams(this.props.location.search);
        const params = {};

        if (activeListType) {
            listPageStore._setActiveListType(activeListType);
            // This will unset the active folder ID if none is present in the URL
            listPageStore._setActiveFolderId(parseInt(folderId, 10));
        }
        params.sort = searchParamsURL.get(SEARCH_PARAMS.SORT);
        params.page = searchParamsURL.get(SEARCH_PARAMS.PAGE) || 1;
        params.enrolled = searchParamsURL.get(SEARCH_PARAMS.ENROLLED);

        if (searchParamsURL.get(SEARCH_PARAMS.SEARCH)) {
            params.search = searchParamsURL.get(SEARCH_PARAMS.SEARCH);
        }

        try {
            listPageStore.updateSearchQuery(params);
            await listPageStore.loadPaths();
        } catch (e) {
            showErrorToast(e.message);
        }
    }

    @autobind
    async handleCreate() {
        try {
            await this.props.learningPathStore.createLearningPath();
            listEventTracker.clickedCreateCourse();
            return this.props.history.push({
                pathname: `${BASE_PATH}${this.props.learningPathStore.learningPath.id}/edit/`,
                state: {name: 'create'},
            });
        } catch (e) {
            // TODO - add error handling - noop for now
            return false;
        }
    }

    renderEmptyState() {
        const {activeListType} = this.props.match.params;

        if (activeListType === FOLDER_LIST_TYPE) {
            return <FolderEmptyState handleCreateCallback={this.handleCreate} />;
        }
        return <EmptyState handleCreateCallback={this.handleCreate} />;
    }

    renderFolderContextMenu() {
        const {activeFolder, shouldDisplayFolderContextMenu} = this.props.listPageStore;
        if (shouldDisplayFolderContextMenu) {
            return (
                <div styleName="folder-context-menu">
                    <FolderContextMenu folder={activeFolder} size="small" />
                </div>
            );
        }
    }

    renderViewPageHeader() {
        if (this.props.learningPathStore.isTabletViewportSize) {
            return <ListPageHeaderMobile handleCreateCallback={this.handleCreate} />;
        }

        const {shouldDisplayLearningPathBar, isProTabActive} = this.props.listPageStore;
        return (
            <>
                <ListPageHeader>{this.renderFolderContextMenu()}</ListPageHeader>
                {isProTabActive && <ProListPageFilterBar />}
                {!isProTabActive && shouldDisplayLearningPathBar && (
                    <ListPageFilterBar handleCreateCallback={this.handleCreate} />
                )}
            </>
        );
    }

    renderMain() {
        const {
            isFolderEditModeEnabled,
            activeFolder,
            isLoadingList,
            isShowingPaths,
        } = this.props.listPageStore;
        return (
            <div styleName="main-container">
                {isFolderEditModeEnabled && activeFolder && (
                    <div styleName="mb-sm folder-header-container">
                        <EditableFolder activeFolder={activeFolder} />
                        {this.renderFolderContextMenu()}
                    </div>
                )}
                {!isFolderEditModeEnabled && (
                    <div styleName="mb-sm">{this.renderViewPageHeader()}</div>
                )}
                {!isShowingPaths && !isLoadingList ? this.renderEmptyState() : <LearningPathList />}
            </div>
        );
    }

    render() {
        const {isTabletViewportSize} = this.props.learningPathStore;
        return (
            <>
                <ListPageBannerInfo />
                <div className="ud-container" styleName="container">
                    {isTabletViewportSize ? <ListPageNavMobile /> : <ListPageNav />}
                    {this.renderMain()}
                </div>
            </>
        );
    }
}
