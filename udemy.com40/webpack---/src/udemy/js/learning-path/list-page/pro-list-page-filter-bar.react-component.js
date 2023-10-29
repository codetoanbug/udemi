import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import LearningPathSearch from './learning-path-search.react-component';
import LearningPathSorting from './learning-path-sorting.react-component';
import ListPageStore from './list-page.mobx-store';
import ProLearningPathFiltering from './pro-learning-path-filtering.react-component';
import './list-page.less';

@inject('listPageStore')
@observer
export default class ProListPageFilterBar extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
    };

    render() {
        const {shouldDisplayProListPageFilterBar} = this.props.listPageStore;

        if (!shouldDisplayProListPageFilterBar) {
            return null;
        }
        return (
            <div styleName="mt-sm pro-tab-filter-container">
                <LearningPathSearch />
                <div styleName="filter-bar">
                    <ProLearningPathFiltering />
                    <LearningPathSorting />
                </div>
            </div>
        );
    }
}
