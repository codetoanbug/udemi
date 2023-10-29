import {getUniqueId} from '@udemy/design-system-utils';
import ShareIcon from '@udemy/icons/dist/share.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {REVIEW_MODAL_CONTENT_TYPE} from 'course-reviews/common/alt-leave-rating.mobx-store';
import IndividualReview from 'course-reviews/display/individual-review.react-component';
import ReviewEditor from 'course-reviews/review-editor/review-editor.react-component';
import MarketplaceSocialShareContent from 'share/marketplace-social-share-content.react-component';

import '../review-editor/review-editor.less';

@observer
export default class ReviewModal extends Component {
    static propTypes = {
        leaveRatingStore: PropTypes.object.isRequired,
    };

    titleId = getUniqueId('review-modal-title');

    @autobind
    onEditClick() {
        const {leaveRatingStore: store} = this.props;
        store.initReviewEditor(store.review);
        store.onShowReviewEditor();
    }

    @autobind
    renderSocialShareButton(socialShareStore) {
        if (!socialShareStore.isMarketplaceShareEnabled) {
            return null;
        }

        return (
            <Button
                onClick={() => this.props.leaveRatingStore.onShowShareModal(socialShareStore)}
                size="medium"
                udStyle="secondary"
                data-purpose="social-share-button"
            >
                {gettext('Share')}
                <ShareIcon label={false} />
            </Button>
        );
    }

    renderDeleteConfirmation() {
        const {leaveRatingStore: store} = this.props;
        return (
            <>
                <p>{gettext('Are you sure you want to delete your review?')}</p>
                <FooterButtons>
                    <Button
                        data-purpose="cancel-delete-button"
                        udStyle="ghost"
                        onClick={store.onShowEditModal}
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button data-purpose="delete-button-confirm" onClick={store.onDeleteReview}>
                        {gettext('Yes, Delete My Review')}
                    </Button>
                </FooterButtons>
            </>
        );
    }

    renderDialog() {
        const {leaveRatingStore: store} = this.props;
        return (
            <>
                <IndividualReview review={store.review} previewMode={true} />
                <FooterButtons>
                    <Button
                        data-purpose="delete-button"
                        udStyle="ghost"
                        onClick={store.onShowDeleteModal}
                    >
                        {gettext('Delete')}
                    </Button>
                    <Button data-purpose="edit-button" onClick={this.onEditClick}>
                        {gettext('Edit Review')}
                    </Button>
                </FooterButtons>
            </>
        );
    }

    render() {
        const {leaveRatingStore: store} = this.props;
        let titleProps = {title: ''};
        let body = null;
        if (store.modalContentType === REVIEW_MODAL_CONTENT_TYPE.CREATE_OR_EDIT) {
            titleProps = {title: '', renderTitle: () => [this.titleId, null]};
            body = (
                <Provider renderSocialShareButton={this.renderSocialShareButton}>
                    <ReviewEditor
                        store={store.reviewEditorStore}
                        onCancelReview={store.onHideReviewEditor}
                        titleId={this.titleId}
                    />
                </Provider>
            );
        } else if (store.modalContentType === REVIEW_MODAL_CONTENT_TYPE.EDIT_OR_DELETE) {
            titleProps = {title: gettext('Your Review')};
            body = this.renderDialog();
        } else if (store.modalContentType === REVIEW_MODAL_CONTENT_TYPE.DELETE) {
            titleProps = {title: gettext('Delete Your Review?')};
            body = this.renderDeleteConfirmation();
        } else if (store.modalContentType === REVIEW_MODAL_CONTENT_TYPE.SHARE) {
            titleProps = {title: '', renderTitle: () => [this.titleId, null]};
            body = (
                <>
                    <div styleName="top-buttons-container">
                        <Button udStyle="ghost" size="medium" onClick={store.onShowReviewEditor}>
                            {gettext('Back')}
                        </Button>
                    </div>
                    <div styleName="main-header">
                        <h2 className="ud-heading-xl" id={this.titleId}>
                            {store.socialShareStore.isImportEmailModalShown
                                ? gettext('Share via email')
                                : gettext('Share this course')}
                        </h2>
                    </div>
                    <MarketplaceSocialShareContent
                        store={store.socialShareStore}
                        onFormCancel={store.socialShareStore.hideImportEmailModal}
                    />
                </>
            );
        }

        return (
            <Modal
                isOpen={store.isModalOpen}
                onClose={store.closeModalAndFinishReview}
                {...titleProps}
                data-purpose="review-modal"
            >
                {body}
            </Modal>
        );
    }
}
