import {LocalizedHtml} from '@udemy/i18n';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import Tabs from 'base-components/tabs/tabs.react-component';
import EmptyState from 'instructor/common/empty-state.react-component';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import udLink from 'utils/ud-link';

import AnnouncementsStore from './announcements.mobx-store';
import Announcements from './tabs/announcements.react-component';
import Promotions from './tabs/promotions.react-component';

import './announcements.less';

@inject('instructorStore')
@observer
export class AnnouncementsApp extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
        instructorStore: PropTypes.object.isRequired,
        store: PropTypes.object, // for testing
        isInstructorSendAnnouncementEnabled: PropTypes.bool,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
    };

    static defaultProps = {
        store: undefined,
        isInstructorSendAnnouncementEnabled: true,
        isUBOnlyDataPreviewEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
    };

    constructor(props) {
        super(props);

        const {baseUrl, instructorStore} = props;
        this.baseUrl = baseUrl;
        this.store =
            props.store ||
            (instructorStore && instructorStore.AnnouncementsStore) ||
            new AnnouncementsStore(instructorStore);
        this.store.loadInitialTaughtCourses(this.props.isTaughtCoursesApiSlimVersionEnabled);
        if (instructorStore) {
            instructorStore.AnnouncementsStore = this.store;
        }
    }

    @observable currentTab = 1;

    @autobind
    onCourseSelect(courseId) {
        this.store.setCourseFilter(courseId);
    }

    @autobind
    @action
    handleSelect(currentTab) {
        this.currentTab = currentTab;
    }

    renderHeader() {
        const store = this.store;
        const allCourseDropdownData = {
            data: store.taughtCourses,
            selectedId: store.courseIdFilter,
            onCourseSelect: this.onCourseSelect,
            includeAllCourses: false,
        };
        return (
            <IAResponsiveHeader
                title={gettext('Announcements')}
                loaded={store.ready}
                allCourseDropdownData={allCourseDropdownData}
                isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
            />
        );
    }

    render() {
        const store = this.store;
        const howToUrl = '/udemy-teach-hub/marketing_reach_out/';
        const SEND_URL = '/announcement/';
        let navItems = null;
        let showEducational = false;
        let showPromotional = false;
        if (store.ready) {
            const course = store.course;
            if (course) {
                showEducational = course.is_published || course.organization_id;
                showPromotional = course.is_published && !course.organization_id;
            }
            if (!showEducational && this.currentTab === 1) {
                action(() => {
                    this.currentTab = showPromotional ? 2 : 1;
                })();
            }
            if (!showPromotional && this.currentTab === 2) {
                action(() => {
                    this.currentTab = 1;
                })();
            }
        }
        if (showEducational || showPromotional) {
            navItems = (
                <Tabs
                    activeTabId={this.currentTab}
                    onSelect={this.handleSelect}
                    toggleStrategy="add-remove"
                >
                    {showEducational && (
                        <Tabs.Tab id={1} title={gettext('Educational announcements')}>
                            <Announcements
                                courseId={store.courseIdFilter}
                                howToUrl={howToUrl}
                                sendUrl={SEND_URL}
                                store={store.announcementStore}
                                isInstructorSendAnnouncementEnabled={
                                    this.props.isInstructorSendAnnouncementEnabled
                                }
                            />
                        </Tabs.Tab>
                    )}
                    {showPromotional && (
                        <Tabs.Tab
                            data-purpose="select-promotional"
                            id={2}
                            title={gettext('Promotional emails')}
                        >
                            <Promotions
                                courseId={store.courseIdFilter}
                                howToUrl={howToUrl}
                                sendUrl={SEND_URL}
                                store={store.promotionsStore}
                                isInstructorSendAnnouncementEnabled={
                                    this.props.isInstructorSendAnnouncementEnabled
                                }
                            />
                        </Tabs.Tab>
                    )}
                </Tabs>
            );
        }

        return (
            <MemoizedBrowserRouter>
                <div>
                    {this.renderHeader()}
                    {!store.ready && <MainContentLoader />}
                    {store.ready && !store.course && (
                        <EmptyState
                            src={udLink.toStorageStaticAsset('communication/empty-mailbox-v2.jpg')}
                            src2x={udLink.toStorageStaticAsset(
                                'communication/empty-mailbox-2x-v2.jpg',
                            )}
                            headerText={gettext('No announcements yet')}
                            subText={
                                <LocalizedHtml
                                    html={gettext(
                                        'Here’s where you can send your students a few email announcements every month. ' +
                                            'Use educational emails to support your students’ learning. Use promotional emails to market your courses. ' +
                                            '<a class="howTo">Learn more</a>',
                                    )}
                                    interpolate={{
                                        howTo: (
                                            <a
                                                className="ud-link-underline"
                                                href={howToUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                    }}
                                />
                            }
                        />
                    )}
                    {navItems}
                </div>
            </MemoizedBrowserRouter>
        );
    }
}

export default withRouter(AnnouncementsApp);
