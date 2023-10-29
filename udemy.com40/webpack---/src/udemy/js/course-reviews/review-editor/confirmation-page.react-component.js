import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {SOURCE_PAGES} from 'share/constants';
import MarketplaceSocialShareButton from 'share/marketplace-social-share-button.react-component';
import * as marketplaceSocialShareLazilyLoadedModule from 'share/marketplace-social-share-lazily-loaded';
import SocialShareStore from 'share/social-share.mobx-store';

import IndividualReview from '../display/individual-review.react-component';

import './confirmation-page.less';

const HIGH_RATING_THRESHOLD = 4.0;

@inject(({renderSocialShareButton}) => ({renderSocialShareButton}))
@observer
export default class ConfirmationPage extends Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        reviewText: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        user: PropTypes.object.isRequired,
        /** When ReviewEditor is inside Modal, we inject custom MarketplaceSocialShareButton
            to avoid rendering Modal inside Modal. */
        renderSocialShareButton: PropTypes.func,
    };

    static defaultProps = {
        renderSocialShareButton: (socialShareStore) => (
            <MarketplaceSocialShareButton
                context={socialShareStore.context}
                fullWidth={false}
                load={() => Promise.resolve(marketplaceSocialShareLazilyLoadedModule)}
                shareableObject={socialShareStore.shareableObject}
                sourceUrl={socialShareStore.sourceUrl}
            />
        ),
    };

    constructor(props) {
        super(props);
        this.socialShareStore = new SocialShareStore(
            {
                id: props.course.id,
                type: 'course',
                is_private: props.course.is_private,
                title: props.course.title,
            },
            props.course.url,
            SOURCE_PAGES.HIGH_RATING,
        );
    }

    render() {
        const {reviewText, rating, user, renderSocialShareButton} = this.props;

        return (
            <>
                <p styleName="text-center" data-purpose="public-review-notice">
                    {gettext('Your review will be public within 24 hours.')}
                </p>
                <div styleName="review-container">
                    <IndividualReview
                        data-purpose="review-preview"
                        review={{content: reviewText, rating, user}}
                    />
                </div>
                {rating >= HIGH_RATING_THRESHOLD && (
                    <div styleName="text-center">
                        {renderSocialShareButton(this.socialShareStore)}
                    </div>
                )}
            </>
        );
    }
}
