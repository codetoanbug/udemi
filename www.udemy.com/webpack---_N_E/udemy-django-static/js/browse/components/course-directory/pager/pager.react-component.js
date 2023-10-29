import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "next/router";
import Head from "next/head";

import { Pagination } from "@udemy/react-navigation-components";
import { PaginatedContentIndicator } from "@udemy/shared-utils";
import { noop } from "udemy-django-static/js/utils/noop";

@withRouter
export default class Pager extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    onPageChange: PropTypes.func,
    pageCount: PropTypes.number.isRequired,
  };

  static defaultProps = {
    onPageChange: noop,
  };

  get activePage() {
    const searchParams = new URLSearchParams(window.location.search);
    return Number(searchParams.get("p")) || 1;
  }

  handlePageChange = (page) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("p", page);
    searchParams.sort();
    const search = searchParams.toString();
    this.props.router.push(
      { pathname: this.props.router.asPath.split("?")[0], query: search },
      undefined,
      { scroll: false, shallow: true }
    );

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
          renderTags={(tags) => <Head>{tags}</Head>}
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
