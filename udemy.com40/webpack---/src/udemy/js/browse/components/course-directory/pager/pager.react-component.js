import {Pagination} from '@udemy/react-navigation-components';
import {PaginatedContentIndicator} from '@udemy/shared-utils';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';

import {noop} from 'utils/noop';

@withRouter
export default class Pager extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onPageChange: PropTypes.func,
        pageCount: PropTypes.number.isRequired,
    };

    static defaultProps = {
        onPageChange: noop,
    };

    get activePage() {
        const searchParams = new URLSearchParams(this.props.location.search);
        return Number(searchParams.get('p')) || 1;
    }

    handlePageChange = (page) => {
        const searchParams = new URLSearchParams(this.props.location.search);
        searchParams.set('p', page);
        searchParams.sort();
        const search = searchParams.toString();
        this.props.history.push({...this.props.location, search});

        if (this.props.onPageChange) {
            this.props.onPageChange(page);
        }
    };

    render() {
        return (
            <>
                <PaginatedContentIndicator
                    currentPage={this.activePage}
                    totalPages={this.props.pageCount}
                    renderTags={(tags) => <Helmet>{tags}</Helmet>}
                />
                <Pagination
                    activePage={this.activePage}
                    pageCount={this.props.pageCount}
                    showLastPageAsText={true}
                    onPageChange={this.handlePageChange}
                />
            </>
        );
    }
}
