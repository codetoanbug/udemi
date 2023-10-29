import DragIcon from '@udemy/icons/dist/drag.ud-icon';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from '../../learning-path.mobx-store';

import './order-bar.less';

@inject('learningPathStore')
@observer
export default class OrderBar extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        index: PropTypes.number,
        text: PropTypes.node,
        size: PropTypes.oneOf(['small', 'large']),
        isCompleted: PropTypes.bool,
        isDraggable: PropTypes.bool,
        isUnsectioned: PropTypes.bool,
        isInCourseRemovalAlert: PropTypes.bool,
    };

    static defaultProps = {
        index: undefined,
        text: undefined,
        size: 'large',
        isCompleted: false,
        isDraggable: true,
        isUnsectioned: false,
        isInCourseRemovalAlert: false,
    };

    render() {
        const {isEditModeEnabled, learningPath, shouldShowOrderBar} = this.props.learningPathStore;
        const isFirstItem = this.props.index === 0 && this.props.isUnsectioned;

        const itemClasses = classNames({
            'order-item': this.props.isDraggable,
            'order-item--small': this.props.isDraggable && this.props.size === 'small',
            'order-item--completed': this.props.isCompleted,
        });
        const wrapperClasses = classNames({
            'order-item-wrapper': true,
            'order-item-wrapper--small': this.props.isDraggable && this.props.size === 'small',
            // if there are unsectioned items - first item's line should have different style
            'order-item-wrapper--start-section':
                this.props.index === 0 &&
                !learningPath.isInvisibleSectionShown &&
                this.props.size !== 'small',
            'order-item-wrapper--start-item': isFirstItem,
            // if the alert is an unsectioned item & first item, the line should not contain
            // padding between the end of the line and alert's top-edge
            'order-item-wrapper--start-item-alert':
                isFirstItem && this.props.isInCourseRemovalAlert,
        });
        // Final combination of controlled and uncontrolled logic
        const draggableClassNames = classNames('drag-bar', {
            'drag-bar--placeholder': !this.props.isDraggable,
        });

        return (
            <div styleName="order-bar" data-purpose="order-line">
                <div styleName="order-bar__content">
                    {isEditModeEnabled && (
                        <div
                            styleName={draggableClassNames}
                            data-purpose="drag-bar"
                            className="drag-bar"
                        >
                            <DragIcon label={gettext('Draggable')} size="large" />
                        </div>
                    )}
                    {shouldShowOrderBar && (
                        <div styleName={wrapperClasses}>
                            {!this.props.isInCourseRemovalAlert && (
                                <div styleName="order-item-container">
                                    <div styleName={itemClasses} data-purpose="order-item">
                                        {this.props.text}
                                    </div>
                                </div>
                            )}
                            <div styleName="order-line" />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
