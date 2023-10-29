import { PropTypes as MobxPropTypes, inject } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "next/router";

import { Accordion } from "@udemy/react-reveal-components";
import { getQueryParams } from "udemy-django-static/js/utils/query-params";

import FilterFormContext from "../filter-form-context";
import Filter from "./filter.react-component";
import "./filter.module.less";

@inject(({ inferredLanguage, isConsumerSubsSubscriber }) => ({
  inferredLanguage,
  isConsumerSubsSubscriber,
}))
@withRouter
export default class FilterForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    router: PropTypes.object.isRequired,
    aggregations: MobxPropTypes.arrayOrObservableArray,
    sort_options: MobxPropTypes.objectOrObservableObject,
    backoff_languages: MobxPropTypes.objectOrObservableObject,
    inferredLanguage: PropTypes.string,
    isConsumerSubsSubscriber: PropTypes.bool,
  };

  static defaultProps = {
    className: undefined,
    aggregations: [],
    sort_options: undefined,
    backoff_languages: undefined,
    inferredLanguage: undefined,
    isConsumerSubsSubscriber: false,
  };

  static contextType = FilterFormContext;

  componentDidMount() {
    this.ref.current.addEventListener("submit", this.handleSubmit);
  }

  componentWillUnmount() {
    this.ref.current?.removeEventListener("submit", this.handleSubmit);
  }

  ref = React.createRef();

  buildSearchParamsFromFormData = (form) => {
    const formData = new FormData(form);
    const searchParams = new URLSearchParams(Array.from(formData.entries()));
    const prevParams = getQueryParams();
    if (prevParams.q) {
      searchParams.append("q", prevParams.q);
    }
    if (prevParams.src) {
      searchParams.append("src", prevParams.src);
    }
    if (searchParams.get("bol") === this.props.inferredLanguage) {
      searchParams.delete("bol");
    }
    if (searchParams.has("lang")) {
      searchParams.delete("bol");
    }
    if (this.props.isConsumerSubsSubscriber && prevParams.subs_filter_type) {
      searchParams.append("subs_filter_type", prevParams.subs_filter_type);
    }
    searchParams.sort();
    const search = searchParams.toString();
    return search;
  };

  handleChange = (event) => {
    event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const search = this.buildSearchParamsFromFormData(event.target);
    this.props.router.push(
      { pathname: this.props.router.asPath.split("?")[0], query: search },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  render() {
    // since the order arr doesn't contain all keys inside aggregations, the compare fn expects the reverse of the human readable, descending order foramt.
    const { filterOrder = [], hiddenFilters = [] } = this.context;
    const order = [...filterOrder].reverse();
    const orderedAggregations = this.props.aggregations
      .filter(({ key }) => !hiddenFilters.includes(key))
      .slice()
      .sort((a, b) => order.indexOf(b.key) - order.indexOf(a.key));

    return (
      <form
        id="filter-form"
        onChange={this.handleChange}
        ref={this.ref}
        className={this.props.className}
      >
        <Accordion>
          {orderedAggregations.map((aggregation, i) => (
            <Accordion.Panel
              key={aggregation.key}
              title={aggregation.title}
              defaultExpanded={i < 2} // should open first two panels by default
            >
              <Filter aggregation={aggregation} />
            </Accordion.Panel>
          ))}
        </Accordion>
      </form>
    );
  }
}
