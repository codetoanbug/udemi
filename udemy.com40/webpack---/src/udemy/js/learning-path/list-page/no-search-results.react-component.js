import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LIST_PAGE_EMPTY_STATE_MESSAGES} from './constants';
import ListPageStore from './list-page.mobx-store';

import './empty-state.less';

@inject('listPageStore')
export default class NoSearchResults extends React.Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
    };

    render() {
        const {NO_RESULTS_TITLE, NO_RESULTS_INFO} = LIST_PAGE_EMPTY_STATE_MESSAGES;
        const {search} = this.props.listPageStore;
        return (
            <div styleName="no-search-results" data-purpose="no-search-results">
                <div className="ud-heading-lg">{interpolate(NO_RESULTS_TITLE, [search])}</div>
                <div>{NO_RESULTS_INFO}</div>
            </div>
        );
    }
}
