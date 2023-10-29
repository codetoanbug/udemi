import {Link} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {BASE_PATH} from '../constants';
import {LIST_PAGE_EMPTY_STATE_MESSAGES, FOLDER_LIST_TYPE} from './constants';
import ListPageAddNewFolder from './list-page-add-new-folder.react-component';
import ListPageStore from './list-page.mobx-store';

import './list-page.less';

@inject('listPageStore')
@withRouter
@observer
export default class ListPageNavMobile extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
    };

    get title() {
        const {listTitle} = this.props.listPageStore;

        if (!listTitle) {
            return <Loader />;
        }

        return listTitle;
    }

    renderMainMenuItems() {
        const {listTypes, resetPage} = this.props.listPageStore;
        return (
            <Dropdown.Menu>
                {Object.entries(listTypes).map(([typeId, listType]) => (
                    <Dropdown.MenuItem
                        key={typeId}
                        className="ud-text-sm"
                        componentClass={Link}
                        to={`${BASE_PATH}${listType.path}`}
                        onClick={resetPage}
                    >
                        {listType.title}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        );
    }

    renderFolderMenuItems() {
        const {folders, isLoadingFolders, resetPage} = this.props.listPageStore;

        if (!isLoadingFolders && folders.length === 0) {
            return (
                <div
                    className="ud-text-sm"
                    styleName="mobile-nav-empty-menu-section"
                    data-purpose="empty-state-message"
                >
                    {LIST_PAGE_EMPTY_STATE_MESSAGES.NO_FOLDERS}
                </div>
            );
        }

        return (
            <Dropdown.Menu>
                {folders.map((folder) => (
                    <Dropdown.MenuItem
                        key={folder.id}
                        className="ud-text-sm"
                        componentClass={Link}
                        to={`${BASE_PATH}${FOLDER_LIST_TYPE}/${folder.id}`}
                        onClick={resetPage}
                    >
                        {folder.title}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        );
    }

    render() {
        const {isAddFolderButtonAvailable} = this.props.listPageStore;

        return (
            <Dropdown
                menuMaxHeight="none"
                menuWidth="fullWidth"
                placement="bottom-start"
                styleName="mobile-nav"
                trigger={
                    <Dropdown.Button styleName="mobile-nav-trigger">{this.title}</Dropdown.Button>
                }
            >
                {this.renderMainMenuItems()}
                <div className="ud-heading-sm" styleName="mobile-nav-menu-header">
                    {gettext('Organized paths')}
                </div>
                {this.renderFolderMenuItems()}
                {isAddFolderButtonAvailable && (
                    <Dropdown.Menu styleName="mobile-nav-add-folder-menu">
                        <Dropdown.MenuItem componentClass="div">
                            <ListPageAddNewFolder styleName="add-folder-button" />
                        </Dropdown.MenuItem>
                    </Dropdown.Menu>
                )}
            </Dropdown>
        );
    }
}
