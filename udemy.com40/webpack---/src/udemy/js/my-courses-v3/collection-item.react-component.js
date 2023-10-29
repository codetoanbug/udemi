import {Tracker} from '@udemy/event-tracking';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    LearningListItemRemoveEvent,
    LearningListItemSaveEvent,
} from 'browse/components/save-to-list/events';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import './options-menu.less';

@observer
export default class CollectionItem extends Component {
    static propTypes = {
        collection: PropTypes.object.isRequired,
        courseId: PropTypes.number.isRequired,
        trackingId: PropTypes.string.isRequired,
        uiRegion: PropTypes.string.isRequired,
    };

    @observable isLoading = false;

    @action
    async toggleCourseInCollection() {
        this.isLoading = true;
        const {collection, courseId} = this.props;

        try {
            if (this.courseInCollection) {
                await udApi.delete(
                    `/users/me/subscribed-courses-collections/${collection.id}/courses/${courseId}/`,
                );
                runInAction(() => {
                    collection.courses = collection.courses.filter(
                        (course) => course.id !== courseId,
                    );
                    Tracker.publishEvent(
                        new LearningListItemRemoveEvent({
                            listId: collection.list_id,
                            courseId,
                            trackingId: this.props.trackingId,
                            uiRegion: this.props.uiRegion,
                        }),
                    );
                    this.isLoading = false;
                });
            } else {
                await udApi.post(
                    `/users/me/subscribed-courses-collections/${collection.id}/courses/`,
                    {course: courseId},
                );
                runInAction(() => {
                    collection.courses.push({_class: 'course', id: courseId});
                    Tracker.publishEvent(
                        new LearningListItemSaveEvent({
                            listId: collection.list_id,
                            courseId,
                            trackingId: this.props.trackingId,
                            uiRegion: this.props.uiRegion,
                        }),
                    );
                    this.isLoading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.isLoading = false;
                Raven.captureException(error);
            });
        }
    }

    @autobind onClick() {
        this.toggleCourseInCollection();
        return false;
    }

    @computed
    get courseInCollection() {
        return !!this.props.collection.courses.find((course) => course.id === this.props.courseId);
    }

    render() {
        let icon = null;
        if (this.isLoading) {
            icon = <Loader />;
        } else if (this.courseInCollection) {
            icon = (
                <TickIcon color="positive" label={gettext('This course is in the collection.')} />
            );
        }

        return (
            <Dropdown.MenuItem icon={icon} onClick={this.onClick}>
                <span styleName="collection-title">{this.props.collection.title}</span>
            </Dropdown.MenuItem>
        );
    }
}
