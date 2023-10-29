import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {BASE_PATH} from '../constants';
import {FOLDER_LIST_TYPE} from './constants';
import ListPageStore from './list-page.mobx-store';

import './list-page.less';

@inject('listPageStore')
@withRouter
@observer
export default class ListPageAddNewFolder extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        staticContext: PropTypes.object,
    };

    static defaultProps = {
        staticContext: undefined,
    };

    @autobind
    async handleCreateNewFolder() {
        const newFolderId = await this.props.listPageStore.createNewFolder();

        this.props.history.push({
            pathname: `${BASE_PATH}${FOLDER_LIST_TYPE}/${newFolderId}/edit`,
        });
    }

    render() {
        // match, history, location, and staticContext injected by withRouter.
        const {listPageStore, match, history, location, staticContext, ...props} = this.props;
        return (
            <Button
                udStyle="ghost"
                onClick={this.handleCreateNewFolder}
                data-purpose="add-folder-button"
                {...props}
            >
                <ExpandPlusIcon label={false} />
                {gettext('New folder')}
            </Button>
        );
    }
}
