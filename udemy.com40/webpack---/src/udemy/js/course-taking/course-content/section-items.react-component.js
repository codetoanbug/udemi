import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import CurriculumSection from '../curriculum/curriculum-section.mobx-model';
import SearchResultSection from '../dashboard/search/search-result-section.mobx-model';
import requires from '../registry/requires';
import CurriculumItemLink from './curriculum-item-link.react-component';
import MatchingCuesList from './search-results/matching-cues-list.react-component';

import './section.less';

@requires('courseTakingStore')
@observer
export default class SectionItems extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            currentCurriculumItemId: PropTypes.number,
            course: PropTypes.shape({
                isPracticeTestCourse: PropTypes.bool,
            }),
        }).isRequired,
        section: PropTypes.oneOfType([
            PropTypes.instanceOf(CurriculumSection),
            PropTypes.instanceOf(SearchResultSection),
        ]).isRequired,
        isVisible: PropTypes.bool.isRequired,
        onRendered: PropTypes.func,
        index: PropTypes.number, // since we cannot access "key" https://reactjs.org/warnings/special-props.html
        isSearchMode: PropTypes.bool,
        textToHighlight: PropTypes.string,
    };

    static defaultProps = {
        onRendered: noop,
        index: 0,
        textToHighlight: undefined,
        isSearchMode: false,
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.isVisible && this.props.isVisible) {
            this.props.onRendered();
        }
    }

    get sectionModel() {
        const {section} = this.props;
        return this.props.isSearchMode ? section.section : section;
    }

    get isPracticeTestCourse() {
        const {courseTakingStore} = this.props;
        return courseTakingStore.course && courseTakingStore.course.isPracticeTestCourse;
    }

    render() {
        if (!this.isPracticeTestCourse && !this.props.isVisible) {
            return null;
        }

        const {courseTakingStore, index, section, textToHighlight, isSearchMode} = this.props;
        const curriculumItems = isSearchMode ? section.matchingItems : this.sectionModel.items;

        const items = curriculumItems.map((item, itemIndex) => {
            const curriculumItem = isSearchMode ? item.curriculumItem : item;
            const isCurrentItem = curriculumItem.id === courseTakingStore.currentCurriculumItemId;
            const resources = isSearchMode ? item.matchingResources : curriculumItem.resources;

            return (
                <React.Fragment key={curriculumItem.id}>
                    <CurriculumItemLink
                        item={curriculumItem}
                        resources={resources}
                        isCurrentItem={isCurrentItem}
                        textToHighlight={textToHighlight}
                        isSearchMode={isSearchMode}
                        index={itemIndex}
                        sectionIndex={index}
                    />
                    {isSearchMode && item.matchingCues.length > 0 && (
                        <li>
                            <MatchingCuesList
                                searchResultItem={item}
                                textToHighlight={textToHighlight}
                            />
                        </li>
                    )}
                </React.Fragment>
            );
        });

        return <ul className="ud-unstyled-list">{items}</ul>;
    }
}
