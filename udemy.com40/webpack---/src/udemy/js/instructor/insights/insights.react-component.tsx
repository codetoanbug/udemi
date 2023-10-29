import {observer} from 'mobx-react';
import React from 'react';

import InfoTiles from '../info-tiles.react-component';
import './localization/supply-gaps-i10n';

export const Insights = observer(() => {
    const insightsTiles = [
        {
            url: '/instructor/opportunities',
            label: gettext('Udemy Business content opportunities'),
            info: gettext(
                'View content opportunities based on demand from professional learners and their employers.',
            ),
            trackEvent: 'content_opportunities',
            openInNewTab: false,
            centerText: true,
            expressiveIcon: 'learning-delivery',
            dataPurpose: 'content-opportunities',
        },
        {
            url: '/instructor/marketplace-insights/',
            label: gettext('Marketplace Insights'),
            info: gettext('Get Udemy-wide market data to create successful courses.'),
            trackEvent: 'marketplace_insights',
            openInNewTab: true,
            centerText: true,
            expressiveIcon: 'streak-flame',
            dataPurpose: 'marketplace-insights',
        },
    ];
    return (
        <div data-purpose={'insights-component'}>
            <h1 className="instructor-main-heading ud-heading-serif-xxl">{gettext('Insights')}</h1>
            <InfoTiles>
                {insightsTiles.map((tile) => (
                    <InfoTiles.Tile {...tile} key={tile.url} trackPage="insights" />
                ))}
            </InfoTiles>
        </div>
    );
});
