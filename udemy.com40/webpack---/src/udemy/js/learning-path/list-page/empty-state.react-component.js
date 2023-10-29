import {Image, Button} from '@udemy/react-core-components';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import udLink from 'utils/ud-link';

import {
    CREATE_PATH_BUTTON,
    EMPTY_STATE_IMAGE_SIZE,
    LIST_PAGE_EMPTY_STATE_MESSAGES,
} from './constants';
import ListPageStore from './list-page.mobx-store';
import NoSearchResults from './no-search-results.react-component';

import './empty-state.less';

@inject('listPageStore')
export default class EmptyState extends React.Component {
    static propTypes = {
        handleCreateCallback: PropTypes.func.isRequired,
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
    };

    renderCreateButton() {
        return (
            <Button
                data-purpose="empty-state-create-learning-path"
                onClick={this.props.handleCreateCallback}
            >
                {CREATE_PATH_BUTTON.TEXT}
            </Button>
        );
    }

    get emptyState() {
        return (
            <div styleName="empty-message-panel" data-purpose="empty-list">
                <div styleName="empty-message-panel">
                    <Image
                        width={EMPTY_STATE_IMAGE_SIZE}
                        height={EMPTY_STATE_IMAGE_SIZE}
                        alt={gettext('Empty learning path list')}
                        src={udLink.toStorageStaticAsset('organization/icon/add-content-v2.svg')}
                    />
                    <div styleName="right-column">
                        <p>{LIST_PAGE_EMPTY_STATE_MESSAGES.NO_PATHS}</p>
                        <div styleName="mt-sm">{this.renderCreateButton()}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {isNoSearchResultMode} = this.props.listPageStore;

        return isNoSearchResultMode ? <NoSearchResults /> : this.emptyState;
    }
}
