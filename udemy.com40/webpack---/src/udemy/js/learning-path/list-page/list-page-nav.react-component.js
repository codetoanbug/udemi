import {Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {matchPath, withRouter} from 'react-router-dom';

import {BASE_PATH} from '../constants';
import LearningPathStore from '../learning-path.mobx-store';
import {FOLDER_LIST_TYPE, LIST_PAGE_EMPTY_STATE_MESSAGES} from './constants';
import ListPageAddNewFolder from './list-page-add-new-folder.react-component';
import ListPageStore from './list-page.mobx-store';

import './list-page-nav.less';

@withRouter
@inject('learningPathStore', 'listPageStore')
@observer
export default class ListPageNav extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        location: PropTypes.object.isRequired,
    };

    isActive(path) {
        return !!matchPath(this.props.location.pathname, {path, exact: true});
    }

    renderNavItem({key, ...props}) {
        return (
            <li
                key={key}
                styleName={classNames('nav-item', {'nav-item-active': this.isActive(props.to)})}
            >
                <Link
                    className="ud-link-neutral"
                    styleName="nav-item-link"
                    onClick={this.props.listPageStore.resetPage}
                    {...props}
                />
            </li>
        );
    }

    renderMainNav() {
        return (
            <ul className="ud-unstyled-list" data-purpose="main-nav">
                {Object.entries(this.props.listPageStore.listTypes).map(([typeId, listType]) => {
                    return this.renderNavItem({
                        key: typeId,
                        to: `${BASE_PATH}${listType.path}`,
                        children: listType.title,
                    });
                })}
            </ul>
        );
    }

    renderFolderNav() {
        const {folders, isLoadingFolders} = this.props.listPageStore;

        let nav;
        if (!isLoadingFolders && folders.length === 0) {
            nav = (
                <div data-purpose="folder-nav">
                    <div styleName="nav-empty" data-purpose="empty-state-message">
                        {LIST_PAGE_EMPTY_STATE_MESSAGES.NO_FOLDERS}
                    </div>
                </div>
            );
        } else {
            nav = (
                <ul className="ud-unstyled-list" data-purpose="folder-nav">
                    {folders.map((folder) => {
                        return this.renderNavItem({
                            key: folder.id,
                            to: `${BASE_PATH}${FOLDER_LIST_TYPE}/${folder.id}`,
                            children: folder.title,
                        });
                    })}
                </ul>
            );
        }

        return (
            <>
                <div className="ud-heading-md" styleName="nav-title">
                    {gettext('Organized paths')}
                </div>
                {nav}
            </>
        );
    }

    render() {
        const {isAddFolderButtonAvailable, folders} = this.props.listPageStore;
        const {isStudent} = this.props.learningPathStore.learningPath;
        const shouldDisplayNav = !(isStudent && folders.length === 0);

        return (
            <div styleName="side-nav">
                {this.renderMainNav()}
                {shouldDisplayNav && this.renderFolderNav()}
                {isAddFolderButtonAvailable && (
                    <div styleName="nav-item nav-item-add-folder">
                        <ListPageAddNewFolder udStyle="link" styleName="add-folder-button" />
                    </div>
                )}
            </div>
        );
    }
}
