import {BlockList, Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {MAX_VISIBLE_CUES} from 'course-taking/course-content/constants';

import SearchResultItem from '../../dashboard/search/search-result-item.mobx-model';
import MatchingCue from './matching-cue.react-component';

import './matching-cues-list.less';

@observer
export default class MatchingCuesList extends Component {
    static propTypes = {
        searchResultItem: PropTypes.instanceOf(SearchResultItem).isRequired,
        textToHighlight: PropTypes.string.isRequired,
    };

    @observable isExpanded = false;

    @autobind
    @action
    expand() {
        this.isExpanded = true;
        setTimeout(() => {
            // in case of expand more, focus on the first expanded cure for a11y purpose
            document
                .getElementById(
                    `item-${this.props.searchResultItem.curriculumItem.id}-matching-cue-${MAX_VISIBLE_CUES}`,
                )
                ?.focus();
        }, 100);
    }

    renderShowMoreButton() {
        const {searchResultItem} = this.props;
        const numRemainingCues = searchResultItem.matchingCues.length - 5;

        return (
            <div styleName="show-more-cues">
                <Button
                    className="ud-link-neutral"
                    udStyle="ghost"
                    size="xsmall"
                    data-purpose="show-more-cues"
                    onClick={this.expand}
                >
                    {interpolate(
                        ngettext('+ %s more caption', '+ %s more captions', numRemainingCues),
                        [numRemainingCues],
                    )}
                </Button>
            </div>
        );
    }

    render() {
        const {searchResultItem, textToHighlight} = this.props;
        const {matchingCues, curriculumItem} = searchResultItem;

        // FIXME - this behaviour should be re-written to utilize a proper collapsible component
        // I am changing hardcoded number to constant and adding a workaround for a11y
        // See TE-2656 for more details
        const shouldCollapseRemainingCues =
            matchingCues.length > MAX_VISIBLE_CUES && !this.isExpanded;
        const displayedCues = this.isExpanded
            ? matchingCues
            : matchingCues.slice(0, MAX_VISIBLE_CUES);

        return (
            <div styleName="cues">
                <BlockList size="large">
                    {displayedCues.map((cue, i) => (
                        <MatchingCue
                            index={i}
                            key={`item-${curriculumItem.id}-matching-cue-${i}`}
                            cue={cue}
                            item={curriculumItem}
                            textToHighlight={textToHighlight}
                        />
                    ))}
                </BlockList>
                {shouldCollapseRemainingCues && this.renderShowMoreButton()}
            </div>
        );
    }
}
