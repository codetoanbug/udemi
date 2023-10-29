import Observer from '@researchgate/react-intersection-observer';
import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import FolderIcon from '@udemy/icons/dist/folder.ud-icon';
import MinusOutlineIcon from '@udemy/icons/dist/minus-outline.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import ShareIcon from '@udemy/icons/dist/share.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {ModalTrigger, Modal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LearningListItemSaveEvent} from 'browse/components/save-to-list/events';
import {SaveToListButtonStore} from 'browse/components/save-to-list/save-to-list-button.mobx-store';
import {SaveToListModal} from 'browse/components/save-to-list/save-to-list-modal.react-component';
import {showSuccessToast, showReloadPageErrorToast} from 'course-taking/toasts';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import {SOURCE_PAGES} from 'share/constants';
import MarketplaceSocialShareContent from 'share/marketplace-social-share-content.react-component';
import SocialShareStore from 'share/social-share.mobx-store';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import CollectionItem from './collection-item.react-component';
import CollectionModal from './collection-modal.react-component';

import './options-menu.less';

const udConfig = getConfigData();

const keepMenuOpen = () => false;

@inject('enableUBListExperiment')
@observer
class OptionsMenu extends React.Component {
    static propTypes = {
        course: PropTypes.shape({
            id: PropTypes.number,
            enrollment: PropTypes.object,
            is_private: PropTypes.bool,
            title: PropTypes.string,
            frontendTrackingId: PropTypes.string,
        }).isRequired,
        store: PropTypes.object.isRequired,
        collection: PropTypes.object,
        uiRegion: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        enableUBListExperiment: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        collection: null,
    };

    constructor(props) {
        super(props);
        const {course, gettext, interpolate} = this.props;
        this.saveToListButtonStore =
            this.props.store.activeTab == 'collection_tab'
                ? new SaveToListButtonStore(this.props.course, this.props.uiRegion, {
                      gettext,
                      interpolate,
                  })
                : null;
        this.socialShareStore = new SocialShareStore(
            this.socialShareCourseObj,
            course.url,
            SOURCE_PAGES.COURSE_TAKING,
        );
    }

    get socialShareCourseObj() {
        const {course} = this.props;
        return {
            ...course,
            type: 'course',
            is_private: course.isPrivate,
        };
    }

    @autobind
    onShareItemSelect() {
        this.socialShareStore.showShareModal();
        this.socialShareStore.getOrPopulateUrl().catch(() => {
            showReloadPageErrorToast(defaultErrorMessage);
        });
    }

    renderShare() {
        if (this.socialShareStore.isMarketplaceShareEnabled) {
            return [
                <Dropdown.MenuItem
                    key="share-menu-item"
                    data-purpose="share-course"
                    icon={<ShareIcon label={false} />}
                    onClick={this.onShareItemSelect}
                >
                    {gettext('Share')}
                </Dropdown.MenuItem>,
                <Modal
                    key="share-modal"
                    isOpen={this.socialShareStore.isShareModalShown}
                    onClose={this.socialShareStore.hideShareModal}
                    onOpen={this.socialShareStore.hideImportEmailModal}
                    loading={!this.socialShareStore.url}
                    title={
                        this.socialShareStore.isImportEmailModalShown
                            ? gettext('Share via email')
                            : gettext('Share this course')
                    }
                >
                    <MarketplaceSocialShareContent
                        store={this.socialShareStore}
                        onFormCancel={this.socialShareStore.hideImportEmailModal}
                    />
                </Modal>,
            ];
        }
        return null;
    }

    @autobind
    selectFavorite() {
        this.props.course.enrollment.toggleFavorited();
        return keepMenuOpen();
    }

    renderFavorite() {
        const {enrollment} = this.props.course;
        return (
            <Dropdown.MenuItem
                data-purpose="toggle-favorite"
                icon={<RatingStarIcon label={false} />}
                onClick={this.selectFavorite}
            >
                {enrollment.favoritedTime ? gettext('Unfavorite') : gettext('Favorite')}
            </Dropdown.MenuItem>
        );
    }

