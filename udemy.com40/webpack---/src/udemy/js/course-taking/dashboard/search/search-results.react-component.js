import {Accordion, Loader} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ScrollContainer from '../../course-content/scroll-container.react-component';
import Section from '../../course-content/section.react-component';
import './search-results.less';

@inject('searchStore')
@observer
export default class SearchResults extends Component {
    static propTypes = {
        searchStore: PropTypes.object.isRequired,
    };

    renderNoResultsMsg() {
        const {canSearchOnline, searchedTerm} = this.props.searchStore;

        return (
            <div styleName="zero-data" data-purpose="no-results-msg">
                <h2 className="ud-heading-xl">
                    {interpolate(
                        gettext('Sorry, no results for "%(searchedTerm)s"'),
                        {searchedTerm},
                        true,
                    )}
                </h2>
                <p>
                    {canSearchOnline
                        ? gettext('Your search did not match any captions, lectures or resources')
                        : gettext('Your search did not match any lectures or resources')}
                </p>
            </div>
        );
    }

    renderStartNewSearchMsg() {
        const {canSearchOnline} = this.props.searchStore;

        return (
            <div styleName="zero-data" data-purpose="start-new-search-msg">
                <h2 className="ud-heading-xl">{gettext('Start a new search')}</h2>
                <p>
                    {canSearchOnline
                        ? gettext('To find captions, lectures or resources')
                        : gettext('To find lectures or resources')}
                </p>
            </div>
        );
    }

    renderResultSummary() {
        const {searchedTerm, numResults} = this.props.searchStore;
        if (numResults === 0) {
            return searchedTerm ? this.renderNoResultsMsg() : this.renderStartNewSearchMsg();
        }

        return (
            <div styleName="summary" data-purpose="search-result-summary">
                {ninterpolate(
                    'Results for "%(searchedTerm)s" (%(numResults)s lecture)',
                    'Results for "%(searchedTerm)s" (%(numResults)s lectures)',
                    numResults,
                    {searchedTerm, numResults},
                )}
            </div>
        );
    }

    render() {
        /*
        Since there are several states, trying to lay them out at a glance in order of precedence -
        isSearching - show Loader, when search does fire
        numResults = 0
            a) has valid search query - show "no results returned" message
            b) no search query - show "start a new search" message
        numResults > 0
            - show summary of search results e.g. n results for "xyz"
            - which will also result in sections being displayed based on "matchingSections"
         */
        const {matchingSections, searchQuery, isSearching} = this.props.searchStore;

        if (isSearching) {
            return <Loader size="xxlarge" styleName="loader" block={true} />;
        }

        return (
            <div role="region" aria-label={gettext('Results')}>
                <div role="status">{this.renderResultSummary()}</div>
                <ScrollContainer
                    styleName="results-content-container"
                    data-purpose="results-container"
                >
                    <Accordion size="medium">
                        {matchingSections.map((searchResultSection, index) => (
                            <Section
                                section={searchResultSection}
                                index={index}
                                isSearchMode={true}
                                textToHighlight={searchQuery}
                                key={searchResultSection.section.id}
                            />
                        ))}
                    </Accordion>
                </ScrollContainer>
            </div>
        );
    }
}
