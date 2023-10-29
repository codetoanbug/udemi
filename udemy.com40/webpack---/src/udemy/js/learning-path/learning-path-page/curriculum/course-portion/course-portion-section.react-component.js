import {Duration} from '@udemy/react-date-time-components';
import {Checkbox} from '@udemy/react-form-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumSection from 'course-taking/curriculum/curriculum-section.mobx-model';

import CoursePortionItem from './course-portion-item.react-component';
import CoursePortionModalStore from './course-portion-modal.mobx-store';

import './course-portion-section.less';

@inject('coursePortionModalStore')
@observer
export default class CoursePortionSection extends React.Component {
    static propTypes = {
        coursePortionModalStore: PropTypes.instanceOf(CoursePortionModalStore).isRequired,
        curriculumSection: PropTypes.instanceOf(CurriculumSection).isRequired,
    };

    @observable isExpanded = true;

    @computed get selectedItems() {
        return this.props.curriculumSection.items.filter((item) => item.isSelected);
    }

    @computed get numSelectedItems() {
        return this.selectedItems.length;
    }

    @computed get selectedItemsDuration() {
        return CurriculumSection.calculateEstimatedTime(this.selectedItems);
    }

    @action
    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
    }

    @autobind
    handleChange(e) {
        this.props.curriculumSection.setIsSelected(e.target.checked);
    }

    renderSectionMetadata() {
        const {legend, title, items} = this.props.curriculumSection;
        const numSelectedItems = this.numSelectedItems;
        const numItems = items.length;
        return (
            <div styleName="metadata">
                <span styleName="title">{`${legend}${title}`}</span>
                <span className="ud-text-xs" aria-hidden={true}>
                    <span>{`${numSelectedItems} / ${numItems}`}</span>
                    <span styleName="separator">{'|'}</span>
                    <Duration
                        data-purpose="section-duration"
                        numSeconds={this.selectedItemsDuration}
                    />
                </span>
                <span data-purpose="section-duration-sr-only" className="ud-sr-only">
                    <span>
                        {ninterpolate(
                            '%(numSelectedItems)s of %(numItems)s item selected',
                            '%(numSelectedItems)s of %(numItems)s items selected',
                            numItems,
                            {
                                numItems,
                                numSelectedItems,
                            },
                        )}
                    </span>
                    <Duration
                        data-purpose="section-duration"
                        numSeconds={this.selectedItemsDuration}
                    />
                </span>
            </div>
        );
    }

    renderTitle() {
        const {isSelected} = this.props.curriculumSection;
        const {isReadOnly} = this.props.coursePortionModalStore;

        return (
            <span styleName="heading-container">
                <span styleName="heading">
                    <span styleName="title-container">
                        <Checkbox
                            checked={isSelected}
                            onChange={this.handleChange}
                            disabled={isReadOnly}
                        >
                            {this.renderSectionMetadata()}
                        </Checkbox>
                    </span>
                </span>
            </span>
        );
    }

    render() {
        const {items} = this.props.curriculumSection;

        return (
            <Accordion.Panel
                title={this.renderTitle()}
                expanded={this.isExpanded}
                styleName="panel-container"
            >
                <ul className="ud-unstyled-list" styleName="portion-item-list">
                    {items.map((item) => {
                        return (
                            <li key={`portion-item-${item.type}-${item.id}`}>
                                <CoursePortionItem curriculumItem={item} />
                            </li>
                        );
                    })}
                </ul>
            </Accordion.Panel>
        );
    }
}
