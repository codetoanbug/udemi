import ImportantIcon from '@udemy/icons/dist/important.ud-icon';
import {Duration, formatDuration} from '@udemy/react-date-time-components';
import {Popover, Tooltip} from '@udemy/react-popup-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Truncate} from 'base-components/ungraduated/text/truncate-with-tooltip.react-component';
import ensureInView from 'utils/ensure-in-view';

import {TRACKING_CATEGORIES, ASSESSMENT_GUIDE_ACTIONS} from '../constants';
import CurriculumSection from '../curriculum/curriculum-section.mobx-model';
import SearchResultSection from '../dashboard/search/search-result-section.mobx-model';
import requires from '../registry/requires';
import SectionItems from './section-items.react-component';

import './section.less';

@inject('scrollContainerRef')
@requires('courseTakingStore')
@observer
export default class Section extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        section: PropTypes.oneOfType([
            PropTypes.instanceOf(CurriculumSection),
            PropTypes.instanceOf(SearchResultSection),
        ]).isRequired,
        index: PropTypes.number, // since we cannot access "key" https://reactjs.org/warnings/special-props.html
        isSearchMode: PropTypes.bool,
        textToHighlight: PropTypes.string,
        scrollContainerRef: PropTypes.object,
    };

    static defaultProps = {
        index: 0,
        textToHighlight: undefined,
        isSearchMode: false,
        scrollContainerRef: undefined,
    };

    constructor(props) {
        super(props);
        this.isExpanded = this.isCurrentSection || this.props.isSearchMode;
        reaction(
            () => this.props.courseTakingStore.currentCurriculumItemId,
            this.ensureSectionExpandedIfActive,
        );
    }

    componentDidMount() {
        this.ensureSectionExpandedIfActive();
        // eslint-disable-next-line react/no-find-dom-node
        this.sectionNode = ReactDOM.findDOMNode(this);
    }

    componentWillUnmount() {
        this.sectionNode = null;
    }

    @autobind
    onExpanded() {
        this.sectionNode &&
            ensureInView(this.sectionNode, this.props.scrollContainerRef, {
                forceToTop: true,
                offsetTop: 0,
            });
    }

    get sectionModel() {
        const {section} = this.props;
        return this.props.isSearchMode ? section.section : section;
    }

    get isPracticeTestCourse() {
        const {courseTakingStore} = this.props;
        return courseTakingStore.course && courseTakingStore.course.isPracticeTestCourse;
    }

    get isCurrentSection() {
        const {currentCurriculumSection} = this.props.courseTakingStore;
        return !!currentCurriculumSection && currentCurriculumSection.id === this.sectionModel.id;
    }

    @observable isExpanded;
    @observable isTitleTruncated = false;

    @autobind
    @action
    onTruncateSectionTitle(isTruncated) {
        this.isTitleTruncated = isTruncated;
    }

    @autobind
    @action
    toggleSection(isExpanded) {
        this.isExpanded = isExpanded;

        if (this.props.section.isRecommendationAssessmentTopic) {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.ASSESSMENT_GUIDE,
                ASSESSMENT_GUIDE_ACTIONS.CLICK_GUIDED_SECTION,
            );
        }
    }

    @autobind
    @action
    ensureSectionExpandedIfActive() {
        if (this.isCurrentSection && !this.isExpanded) {
            this.isExpanded = true;
        }
    }

    renderProgressSection() {
        if (this.props.isSearchMode) {
            const {matchingItems} = this.props.section;
            const completedItems = matchingItems.filter((item) => item.curriculumItem.isCompleted);
            return this.renderProgressStatus(completedItems.length, matchingItems.length);
        }

        const {numPublishedItems, numCompletedItems} = this.props.section;
        return this.renderProgressStatus(numCompletedItems, numPublishedItems);
    }

    renderProgressStatus(numCompletedItems, numItems) {
        const duration = formatDuration(
            {
                numSeconds: this.props.section.timeEstimation,
                presentationStyle: Duration.STYLE.HUMAN,
                precision: Duration.PRECISION.MINUTES,
            },
            {gettext, interpolate},
        );
        return (
            <>
                <span aria-hidden={true}>{`${numCompletedItems} / ${numItems} | ${duration}`}</span>
                <span data-purpose="section-duration-sr-only" className="ud-sr-only">
                    <span>
                        {ninterpolate(
                            '%(numCompletedItems)s of %(numItems)s lecture completed',
                            '%(numCompletedItems)s of %(numItems)s lectures completed',
                            numItems,
                            {
                                numItems,
                                numCompletedItems,
                            },
                        )}
                    </span>
                    <span>{duration}</span>
                </span>
            </>
        );
    }

    renderSectionTitle() {
        if (this.isPracticeTestCourse) {
            return gettext('Practice tests');
        }

        return `${this.sectionModel.legend}${this.sectionModel.title}`;
    }

    getRecommendationPopoverText(assessmentTitle) {
        const text = gettext(
            'Based on your "%(assessmentTitle)s" assessment results, this section contains content to focus on.',
        );
        return interpolate(text, {assessmentTitle}, true);
    }

    @autobind
    renderSectionHeader({children, ...props}) {
        if (this.isPracticeTestCourse) {
            return <h3 {...props}>{children}</h3>;
        }

        const {courseTakingStore, section} = this.props;
        return (
            <div styleName="section-heading flex" data-purpose="section-heading">
                {section.isRecommendationAssessmentTopic && (
                    <Popover
                        a11yRole="description"
                        trigger={
                            <ImportantIcon
                                label={false}
                                styleName={
                                    section.isRecommendationChapterSectionCompleted
                                        ? 'completed-recommended-assessment-icon'
                                        : 'recommended-assessment-icon'
                                }
                            />
                        }
                        placement="left"
                        canToggleOnHover={true}
                        toggleStrategy="add-remove"
                        detachFromTarget={true}
                        getScrollContainers={courseTakingStore.getSidebarScrollContainers}
                        styleName="popover"
                    >
                        <strong>{gettext('Recommended for you')}</strong>
                        <p styleName="popover-text">
                            {this.getRecommendationPopoverText(
                                section.recommendationAssessmentTitle,
                            )}
                        </p>
                    </Popover>
                )}
                <div styleName="flex">
                    <h3 {...props}>
                        {!this.isTitleTruncated ? (
                            children
                        ) : (
                            <Tooltip
                                detachFromTarget={true}
                                getScrollContainers={courseTakingStore.getSidebarScrollContainers}
                                placement="left"
                                styleName="title-tooltip"
                                trigger={children}
                            >
                                {this.renderSectionTitle()}
                            </Tooltip>
                        )}
                    </h3>
                    <div
                        className="ud-text-xs"
                        styleName="progress"
                        data-purpose="section-duration"
                    >
                        {this.renderProgressSection()}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {courseTakingStore, scrollContainerRef, ...sectionItemsProps} = this.props;
        return (
            <Accordion.Panel
                styleName="section"
                data-purpose={`section-panel-${this.props.index}`}
                title={
                    <Truncate lines={2} onTruncate={this.onTruncateSectionTitle}>
                        {this.renderSectionTitle()}
                    </Truncate>
                }
                renderTitle={this.renderSectionHeader}
                expanded={this.isExpanded}
                onToggle={this.toggleSection}
            >
                <SectionItems
                    onRendered={this.onExpanded}
                    isVisible={this.isExpanded}
                    {...sectionItemsProps}
                />
            </Accordion.Panel>
        );
    }
}
