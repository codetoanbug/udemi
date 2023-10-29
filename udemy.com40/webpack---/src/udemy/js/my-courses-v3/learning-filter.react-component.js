import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CategoryFilter from './filter-dropdowns/category-filter.react-component';
import InstructorFilter from './filter-dropdowns/instructor-filter.react-component';
import ProgressFilter from './filter-dropdowns/progress-filter.react-component';
import FilterRefineModal from './filter-refine-modal.react-component';
import SearchMyCoursesField from './search-my-courses-field.react-component';
import SearchMyCourses from './search-my-courses.react-component';
import {updateSearchParams} from './search-params';
import './learning-filter.less';

@observer
export default class LearningFilter extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    @autobind
    selectSortFilter(sortKey) {
        this.setNewParam('sort', sortKey);
    }

    @autobind
    setNewParam(key, value) {
        updateSearchParams({[key]: value, p: '1'}, this.props.history);
    }

    @autobind
    setSearchQuery(searchQuery) {
        updateSearchParams({p: '1', q: searchQuery}, this.props.history);
    }

    @autobind
    reset() {
        this.props.history.push({pathname: this.props.location.pathname});
    }

    render() {
        const {store} = this.props;
        if (store.searchQuery) {
            return (
                <SearchMyCourses
                    store={store}
                    onReset={this.reset}
                    onSubmit={this.setSearchQuery}
                />
            );
        }

        return (
            <div styleName="row learning-filter">
                <div styleName="search-field">
                    <SearchMyCoursesField onSubmit={this.setSearchQuery} />
                </div>
                <div styleName="row dropdowns">
                    <div>
                        <div className="ud-text-sm" styleName="label">
                            {gettext('Sort by')}
                        </div>
                        <Dropdown
                            placement="bottom-start"
                            trigger={
                                <Dropdown.Button size="medium" styleName="sort-btn">
                                    {store.sortTitle}
                                </Dropdown.Button>
                            }
                        >
                            <Dropdown.Menu>
                                {store.sortOptions.map(({value, title}) => (
                                    <Dropdown.MenuItem
                                        key={value}
                                        onClick={() => this.selectSortFilter(value)}
                                        data-purpose={`sort-item-${value}`}
                                    >
                                        {title}
                                    </Dropdown.MenuItem>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div styleName="dropdowns-large-screen">
                        <div className="ud-text-sm" styleName="label">
                            {gettext('Filter by')}
                        </div>
                        <div styleName="row">
                            <CategoryFilter store={store} setNewParam={this.setNewParam} />
                            <ProgressFilter store={store} setNewParam={this.setNewParam} />
                            <InstructorFilter store={store} setNewParam={this.setNewParam} />
                            <Button
                                size="medium"
                                className="ud-link-neutral"
                                udStyle="ghost"
                                disabled={store.isClean}
                                onClick={this.reset}
                            >
                                {gettext('Reset')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div styleName="dropdowns-small-screen">
                    <ModalTrigger
                        trigger={
                            <Button
                                size="medium"
                                udStyle="secondary"
                                styleName="refine-btn"
                                data-purpose="show-refine-modal"
                            >
                                {gettext('Refine')}
                            </Button>
                        }
                        renderModal={(props) => (
                            <FilterRefineModal
                                {...props}
                                store={store}
                                reset={this.reset}
                                history={this.props.history}
                                location={this.props.location}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}
