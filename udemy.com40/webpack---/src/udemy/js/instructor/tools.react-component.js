import DataInsightIcon from '@udemy/icons/dist/data-insight.ud-icon';
import OfferIcon from '@udemy/icons/dist/offer.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import InfoTiles from './info-tiles.react-component';

export default class Tools extends Component {
    static propTypes = {
        isInSupplyGapsTargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        isInSupplyGapsTargetGroup: false,
    };

    TOOLS_TILES = this.getToolsTiles();

    getToolsTiles() {
        const toolsTiles = [];
        toolsTiles.push({
            url: '/home/teaching/test-video/',
            icon: VideoIcon,
            label: gettext('Test Video'),
            info: gettext(
                'Get free feedback from Udemy video experts on your audio, video, and delivery.',
            ),
            trackEvent: 'test_video',
            openInNewTab: true,
            dataPurpose: 'test-video',
        });
        if (!this.props.isInSupplyGapsTargetGroup) {
            toolsTiles.push({
                url: '/instructor/marketplace-insights/',
                icon: DataInsightIcon,
                label: gettext('Marketplace Insights'),
                info: gettext('Get Udemy-wide market data to create successful courses.'),
                trackEvent: 'marketplace_insights',
                openInNewTab: true,
                dataPurpose: 'marketplace-insights',
            });
        }
        toolsTiles.push({
            url: '/instructor/multiple-coupons-creation/',
            icon: OfferIcon,
            label: gettext('Bulk coupon creation'),
            info: gettext('Create multiple coupons at once via CSV upload.'),
            trackEvent: 'multiple_coupons_creation',
            openInNewTab: true,
            dataPurpose: 'bulk-coupon-creation',
        });

        return toolsTiles;
    }

    render() {
        return (
            <div>
                <h1 className="instructor-main-heading ud-heading-serif-xxl">{gettext('Tools')}</h1>
                <InfoTiles>
                    {this.TOOLS_TILES.map((tile) => (
                        <InfoTiles.Tile {...tile} key={tile.url} trackPage="tools" />
                    ))}
                </InfoTiles>
            </div>
        );
    }
}
