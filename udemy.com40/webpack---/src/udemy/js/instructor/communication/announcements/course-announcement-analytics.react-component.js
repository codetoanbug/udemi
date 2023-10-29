import {ConfirmModal} from '@udemy/react-dialog-components';
import {Pagination} from '@udemy/react-navigation-components';
import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import AnnouncementAnalyticsStore from './announcement-analytics.mobx-store';
import EducationalAnnouncementTable from './announcement-tables/educational-announcement-table.react-component';
import PromotionalAnnouncementTable from './announcement-tables/promotional-announcement-table.react-component';

import './announcement-analytics.less';

@observer
export default class CourseAnnouncementAnalytics extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        announcementType: PropTypes.oneOf(['educational', 'promotional']).isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new AnnouncementAnalyticsStore(props.courseId, props.announcementType);
    }

    componentDidMount() {
        this.store.loadAnnouncements();
    }

    @observable announcementToRemove;

    @computed
    get warningText() {
        if (!this.announcementToRemove) {
            return '';
        }
        let question;
        if (this.announcementToRemove.announcement_group.is_promotional) {
            question = gettext(
                'Are you sure you want to remove the following Promotional Announcement?',
            );
        } else {
            question = gettext(
                'Are you sure you want to remove the following Educational Announcement?',
            );
        }
        const {title, content} = this.announcementToRemove.announcement_group;
        return (
            <div>
                <p>{question}</p>
                <div styleName="remove-announcement-warning">
                    {title && (
                        <h3 className="ud-heading-lg" styleName="remove-announcement-title">
                            {title}
                        </h3>
                    )}
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller:
                                'course-announcement-analytics:announcement-group-content',
                            html: content,
                        })}
                    />
                </div>
                <p>{gettext('It will no longer be visible on the course dashboard.')}</p>
            </div>
        );
    }

    @autobind
    @action
    markForRemoval(announcement) {
        this.announcementToRemove = announcement;
    }

    @autobind
    @action
    cancelRemoval() {
        this.announcementToRemove = null;
    }

    @autobind
    @action
    confirmRemoval() {
        this.store.deleteAnnouncement(this.announcementToRemove);
        this.announcementToRemove = null;
    }

    render() {
        if (!this.store.announcements.length) {
            return <div />;
        }
        let announcementTable;
        if (this.props.announcementType === 'educational') {
            announcementTable = (
                <EducationalAnnouncementTable
                    announcements={this.store.announcements.slice()}
                    onRemove={this.markForRemoval}
                    onSort={this.store.loadAnnouncementsSort}
                    sortBy={this.store.sortBy}
                />
            );
        } else {
            announcementTable = (
                <PromotionalAnnouncementTable
                    announcements={this.store.announcements.slice()}
                    onSort={this.store.loadAnnouncementsSort}
                    sortBy={this.store.sortBy}
                />
            );
        }
        return (
            <div>
                <ConfirmModal
                    onCancel={this.cancelRemoval}
                    onConfirm={this.confirmRemoval}
                    isOpen={!!this.announcementToRemove}
                >
                    {this.warningText}
                </ConfirmModal>
                {announcementTable}
                <Pagination
                    styleName="pagination"
                    pageCount={this.store.pageCount}
                    activePage={this.store.activePage}
                    onPageChange={this.store.loadAnnouncements}
                />
            </div>
        );
    }
}
