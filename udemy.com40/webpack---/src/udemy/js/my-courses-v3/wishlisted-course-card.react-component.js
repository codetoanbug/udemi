import {getCourseBadgeFromBadgesFamily} from '@udemy/browse-course';
import {trackGenericCourseClick, TrackImpression} from '@udemy/event-tracking';
import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import {CourseCard, APICourseCard, imagePropsFrom} from '@udemy/react-card-components';
import {IconButton} from '@udemy/react-core-components';
import {CourseDetailsQuickViewBox} from '@udemy/react-discovery-units';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {StaticPriceText} from 'base-components/price-text/static-price-text.react-component';
import withMatchMediaClientOnly from 'base-components/responsive/match-media.react-component';
import {pricePropsFromWithTracking} from 'base-components/ungraduated/api-course-card/price';
import {UnwishlistedIcon} from 'browse/components/wishlist/unwishlisted-icon.react-component';
import getConfigData from 'utils/get-config-data';

import './wishlisted-course-card.less';

const udConfig = getConfigData();

@withMatchMediaClientOnly({isSmMax: 'sm-max', canHover: '(hover: hover)'})
@inject(({trackingContext = {}, showWishlistedCourseQuickViewBox = false}) => ({
    trackingContext,
    showWishlistedCourseQuickViewBox,
}))
@observer
export default class WishlistedCourseCard extends Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        trackingContext: PropTypes.shape({
            trackImpressionFunc: PropTypes.func,
        }).isRequired,
        isSmMax: PropTypes.bool.isRequired,
        canHover: PropTypes.bool.isRequired,
        showWishlistedCourseQuickViewBox: PropTypes.bool.isRequired,
    };

    @autobind
    trackImpression() {
        const {trackImpressionFunc, ...trackingContext} = this.props.trackingContext;
        trackImpressionFunc({item: this.props.course}, trackingContext);
    }

    @autobind
    trackClick() {
        trackGenericCourseClick({
            courseId: this.props.course.id,
            courseTrackingId: this.props.course.frontendTrackingId || this.props.course.tracking_id,
            componentName: 'wishlistedCourseCard',
        });
    }

    renderWishlistButton() {
        if (!udConfig.features.wishlist) {
            return null;
        }

        const {isWishlisted, isWishlisting, toggleIsWishlisted} = this.props.course;
        const WishlistIcon = isWishlisted ? WishlistedIcon : UnwishlistedIcon;
        const label = isWishlisted ? gettext('Remove from Wishlist') : gettext('Add to Wishlist');
        const loader = isWishlisting && <Loader color="inherit" size="medium" />;
        return (
            <IconButton
                udStyle="ghost"
                size="medium"
                onClick={toggleIsWishlisted}
                styleName="wishlist-button"
            >
                {loader || <WishlistIcon label={label} size="medium" />}
            </IconButton>
        );
    }

    render() {
        const {
            course,
            trackingContext,
            showWishlistedCourseQuickViewBox,
            canHover,
            isSmMax,
        } = this.props;

        const courseCard = (
            <APICourseCard
                headline={course.headline}
                titleProps={{course, url: course.url}}
                badgesProps={{course, badges: getCourseBadgeFromBadgesFamily}}
                image={
                    <>
                        <CourseCard.Image {...imagePropsFrom({course})} styleName="image" />
                        <div styleName="image-overlay" />
                    </>
                }
                instructorsProps={{course}}
                ratingsProps={{course}}
                price={<StaticPriceText {...pricePropsFromWithTracking({course})} />}
                detailsProps={{course}}
                onClick={this.trackClick}
                onContextMenu={this.trackClick}
            />
        );

        const card = (
            <div data-purpose={`wishlisted-course-card-${course.id}`} styleName="container">
                {canHover && showWishlistedCourseQuickViewBox ? (
                    <CourseDetailsQuickViewBox
                        course={course}
                        courseCard={courseCard}
                        showCta={true}
                        placement={isSmMax ? 'bottom' : 'right'}
                    />
                ) : (
                    <>
                        {courseCard}
                        {this.renderWishlistButton()}
                    </>
                )}
            </div>
        );

        if (!trackingContext.trackImpressionFunc) {
            return card;
        }

        return <TrackImpression trackFunc={this.trackImpression}>{card}</TrackImpression>;
    }
}
