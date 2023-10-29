import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed, when} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Highlighter from 'react-highlight-words';

import TruncateWithTooltip from 'base-components/ungraduated/text/truncate-with-tooltip.react-component';
import {ALLOWED_ASSET_TYPES} from 'organization-trial/constants';
import ensureInView from 'utils/ensure-in-view';

import {TRACKING_CATEGORIES} from '../constants';
import CurriculumItem from '../curriculum/curriculum-item.mobx-model';
import ItemLink from '../curriculum/item-link.react-component';
import WorkspacePopover from '../dashboard/labs/messages/workspace-popover.react-component';
import {SEARCH_ACTIONS} from '../dashboard/search/constants';
import requires from '../registry/requires';
import ItemProgressToggle from './item-progress-toggle.react-component';
import ResourceListDropdown from './resource-list-dropdown.react-component';
import ResourceList from './resource-list.react-component';
import './curriculum-item-link.less';

@inject('scrollContainerRef', 'workspaceEnabledLectures')
@requires('courseTakingStore', {name: 'videoViewerStore', optional: true})
@observer
export default class CurriculumItemLink extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            isLimitedConsumptionTrial: PropTypes.bool,
            track: PropTypes.func,
            isContentTabInDashboard: PropTypes.bool,
            bodyContainerRef: PropTypes.object,
        }).isRequired,
        workspaceEnabledLectures: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        isCurrentItem: PropTypes.bool.isRequired,
        item: PropTypes.instanceOf(CurriculumItem).isRequired,
        index: PropTypes.number,
        sectionIndex: PropTypes.number,
        resources: PropTypes.array.isRequired,
        textToHighlight: PropTypes.string,
        isSearchMode: PropTypes.bool,
        scrollContainerRef: PropTypes.object,
        videoViewerStore: PropTypes.shape({
            isPlaying: PropTypes.bool,
        }),
    };

    static defaultProps = {
        index: 0,
        sectionIndex: 0,
        textToHighlight: '',
        isSearchMode: false,
        scrollContainerRef: null,
        videoViewerStore: null,
        workspaceEnabledLectures: undefined,
    };

    componentDidMount() {
        const {courseTakingStore, isCurrentItem, scrollContainerRef} = this.props;
        if (isCurrentItem && !courseTakingStore.isContentTabInDashboard) {
            when(() => scrollContainerRef, this.scrollToTop);
        }
    }

    componentDidUpdate() {
        const {courseTakingStore, isCurrentItem, scrollContainerRef} = this.props;
        if (isCurrentItem && !courseTakingStore.isContentTabInDashboard) {
            when(() => scrollContainerRef, this.scrollToTop);
        }
    }

    get isLockedForTrial() {
        return (
            this.props.courseTakingStore.isLimitedConsumptionTrial &&
            (!this.props.item.asset || !ALLOWED_ASSET_TYPES.includes(this.props.item.asset.type))
        );
    }

    @computed
    get isWorkspaceEnabled() {
        return this.props.workspaceEnabledLectures?.some((lecture) => {
            return lecture === this.props.item.id;
        });
    }

    @autobind
    setItemRef(ref) {
        this.itemRef = ref;
    }

    @autobind
    scrollToTop() {
        const {scrollContainerRef, courseTakingStore, isSearchMode} = this.props;
        const {isInitialScrollPositionSet, markInitialScrollPositionSet} = courseTakingStore;

        if (!scrollContainerRef || !this.itemRef || isSearchMode) {
            return;
        }

        const finalScrollPosition = this.itemRef.offsetTop - scrollContainerRef.offsetTop;

        if (!isInitialScrollPositionSet) {
            scrollContainerRef.scrollTop = finalScrollPosition;
            markInitialScrollPositionSet();
            return;
        }

        ensureInView(this.itemRef, scrollContainerRef, {forceToTop: true, offsetTop: 0});
    }

    trackVisit() {
        const {courseTakingStore, isSearchMode} = this.props;
        if (isSearchMode) {
            courseTakingStore.track(
                TRACKING_CATEGORIES.SEARCH_VISIT,
                SEARCH_ACTIONS.VISIT_CURRICULUM_ITEM,
            );
        } else {
            courseTakingStore.track(TRACKING_CATEGORIES.COURSE_CONTENT_VIEW);
        }
    }

    @autobind
    handleClick(ev) {
        if (this.isLockedForTrial) {
            ev.preventDefault();
            return;
        }

        const {courseTakingStore, isSearchMode} = this.props;
        this.trackVisit();
        const canScrollPage = courseTakingStore.isContentTabInDashboard && !isSearchMode;
        if (canScrollPage && courseTakingStore.bodyContainerRef) {
            ensureInView(courseTakingStore.bodyContainerRef, null, {
                forceToTop: true,
                offsetTop: 10,
            });
        }

        if (courseTakingStore.curriculumItemContentContainerRef) {
            ensureInView(courseTakingStore.curriculumItemContentContainerRef, null, {
                forceToTop: true,
                offsetTop: 0,
            });
        }
    }

    @computed
    get titleText() {
        const {courseTakingStore, item} = this.props;
        const isPreview = item.isFree && courseTakingStore.isLimitedConsumptionTrial;
        const previewText = gettext('(Preview)');
        return isPreview ? `${item.displayTitle} ${previewText}` : item.displayTitle;
    }

    renderScreenReaderSpan(screenReaderText) {
        const screanReaderSpan = React.createElement(
            'span',
            {
                className: 'ud-sr-only',
            },
            screenReaderText,
        );
        return screanReaderSpan;
    }

    renderTitle() {
        const {courseTakingStore, textToHighlight} = this.props;
        let titleMarkup = this.titleText;
        if (textToHighlight) {
            titleMarkup = (
                <Highlighter
                    textToHighlight={this.titleText}
                    searchWords={textToHighlight.trim().split(' ')}
                />
            );
        }

        return (
            <div styleName="curriculum-item-title">
                {this.isWorkspaceEnabled && (
                    <WorkspacePopover
                        detachFromTarget={true}
                        getScrollContainers={courseTakingStore.getSidebarScrollContainers}
                    />
                )}
                <span styleName="curriculum-item-title-content">
                    <TruncateWithTooltip
                        detachFromTarget={true}
                        getScrollContainers={courseTakingStore.getSidebarScrollContainers}
                        placement="left"
                        trigger={<span data-purpose="item-title">{titleMarkup}</span>}
                    >
                        {this.titleText}
                    </TruncateWithTooltip>
                </span>
            </div>
        );
    }

    renderMetadataRow() {
        const {iconComponent: Icon, asset} = this.props.item;
        if (!Icon && !this.itemHasDuration) {
            return null;
        }

        const buttonAriaLabelText = `${this.ariaLabelText} ${this.props.item.title}`;

        return (
            <div className="ud-text-xs" styleName="metadata">
                {Icon && (
                    <Button udStyle="link" aria-label={buttonAriaLabelText}>
                        <Icon label={false} size="xsmall" color="inherit" />
                    </Button>
                )}
                {this.itemHasDuration && <Duration numSeconds={asset.timeEstimation} />}
            </div>
        );
    }

    @computed
    get itemHasDuration() {
        const {item} = this.props;
        return item.asset && item.asset.timeEstimation !== undefined;
    }

    @computed
    get ariaLabelText() {
        const {item, isCurrentItem, videoViewerStore} = this.props;

        const progressText = this.completed ? gettext('(Completed)') : '';
        const isPlaying = videoViewerStore && isCurrentItem ? videoViewerStore.isPlaying : false;
        const videoText = isPlaying
            ? gettext('%(progressText)sStop')
            : gettext('%(progressText)sPlay');
        const text = item.isVideo ? videoText : gettext('%(progressText)sStart');
        return interpolate(
            text,
            {
                progressText,
            },
            true,
        );
    }

    render() {
        const {
            isCurrentItem,
            item,
            sectionIndex,
            index,
            resources,
            textToHighlight,
            isSearchMode,
        } = this.props;
        const style = classNames('curriculum-item', {
            'is-current': isCurrentItem && !isSearchMode,
        });
        const resourceListProps = {item, resources, textToHighlight, isSearchMode};
        const shouldCollapseResources = Boolean(resources.length && !textToHighlight);

        let bottomRow = null;

        const metadata = this.renderMetadataRow();
        if (metadata || shouldCollapseResources) {
            bottomRow = (
                <div styleName="bottom-row">
                    {metadata}
                    {shouldCollapseResources && <ResourceListDropdown {...resourceListProps} />}
                </div>
            );
        }

        return (
            <li styleName={style} ref={this.setItemRef} aria-current={isCurrentItem}>
                <ItemLink
                    itemType={item.type}
                    itemId={item.id}
                    data-purpose={`curriculum-item-${sectionIndex}-${index}`}
                    className="ud-custom-focus-visible"
                    onClick={this.handleClick}
                    divRole=""
                    tabIndex={null}
                >
                    <ItemProgressToggle
                        item={item}
                        isCurrentItem={isCurrentItem}
                        isLockedForTrial={this.isLockedForTrial}
                    />
                    {this.renderScreenReaderSpan(this.ariaLabelText)}
                    <div styleName="item-container">
                        <div className="ud-text-sm ud-focus-visible-target">
                            {this.renderTitle()}
                        </div>
                        {bottomRow}
                    </div>
                </ItemLink>
                {!shouldCollapseResources && (
                    <ResourceList styleName="resource-list" {...resourceListProps} />
                )}
            </li>
        );
    }
}
