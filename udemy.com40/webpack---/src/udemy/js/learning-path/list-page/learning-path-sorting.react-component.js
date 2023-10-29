import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {SORT_OPTIONS, LIST_PAGE_INFO_MESSAGES} from './constants';
import ListPageStore from './list-page.mobx-store';

@inject('listPageStore')
@withRouter
@observer
export default class LearningPathSorting extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    @autobind
    onSortItemSelected(event) {
        const {value} = event.target;

        this.props.listPageStore.updateSearchQuery({sort: value});

        this.props.history.push({
            pathname: this.props.location.path,
            search: this.props.listPageStore.urlSearchString,
        });
    }

    get selectedValue() {
        return this.props.listPageStore.selectedSort || SORT_OPTIONS.newest.value;
    }

    render() {
        const {isSortingDisabled} = this.props.listPageStore;
        const {LEARNING_PATH_OPTIONS} = LIST_PAGE_INFO_MESSAGES;

        return (
            <FormGroup label={LEARNING_PATH_OPTIONS} labelProps={{className: 'ud-sr-only'}}>
                <Select
                    disabled={isSortingDisabled}
                    value={this.selectedValue}
                    data-purpose="sort-learning-path-list"
                    onChange={this.onSortItemSelected}
                >
                    {Object.entries(SORT_OPTIONS).map(([value, option]) => {
                        return (
                            <option key={value} data-purpose={`sort-item-${value}`} value={value}>
                                {option.title}
                            </option>
                        );
                    })}
                </Select>
            </FormGroup>
        );
    }
}
