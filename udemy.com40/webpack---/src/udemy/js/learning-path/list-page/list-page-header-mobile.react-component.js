import {Button} from '@udemy/react-core-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CREATE_PATH_BUTTON} from './constants';
import FolderContextMenu from './folders/folder-context-menu.react-component';
import LearningPathSearch from './learning-path-search.react-component';
import LearningPathSorting from './learning-path-sorting.react-component';
import ListPageStore from './list-page.mobx-store';
import ProListPageFilterBar from './pro-list-page-filter-bar.react-component';

import './list-page.less';

@inject('listPageStore')
@observer
export default class ListPageHeaderMobile extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        handleCreateCallback: PropTypes.func.isRequired,
    };

    renderDefaultFilters() {
        const {
            activeFolder,
            shouldDisplayCreatePathButton,
            shouldDisplaySorting,
            shouldDisplayFolderContextMenu,
        } = this.props.listPageStore;
        return (
            <>
                <LearningPathSearch />
                <div styleName="filter-bar">
                    {shouldDisplaySorting && <LearningPathSorting />}

                    {shouldDisplayCreatePathButton && (
                        <Button
                            data-purpose="create-learning-path"
                            styleName="create-path-button"
                            onClick={this.props.handleCreateCallback}
                        >
                            {CREATE_PATH_BUTTON.TEXT}
                        </Button>
                    )}

                    {shouldDisplayFolderContextMenu && <FolderContextMenu folder={activeFolder} />}
                </div>
            </>
        );
    }

    render() {
        const {listDescription, isChangingPage, isProTabActive} = this.props.listPageStore;

        return (
            <>
                {listDescription && (
                    <div styleName="list-description" data-purpose="list-description-mobile">
                        {listDescription}
                    </div>
                )}
                {!isChangingPage &&
                    (isProTabActive ? <ProListPageFilterBar /> : this.renderDefaultFilters())}
            </>
        );
    }
}
