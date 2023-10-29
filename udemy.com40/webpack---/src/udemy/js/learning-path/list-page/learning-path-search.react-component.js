import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import debounce from 'utils/debounce';
import getRequestData from 'utils/get-request-data';

import {LIST_PAGE_INFO_MESSAGES} from './constants';
import ListPageStore from './list-page.mobx-store';

import './list-page.less';

const {isTablet = false, isMobile = false} = getRequestData();

@inject('listPageStore')
@withRouter
@observer
export default class LearningPathSearch extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor() {
        super();
        this.debounce = debounce(this.run, 500);
    }

    componentWillUnmount() {
        this.debounce.cancel();
    }

    @autobind
    submit() {
        if (isMobile || isTablet) {
            document.activeElement.blur();
        }
        this.run();
    }

    @autobind
    run() {
        this.props.history.push({
            pathname: this.props.location.path,
            search: this.props.listPageStore.urlSearchString,
        });
    }

    @autobind
    clearInput() {
        this.props.listPageStore.setSearch('');
        this.debounce.cancel();
        this.run();
    }

    @autobind
    change(event) {
        const {value} = event.target;
        this.props.listPageStore.setSearch(value);
        this.debounce();
    }

    render() {
        const {SEARCH_PLACEHOLDER, SEARCH_SUBMIT, SEARCH_FORM_GROUP} = LIST_PAGE_INFO_MESSAGES;
        return (
            this.props.listPageStore.shouldDisplaySearch && (
                <FormGroup
                    label={SEARCH_FORM_GROUP}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="search-form-group-learning-path-list"
                    onSubmit={this.submit}
                >
                    <TextInputForm
                        data-purpose="learning-path-list-search"
                        showClearInputButton={!!this.props.listPageStore.search}
                        onClearInput={this.clearInput}
                        value={this.props.listPageStore.search || ''}
                        onChange={this.change}
                        placeholder={SEARCH_PLACEHOLDER}
                        submitButtonContent={<SearchIcon label={SEARCH_SUBMIT} />}
                    />
                </FormGroup>
            )
        );
    }
}
