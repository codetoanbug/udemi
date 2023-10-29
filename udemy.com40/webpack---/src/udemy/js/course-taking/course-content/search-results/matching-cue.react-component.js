import {BlockList} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Highlighter from 'react-highlight-words';

import CurriculumItem from '../../curriculum/curriculum-item.mobx-model';
import ItemLink from '../../curriculum/item-link.react-component';
import {SEARCH_ACTIONS} from '../../dashboard/search/constants';

import './matching-cues-list.less';

@inject('searchStore')
@observer
export default class MatchingCue extends Component {
    static propTypes = {
        item: PropTypes.instanceOf(CurriculumItem).isRequired,
        cue: PropTypes.object.isRequired,
        textToHighlight: PropTypes.string.isRequired,
        searchStore: PropTypes.shape({
            trackVisit: PropTypes.func,
        }).isRequired,
        index: PropTypes.number.isRequired,
    };

    get cueStartTime() {
        const {cue} = this.props;
        // to display a timestamp in the mm:ss format e.g. 04:15
        return new Date(cue.start_time / 1000)
            .toISOString()
            .slice(11, 19)
            .replace(/^0(?:0:)?0?/, '');
    }

    @computed
    get videoPositionSeconds() {
        const {cue} = this.props;
        return Math.ceil(cue.start_time / 1000000);
    }

    @autobind
    trackCueClick() {
        this.props.searchStore.trackVisit(SEARCH_ACTIONS.VISIT_CUE);
    }

    render() {
        const {item, cue, textToHighlight, index} = this.props;
        return (
            <BlockList.Item
                componentClass={ItemLink}
                itemType={item.type}
                itemId={item.id}
                startAt={this.videoPositionSeconds}
                onClick={this.trackCueClick}
                id={`item-${item.id}-matching-cue-${index}`}
                divRole="button"
            >
                <span data-purpose="matched-cue-start-time" styleName="cue-start-time">
                    {this.cueStartTime}
                </span>
                <Highlighter
                    textToHighlight={cue.text_t}
                    searchWords={textToHighlight.split(' ')}
                />
            </BlockList.Item>
        );
    }
}
