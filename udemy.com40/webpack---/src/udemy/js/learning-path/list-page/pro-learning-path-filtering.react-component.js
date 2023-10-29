import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {PRO_ENROLLED_FILTERING_OPTIONS, LIST_PAGE_INFO_MESSAGES} from './constants';
import ListPageStore from './list-page.mobx-store';

@inject('listPageStore')
@withRouter
@observer
export default class ProLearningPathFiltering extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    @autobind
    onFilterItemSelected(event) {
        const {value} = event.target;

        this.props.listPageStore.updateSearchQuery({enrolled: value});

        this.props.history.push({
            pathname: this.props.location.path,
            search: this.props.listPageStore.urlSearchString,
        });
    }

    get selectedValue() {
        return (
            this.props.listPageStore.selectedEnrolledFilter ||
            PRO_ENROLLED_FILTERING_OPTIONS.all.value
        );
    }

    render() {
        const {PRO_LEARNING_PATH_ENROLLED_FILTER} = LIST_PAGE_INFO_MESSAGES;

        return (
            <FormGroup
                label={PRO_LEARNING_PATH_ENROLLED_FILTER}
                labelProps={{className: 'ud-sr-only'}}
            >
                <Select
                    value={this.selectedValue}
                    data-purpose="pro-learning-path-filtering"
                    onChange={this.onFilterItemSelected}
                >
                    {Object.entries(PRO_ENROLLED_FILTERING_OPTIONS).map(([value, option]) => {
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
