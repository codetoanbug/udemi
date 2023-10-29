import {Tracker, TrackImpression} from '@udemy/event-tracking';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {TextSkeleton} from '@udemy/react-reveal-components';
import React, {useEffect, useState} from 'react';

import {useMatchMediaClientOnly} from 'base-components/responsive/match-media.react-component';
import {RelatedSearchesImpressionEvent, RelatedSearchesItemClickEvent} from 'browse/events';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import './related-searches.less';

interface RelatedSearch {
    tracking_id: string;
    phrase: string;
}

interface RelatedSearchesProps {
    searchQuery: string;
    searchTrackingId: string;
    boostedLanguage: string;
}

export const RelatedSearches = ({
    searchQuery,
    searchTrackingId,
    boostedLanguage,
}: RelatedSearchesProps) => {
    const isDesktop = useMatchMediaClientOnly('lg-min');
    const [relatedSearches, setRelatedSearches] = useState<Array<RelatedSearch> | null>(null);
    const [resultTrackingId, setResultTrackingId] = useState('');

    useEffect(() => {
        const isAborted = (err: Error) => {
            return err.message === 'canceled';
        };
        let isMounted = true;
        const controller = new AbortController();
        udApi
            .get('/related-searches/', {
                params: {
                    q: searchQuery,
                    search_tracking_id: searchTrackingId,
                    boosted_language: boostedLanguage,
                },
                signal: controller.signal,
            })
            .then(({data}) => {
                const relatedSearches: RelatedSearch[] = data?.related_searches;
                if (isMounted && relatedSearches) {
                    setRelatedSearches(data.related_searches);
                    setResultTrackingId(data.tracking_id);
                } else {
                    throw new Error('No related searches data');
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setRelatedSearches([]);
                }
                if (!isAborted(err)) {
                    Raven.captureException(err.message);
                }
            });

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [searchQuery, searchTrackingId, boostedLanguage]);

    if (!relatedSearches) {
        return (
            <TextSkeleton
                styleName="related-searches-loader"
                withTitle={true}
                lineCountPerParagraph={2}
            />
        );
    }

    if (relatedSearches.length < 3) {
        return null;
    }

    const relatedSearchesItemLimit = isDesktop ? 12 : 9;
    const displayableRelatedSearches = relatedSearches.slice(0, relatedSearchesItemLimit);

    return (
        <div>
            <div styleName="related-searches-heading">
                <span className="ud-heading-lg">{gettext('Related searches')}</span>
                <Popover
                    styleName="related-searches-info-popper"
                    canToggleOnHover={true}
                    placement="right-start"
                    withArrow={false}
                    trigger={<InfoIcon styleName="related-searches-info-icon" label={false} />}
                >
                    <span className="ud-heading-sm">{gettext('About these results')}</span>
                    <p className="ud-text-sm">
                        {gettext(
                            'Explore results for similar search terms from students like you.',
                        )}
                    </p>
                </Popover>
            </div>
            <TrackImpression
                trackFunc={() =>
                    Tracker.publishEvent(new RelatedSearchesImpressionEvent(resultTrackingId))
                }
            >
                <div styleName="related-searches-buttons">
                    {displayableRelatedSearches.map(
                        ({tracking_id: trackingId, phrase}: RelatedSearch) => {
                            const searchParams = new URLSearchParams({
                                q: phrase,
                                src: 'rts',
                                previous_search_tracking_id: searchTrackingId,
                            });
                            return (
                                <a
                                    data-purpose="related-search-link"
                                    key={trackingId}
                                    href={`?${searchParams.toString()}`}
                                    onClick={() => {
                                        setRelatedSearches(null);
                                        Tracker.publishEvent(
                                            new RelatedSearchesItemClickEvent(
                                                trackingId,
                                                resultTrackingId,
                                            ),
                                        );
                                    }}
                                >
                                    <Button
                                        size="small"
                                        round={true}
                                        styleName="related-searches-button"
                                    >
                                        {phrase}
                                    </Button>
                                </a>
                            );
                        },
                    )}
                </div>
            </TrackImpression>
        </div>
    );
};

RelatedSearches.defaultProps = {
    searchQuery: '',
    searchTrackingId: '',
    boostedLanguage: '',
};
