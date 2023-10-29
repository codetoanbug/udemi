import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Sortable from 'base-components/ungraduated/sortable/sortable.react-component';
import {showErrorToast} from 'organization-common/toasts';
import Raven from 'utils/ud-raven';

import LearningPathStore from '../../learning-path.mobx-store';
import AddContentButton from '../add-content/add-content-button.react-component';
import {
    LEARNING_PATH_ERROR_MESSAGES,
    SORTABLE_SCROLL_SENSITIVITY,
    SORTABLE_SCROLL_SPEED,
    INVISIBLE_SECTION_SELECTOR,
} from '../constants';
import pageEventTracker from '../page-event-tracker';
import EmptyState from './empty-state.react-component';
import SectionInvisible from './section-invisible.react-component';
import styles from './section.less';
import Section from './section.react-component';

@inject('learningPathStore')
@observer
export default class SectionsList extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    @autobind
    handleSortStart() {
        document.body.classList.add(styles.dragging);
    }

    @autobind
    handleSectionReorder(e) {
        document.body.classList.remove(styles.dragging);
        const {to, oldIndex, newIndex} = e;
        const {
            reorderSection,
            moveSectionToUnsectionedArea,
        } = this.props.learningPathStore.learningPath;
        if (to.id === INVISIBLE_SECTION_SELECTOR) {
            // Use specific action to merge reordered section with unsectioned items
            return moveSectionToUnsectionedArea(oldIndex, newIndex);
        } else if (oldIndex === newIndex) {
            return;
        }
        reorderSection(oldIndex, newIndex);
        pageEventTracker.reorderedSection();
    }

    @autobind
    async handleItemReorder({oldIndex, newIndex, from, to}) {
        document.body.classList.remove(styles.dragging);

        const oldSectionIndex = from.id.split('-')[1];
        const newSectionIndex = to.id.split('-')[1];

        if (oldSectionIndex === newSectionIndex && oldIndex === newIndex) {
            return;
        }
        try {
            await this.props.learningPathStore.learningPath.reorderItem(
                oldIndex,
                newIndex,
                oldSectionIndex,
                newSectionIndex,
            );
            pageEventTracker.reorderedItem();
        } catch (e) {
            Raven.captureException(e);
            showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_REORDER);
        }
    }

    renderUnsectionedItems() {
        const {invisibleSection} = this.props.learningPathStore.learningPath;
        if (!invisibleSection) {
            return null;
        }
        return (
            <SectionInvisible
                section={invisibleSection}
                handleSortStart={this.handleSortStart}
                handleItemReorder={this.handleItemReorder}
            />
        );
    }

    renderSections() {
        const {sections, assessmentToHighlight} = this.props.learningPathStore.learningPath;
        const {showNewLearningPathPageUIEnabled} = this.props.learningPathStore;
        return sections.map((section, index) => {
            // Hide assessment section if assessment is highlighted since we display assessment before sections
            if (
                assessmentToHighlight &&
                section.isAssessmentSection &&
                showNewLearningPathPageUIEnabled
            ) {
                return null;
            }
            return (
                <li key={`section-${section.id}`}>
                    <Section
                        section={section}
                        index={index}
                        isLastSection={index === sections.length - 1}
                        handleSortStart={this.handleSortStart}
                        handleItemReorder={this.handleItemReorder}
                    />
                </li>
            );
        });
    }

    renderViewMode() {
        return <ul className="ud-unstyled-list">{this.renderSections()}</ul>;
    }

    renderEditMode() {
        const {isTabletViewportSize} = this.props.learningPathStore;
        return (
            <Sortable
                options={{
                    animation: 150,
                    forceFallback: true,
                    group: {name: 'section-list', pull: ['section-list', 'path-section-invisible']},
                    filter: '.no-drag',
                    onStart: this.handleSortStart,
                    onEnd: this.handleSectionReorder,
                    preventOnFilter: false,
                    scrollSpeed: SORTABLE_SCROLL_SPEED,
                    scrollSensitivity: SORTABLE_SCROLL_SENSITIVITY,
                    handle: isTabletViewportSize ? '.drag-bar' : '',
                }}
                tag="ul"
                className="ud-unstyled-list"
            >
                {this.renderSections()}
            </Sortable>
        );
    }

    render() {
        const {learningPath, isEditModeEnabled} = this.props.learningPathStore;
        const {isCurriculumLoading, isEmptyState, lastSection, sections} = learningPath;

        if (isCurriculumLoading) {
            return <MainContentLoader size="xlarge" />;
        }

        if (isEmptyState) {
            return <EmptyState />;
        }

        const lastSectionIndex = sections.length ? sections.length - 1 : null;

        return (
            <div id="section-list">
                {this.renderUnsectionedItems()}
                {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
                {this.props.learningPathStore.isEditModeEnabled && (
                    <div styleName="sections-list-add-content-row">
                        <AddContentButton
                            section={lastSection}
                            sectionIndex={lastSectionIndex}
                            data-purpose="replace-removed-course"
                            size="small"
                            context="end"
                        />
                    </div>
                )}
            </div>
        );
    }
}
