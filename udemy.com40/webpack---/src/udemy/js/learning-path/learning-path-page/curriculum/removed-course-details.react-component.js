import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import pageEventTracker from '../page-event-tracker';
import ItemEditContent from './item-edit-content.react-component';

import './removed-course-alert.less';

@observer
export default class RemovedCourseDetails extends React.Component {
    static propTypes = {
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
    };

    @observable isCourseDetailsOpen = false;

    get selectedItems() {
        const {numItems, numSelectedItems} = this.props.item.content;

        return ninterpolate(
            '%(numSelectedItems)s of %(numItems)s item were added to the path',
            '%(numSelectedItems)s of %(numItems)s items were added to the path',
            numSelectedItems,
            {
                numItems,
                numSelectedItems,
            },
        );
    }

    @autobind
    @action
    toggleIsCourseDetailsOpen() {
        this.isCourseDetailsOpen = !this.isCourseDetailsOpen;
        this.isCourseDetailsOpen &&
            pageEventTracker.clickedShowCourseDetails(this.props.item.content.courseId);
    }

    @autobind
    renderCourseDetails() {
        const {item} = this.props;

        return (
            <div styleName="course-details" className="ud-text-sm">
                <div styleName="course-details-row">
                    <div>{gettext('Course title')}</div>
                    <div>{item.title}</div>
                </div>
                <div styleName="course-details-row">
                    <div>{gettext('Course description')}</div>
                    <div>{item.description}</div>
                </div>
                <div styleName="course-details-row">
                    <div>{gettext('Course items')}</div>
                    <div>{this.selectedItems}</div>
                </div>
                <div styleName="course-details-row">
                    <div />
                    <div>
                        <ItemEditContent item={item} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                <Button
                    udStyle="ghost"
                    size="small"
                    onClick={this.toggleIsCourseDetailsOpen}
                    data-purpose="toggle-details-button"
                    className="no-drag"
                    styleName="toggle-details-button"
                >
                    {this.isCourseDetailsOpen
                        ? gettext('Hide course details')
                        : gettext('Show course details')}
                    <InfoIcon label={false} size="xsmall" />
                </Button>
                {this.isCourseDetailsOpen && this.renderCourseDetails()}
            </>
        );
    }
}
