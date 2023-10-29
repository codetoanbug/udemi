import {Tracker, TrackingContextProvider} from '@udemy/event-tracking';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable, action, extendObservable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {LearningListDeleteEvent} from 'browse/components/save-to-list/events';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import {attachFrontendTrackingIds, discoveryTracker} from 'browse/tracking';
import {showSuccessToast, showReloadPageErrorToast} from 'course-taking/toasts';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import CollectionModal from './collection-modal.react-component';
import {getCollectionCourseFields} from './collections.mobx-store';
import EnrolledCourseCard from './enrolled-course-card.react-component';
import {getReviewsForCourses} from './my-courses.mobx-store';
import './collections.less';

@observer
export default class CollectionCardList extends Component {
    static propTypes = {
        collection: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        uiRegion: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        extendObservable(this, {
            allCoursesLoaded: !props.collection.hasMoreCourses,
        });
        this.collectionCoursesPageSize = props.store.courseLimit;
    }

    @observable collapsed = true;
    @observable moreCoursesLoading = false;

    collectionCoursesPage = 1;

    @autobind
    @action
    onConfirmationModalConfirm(onClose) {
        const {collection} = this.props;

        onClose();
        udApi.delete(`/users/me/subscribed-courses-collections/${collection.id}/`).then(() => {
            showSuccessToast(
                interpolate(
                    gettext('Your list "%(title)s" has been deleted.'),
                    {
                        title: collection.title,
                    },
                    true,
                ),
            );
            this.props.store.removeCollection(collection.id);
            Tracker.publishEvent(
                new LearningListDeleteEvent({
                    listId: collection.list_id,
                    uiRegion: this.props.uiRegion,
                }),
            );
        });
    }

    @autobind
    @action
    async loadMoreCourses() {
        const {collection} = this.props;
        if (!collection.hasMoreCourses) {
            this.allCoursesLoaded = true;
            this.toggleCollapsed();
        } else if (!this.allCoursesLoaded) {
            this.moreCoursesLoading = true;

            // handle case where user deletes courses from collection prior to trying to
            // load more courses which breaks pagination fetching. Refetch the prior
            // page of courses and push the new ones to the collection.courses array
            const deletedCoursesToFetch =
                collection.courses.length % this.collectionCoursesPageSize;
            const page = deletedCoursesToFetch
                ? this.collectionCoursesPage
                : ++this.collectionCoursesPage;

            try {
                const response = await udApi.get(
                    `/users/me/subscribed-courses-collections/${collection.id}/courses/`,
                    {
                        params: {
                            page,
                            page_size: this.collectionCoursesPageSize,
                            'fields[course]': getCollectionCourseFields().join(','),
                        },
                    },
                );
                const courses = response.data.results || [];
                attachFrontendTrackingIds(courses);
                await getReviewsForCourses(courses);
                runInAction(() => {
                    if (!response.data.next) {
                        this.allCoursesLoaded = true;
                    }
                    if (deletedCoursesToFetch) {
                        collection.courses.push(
                            ...courses.slice(
                                -(this.collectionCoursesPageSize - deletedCoursesToFetch),
                            ),
                        );
                    } else {
                        collection.courses.push(...courses);
                    }
                    this.moreCoursesLoading = false;
                    this.collapsed = false;
                });
            } catch (error) {
                this.allCoursesLoaded = true;
                this.toggleCollapsed();
                showReloadPageErrorToast(gettext('Error loading more courses'));
                Raven.captureException(error);
            }
        } else {
            this.toggleCollapsed();
        }
    }

    @autobind
    onCollectionUpdateSuccess() {
        this.props.store.loadCollectionsWithCourses();
    }

    toggleCollapsed() {
        const id = `collection-${this.props.collection.id}`;
        const element = document.getElementById(id);
        element && element.scrollIntoView({behavior: 'smooth'});
        this.collapsed = !this.collapsed;
    }

    renderEmptyList() {
        return <div>{gettext('No courses in this list yet')}</div>;
    }

    renderCourses() {
        const {collection} = this.props;
        return (
            <>
                <div styleName={classNames('course-cards-container', {collapsed: this.collapsed})}>
                    <div className="my-courses__course-card-grid">
                        {collection.courses.map((course, id) => (
                            <TrackingContextProvider
                                key={id}
                                trackingContext={{
                                    trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                                    index: id,
                                    backendSource:
                                        DiscoveryItemImpressionEvent.backendSourceOptions
                                            .USER_COLLECTIONS,
                                }}
                            >
                                <div>
                                    <EnrolledCourseCard
                                        course={course}
                                        store={this.props.store}
                                        collection={collection}
                                        uiRegion={this.props.uiRegion}
                                    />
                                </div>
                            </TrackingContextProvider>
                        ))}
                    </div>
                </div>
                {collection.courses.length > 4 && (
                    <div styleName="load-more">
                        <Button
                            data-purpose="load-more-courses-for-collection"
                            udStyle="ghost"
                            onClick={this.loadMoreCourses}
                        >
                            {this.moreCoursesLoading ? (
                                <Loader color="neutral" />
                            ) : !this.collapsed && this.allCoursesLoaded ? (
                                gettext('See less')
                            ) : (
                                gettext('See more')
                            )}
                        </Button>
                    </div>
                )}
            </>
        );
    }

    render() {
        const {collection} = this.props;
        return (
            <>
                <div styleName="collection-header" id={`collection-${collection.id}`}>
                    <div styleName="collection-title">
                        <h3 className="ud-heading-lg">{collection.title}</h3>
                        <ModalTrigger
                            trigger={
                                <IconButton
                                    className="ud-link-neutral"
                                    size="xsmall"
                                    udStyle="ghost"
                                >
                                    <EditIcon label={gettext('Edit collection title')} />
                                </IconButton>
                            }
                            renderModal={(props) => (
                                <CollectionModal
                                    {...props}
                                    collection={collection}
                                    onUpdateSuccess={this.onCollectionUpdateSuccess}
                                    uiRegion={this.props.uiRegion}
                                />
                            )}
                        />
                        <ModalTrigger
                            trigger={
                                <IconButton
                                    className="ud-link-neutral"
                                    size="xsmall"
                                    udStyle="ghost"
                                    data-purpose="show-delete-confirm-modal"
                                >
                                    <DeleteIcon label={gettext('Delete collection')} />
                                </IconButton>
                            }
                            renderModal={({isOpen, onClose}) => (
                                <ConfirmModal
                                    isOpen={isOpen}
                                    onCancel={onClose}
                                    onConfirm={() => this.onConfirmationModalConfirm(onClose)}
                                >
                                    {gettext(
                                        'Are you sure you want to delete your list?' +
                                            '  You will still be able to access your courses.',
                                    )}
                                </ConfirmModal>
                            )}
                        />
                    </div>
                    {collection.description && (
                        <p styleName="collection-description">{collection.description}</p>
                    )}
                </div>
                {collection.courses.length > 0 ? this.renderCourses() : this.renderEmptyList()}
            </>
        );
    }
}
