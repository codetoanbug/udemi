import {Avatar} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import InstructorResponse from './instructor-response.react-component';
import './individual-review.less';

@observer
export default class IndividualReview extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        renderContent: PropTypes.func,
        previewMode: PropTypes.bool,
    };

    static defaultProps = {
        renderContent: (content) => content.split(/\n+/).map((l, i) => <p key={i}>{l}</p>),
        previewMode: false,
    };

    renderReviewContent() {
        const {renderContent, review} = this.props;

        if (review.content === '') {
            return (
                <div styleName="comment-content" data-purpose="review-comment-content">
                    {gettext('There are no written comments for your review.')}
                </div>
            );
        }

        return (
            <div styleName="comment-content">
                <ShowMore collapsedHeight={200} withGradient={true}>
                    <div data-purpose="review-comment-content">{renderContent(review.content)}</div>
                </ShowMore>
            </div>
        );
    }

    render() {
        const {previewMode, review, renderContent} = this.props;

        return (
            <div styleName={classNames('container', {'container-preview-mode': previewMode})}>
                {!previewMode && (
                    <Avatar
                        size="medium"
                        srcKey="image_50x50"
                        alt="NONE"
                        user={review.user}
                        data-purpose="review-author-avatar"
                    />
                )}
                <div styleName="flex detail-container">
                    {!previewMode && (
                        <div styleName="detail-user-name" data-purpose="review-detail-user-name">
                            <div styleName="ellipsis">{review.user.display_name}</div>
                        </div>
                    )}
                    <div styleName="flex rating">
                        <div styleName="stars">
                            <StarRating rating={review.rating} size="large" />
                        </div>
                        {this.renderReviewContent()}
                    </div>
                </div>
                <InstructorResponse response={review.response} renderContent={renderContent} />
            </div>
        );
    }
}