    @autobind
    handleChange(event) {
        if (event.isIntersecting) {
            this.props.store.loadCollections();
        }
    }

    renderCollections() {
        const {store} = this.props;
        return [
            <div key="collections-heading" className="ud-heading-sm" styleName="menu-heading">
                {gettext('Lists')}
            </div>,
            <Dropdown.Menu
                key="collections-menu"
                iconAlignment="right"
                styleName="collections-menu"
            >
                {store.collections.map((collection, idx) => {
                    const item = (
                        <CollectionItem
                            collection={collection}
                            courseId={this.props.course.id}
                            trackingId={this.props.course.frontendTrackingId}
                            key={collection.id}
                            uiRegion={this.props.uiRegion}
                        />
                    );
                    if (idx === store.collections.length - 1) {
                        return (
                            <Observer key={item.key} onChange={this.handleChange}>
                                {item}
                            </Observer>
                        );
                    }
                    return item;
                })}
                {store.collectionsLoading && (
                    <Dropdown.MenuItem onClick={keepMenuOpen}>
                        <Loader block={true} />
                    </Dropdown.MenuItem>
                )}
                {!store.collections.length && !store.collectionsLoading && (
                    <Dropdown.MenuItem onClick={keepMenuOpen}>
                        <span styleName="subdued">{gettext('You have no list')}</span>
                    </Dropdown.MenuItem>
                )}
            </Dropdown.Menu>,
        ];
    }

    @autobind
    async onCollectionAddSuccess(collection) {
        try {
            await udApi.post(`/users/me/subscribed-courses-collections/${collection.id}/courses/`, {
                course: this.props.course.id,
            });
            showSuccessToast(
                interpolate(
                    gettext('%(courseTitle)s has been added to your list "%(collectionTitle)s."'),
                    {
                        courseTitle: this.props.course.title,
                        collectionTitle: collection.title,
                    },
                    true,
                ),
            );
            runInAction(() => {
                const existingCol = this.props.store.collections.find(
                    (col) => col.id === collection.id,
                );
                if (existingCol) {
                    existingCol.courses.push({_class: 'course', id: this.props.course.id});
                } else {
                    collection.courses = [{_class: 'course', id: this.props.course.id}];
                    this.props.store.collections.push(collection);
                    this.props.store.collections.replace(
                        this.props.store.collections.sort((a, b) => a.title.localeCompare(b.title)),
                    );
                }
                Tracker.publishEvent(
                    new LearningListItemSaveEvent({
                        listId: collection.list_id,
                        courseId: this.props.course.id,
                        trackingId: this.props.course.frontendTrackingId,
                        uiRegion: this.props.uiRegion,
                    }),
                );
            });
        } catch (error) {
            Raven.captureException(error);
        }
    }

    renderAddCollection() {
        return (
            <ModalTrigger
                trigger={
                    <Dropdown.MenuItem
                        data-purpose="add-collection"
                        icon={<ExpandPlusIcon label={false} />}
                    >
                        {gettext('Create New List')}
                    </Dropdown.MenuItem>
                }
                renderModal={(props) => (
                    <CollectionModal
                        {...props}
                        onCreateSuccess={this.onCollectionAddSuccess}
                        uiRegion={this.props.uiRegion}
                    />
                )}
            />
        );
    }

    @autobind
    onSelectListModal() {
        this.saveToListButtonStore.openModal();
    }

    @autobind
    removeCourseFromList() {
        const {collection} = this.props;
        this.saveToListButtonStore.removeFromList(collection.id, collection.title);
    }

