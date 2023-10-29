import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Sortable from 'base-components/ungraduated/sortable/sortable.react-component';

import LearningPathSection from '../../learning-path-section.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import {
    SORTABLE_ANIMATION_TIME,
    SORTABLE_SCROLL_SENSITIVITY,
    SORTABLE_SCROLL_SPEED,
} from '../constants';
import SectionItem from './section-item.react-component';

import './section.less';

@inject('learningPathStore')
@observer
export default class SectionInvisible extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        section: PropTypes.instanceOf(LearningPathSection).isRequired,
        handleSortStart: PropTypes.func.isRequired,
        handleItemReorder: PropTypes.func.isRequired,
    };

    renderItems() {
        const {section} = this.props;
        return section.items.map((item, index) => {
            return (
                <li key={`section-${section.id}-item-${item.id}`}>
                    <SectionItem
                        index={index}
                        item={item}
                        onDeleteSuccess={section.deleteItemAt}
                        sectionIndex={index}
                    />
                </li>
            );
        });
    }

    renderViewMode() {
        return (
            <div>
                <ul className="ud-unstyled-list">{this.renderItems()}</ul>
            </div>
        );
    }

    renderEditMode() {
        const {isTabletViewportSize} = this.props.learningPathStore;
        return (
            <div data-container-index="invisible">
                <Sortable
                    options={{
                        animation: SORTABLE_ANIMATION_TIME,
                        forceFallback: true,
                        group: {
                            name: 'path-section-invisible',
                            pull: ['path-section'],
                            put: ['path-section', 'section-list'],
                        },
                        onStart: this.props.handleSortStart,
                        onEnd: this.props.handleItemReorder,
                        filter: '.no-drag',
                        preventOnFilter: false,
                        scrollSpeed: SORTABLE_SCROLL_SPEED,
                        scrollSensitivity: SORTABLE_SCROLL_SENSITIVITY,
                        handle: isTabletViewportSize ? '.drag-bar' : '',
                    }}
                    id="section-invisible"
                    tag="ul"
                    className="ud-unstyled-list"
                >
                    {this.renderItems()}
                </Sortable>
            </div>
        );
    }

    render() {
        const {isEditModeEnabled} = this.props.learningPathStore;
        const styleName = classNames('container container--invisible', {
            'container--empty': this.props.section.items.length === 0,
        });
        return (
            <div styleName={styleName}>
                {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
            </div>
        );
    }
}
