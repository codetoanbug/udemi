import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import SearchMyCoursesField from './search-my-courses-field.react-component';
import './search-my-courses.less';

@observer
export default class SearchMyCourses extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onReset: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    render() {
        const {store, onReset, onSubmit} = this.props;
        return (
            <div styleName="row">
                <div styleName="left">
                    {store.searchQuery && !store.isLoading && (
                        <div
                            className="ud-text-xl"
                            styleName="search-results-count"
                            {...safelySetInnerHTML({
                                descriptionOfCaller:
                                    'search-my-courses:num-search-results-for-query',
                                html: ninterpolate(
                                    '%(count)s search result for: <strong>%(query)s</strong>',
                                    '%(count)s search results for: <strong>%(query)s</strong>',
                                    store.count,
                                    {
                                        count: store.count,
                                        query: escapeHtml(store.searchQuery),
                                    },
                                ),
                            })}
                        />
                    )}
                </div>
                <div styleName="right">
                    <div styleName="search-field">
                        <SearchMyCoursesField onSubmit={onSubmit} />
                    </div>
                    {store.searchQuery && !store.isLoading && (
                        <Button
                            className="ud-link-underline"
                            udStyle="ghost"
                            size="medium"
                            onClick={onReset}
                        >
                            {gettext('Return to all courses')}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