    refreshSaveToListStoreIfStale() {
        const {course, uiRegion, gettext, interpolate} = this.props;
        // for collections tab, if courses are added to or removed from a collection with (un)shift,
        // the button store on the enrolled course card is stale with course previously at 0th position
        if (this.saveToListButtonStore.course.id !== course.id) {
            this.saveToListButtonStore = new SaveToListButtonStore(course, uiRegion, {
                gettext,
                interpolate,
            });
        }
    }

    renderSaveToList() {
        this.refreshSaveToListStoreIfStale();

        return [
            <Dropdown.MenuItem
                key="save-tolist-menu-item"
                data-purpose="save-to-list"
                icon={<ExpandPlusIcon color="inherit" label={false} />}
                onClick={this.onSelectListModal}
            >
                {gettext('Save course to list')}
            </Dropdown.MenuItem>,
            <SaveToListModal
                key="save-to-list-modal"
                saveToListButtonStore={this.saveToListButtonStore}
            />,
        ];
    }

    renderRemoveFromList() {
        this.refreshSaveToListStoreIfStale();

        return (
            <Dropdown.MenuItem
                data-purpose="remove-from-list"
                icon={<MinusOutlineIcon color="inherit" label={false} />}
                onClick={this.removeCourseFromList}
            >
                {gettext('Remove course from this list')}
            </Dropdown.MenuItem>
        );
    }

    @autobind
    onArchived() {
        this.props.store.removeCourse(this.props.course.id);
    }

    @autobind
    async selectArchive() {
        try {
            await this.props.course.enrollment.toggleArchived();
            this.onArchived();
        } catch (error) {
            Raven.captureException(error);
        }
    }

    renderArchive() {
        const {enrollment} = this.props.course;
        return (
            <Dropdown.MenuItem
                data-purpose="toggle-archived"
                icon={<FolderIcon label={false} />}
                onClick={this.selectArchive}
            >
                {enrollment.archivedTime ? gettext('Unarchive') : gettext('Archive')}
            </Dropdown.MenuItem>
        );
    }

    renderMarketplaceMenu() {
        switch (this.props.store.activeTab) {
            case 'learning_tab':
                return [
                    this.renderCollections(),
                    <Dropdown.Menu key="actions">
                        {this.renderShare()}
                        {this.renderAddCollection()}
                        {this.renderFavorite()}
                        {this.renderArchive()}
                    </Dropdown.Menu>,
                ];
            case 'collection_tab':
                return (
                    <Dropdown.Menu>
                        {this.renderSaveToList()}
                        {this.renderRemoveFromList()}
                    </Dropdown.Menu>
                );
            case 'archive_tab':
                return <Dropdown.Menu>{this.renderArchive()}</Dropdown.Menu>;
            case 'premium_tab':
                return [
                    this.renderCollections(),
                    <Dropdown.Menu key="actions">
                        {this.renderShare()}
                        {this.renderAddCollection()}
                    </Dropdown.Menu>,
                ];
            default:
                return null;
        }
    }

    render() {
        if (udConfig.brand.has_organization) {
            return createUFBContextMenu().getMyCoursesContextMenu(
                this.props.course,
                this.props.course.enrollment,
                {enableUBListExperiment: this.props.enableUBListExperiment},
                {onCourseArchived: this.onArchived},
            );
        }

        const menu = this.renderMarketplaceMenu();
        if (!menu) {
            return null;
        }

        const hasLargeMenu = ['learning_tab', 'premium_tab'].includes(this.props.store.activeTab);
        return (
            <Dropdown
                data-purpose="options-dropdown"
                placement="bottom-end"
                menuMaxHeight={hasLargeMenu ? 'none' : undefined}
                menuWidth={hasLargeMenu ? 'large' : 'medium'}
                trigger={
                    <IconButton size="small" udStyle="white-solid">
                        <MoreIcon label={gettext('Course options')} />
                    </IconButton>
                }
            >
                <div styleName="menu-container">{menu}</div>
            </Dropdown>
        );
    }
}

export default withI18n(OptionsMenu);
