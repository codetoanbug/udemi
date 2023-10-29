import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useState} from 'react';

import {BackendSourceOptions, discoveryTracker} from '@udemy/browse-event-tracking';
import {AvailableFiltersUnit} from '@udemy/discovery-api';
import {generateTrackingId, TrackImpression} from '@udemy/event-tracking';
import {useFormatNumber, useI18n} from '@udemy/i18n';
import {TextSkeleton} from '@udemy/react-reveal-components';
import {Carousel} from '@udemy/react-structure-components';

import {MultilineInputPill} from '../multiline-input-pill/multiline-input-pill.react-component';
import styles from './skill-filters.module.less';

/** The React prop interface for `SkillFilters` */
export interface SkillFiltersProps {
    /**
     * The default selected value of the radio group. If not provided, it will
     * default to the first available filter.
     */
    defaultSelectedValue?: number;
    /** The name attribute used for the underline HTML radio group */
    radioGroupName: string;
    /** A list of available filters for the `SkillFilters` */
    filters: AvailableFiltersUnit;
    /** Handle selection of radio filter */
    handleChange: (url: string) => void;
}

/**
 *
 * ### SkillFilters
 *
 * A group of `MultilineInputPill`s that serve as a radio group.
 */
export const SkillFilters = observer(
    ({defaultSelectedValue, radioGroupName, filters, handleChange}: SkillFiltersProps) => {
        const {gettext, interpolate} = useI18n();
        const {formatNumber} = useFormatNumber();
        const [selectedValue, setSelectedValue] = useState(
            defaultSelectedValue ?? filters.available_filters?.units[0].label_id,
        );

        const handleRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(parseInt(event.target.value));
            handleChange(event.target.dataset.url as string);
        };

        const roundToNearestHundredth = (num: number) => {
            return Math.floor(num / 100) * 100;
        };

        const abbreviateEnrollment = (num_enrollments: number) => {
            if (num_enrollments >= 1000000) {
                const numString = num_enrollments.toString();
                const numLength = numString.length;
                const digits = numLength % 3 || 3;
                const firstPart = numString.substring(0, digits);
                const remainder = numString.substring(digits, 1);
                const abbreviation = `${firstPart}.${remainder}`;

                return interpolate(
                    gettext('%(num_enrollments)sM+ learners'),
                    {
                        num_enrollments: formatNumber(abbreviation),
                    },
                    true,
                );
            }
            return interpolate(
                gettext('%(num_enrollments)s+ learners'),
                {
                    num_enrollments: formatNumber(roundToNearestHundredth(num_enrollments)),
                },
                true,
            );
        };

        const renderEnrollments = (num_enrollments: number | undefined) => {
            if (num_enrollments) {
                return (
                    <div data-testid="num-enrollments">{abbreviateEnrollment(num_enrollments)}</div>
                );
            }
            return (
                <TextSkeleton
                    className={styles['enrollments-loading']}
                    lineCountPerParagraph={1}
                    paragraphCount={1}
                />
            );
        };

        const getTrackingParams = (unit: AvailableFiltersUnit, index: number) => {
            // Impression and Click events tracking id must be the same
            const trackingId = generateTrackingId();
            return {
                item: {
                    id: unit.label_id as number,
                    title: unit.title,
                    type: 'course_topic',
                    frontendTrackingId: trackingId,
                },
                trackingContext: {
                    backendSource: BackendSourceOptions.DISCOVERY,
                    index: index + 1,
                    uiRegion: 'all_skills_topics',
                },
            };
        };

        return (
            <div className={styles.wrapper}>
                <Carousel
                    ariaLabel={gettext('Topic Filters')}
                    pagerButtonClassName={classNames('ud-btn-white-solid', styles.pagers)}
                >
                    {filters.available_filters?.units.map((unit, index) => {
                        const trackingParams = getTrackingParams(unit, index);
                        return (
                            <TrackImpression
                                trackFunc={() =>
                                    discoveryTracker.trackDiscoveryImpression(
                                        {item: trackingParams.item},
                                        trackingParams.trackingContext,
                                    )
                                }
                                key={`pill-${index}`}
                            >
                                <div>
                                    <MultilineInputPill
                                        key={index}
                                        data-url={unit.url}
                                        title={unit.title}
                                        subtitle={renderEnrollments(unit.num_enrollments)}
                                        value={unit.label_id}
                                        name={radioGroupName}
                                        type="radio"
                                        checked={selectedValue === unit.label_id}
                                        onChange={handleRadioGroupChange}
                                        onClick={() =>
                                            discoveryTracker.trackDiscoveryItemClickEvent(
                                                {item: trackingParams.item},
                                                trackingParams.trackingContext,
                                            )
                                        }
                                    />
                                </div>
                            </TrackImpression>
                        );
                    })}
                </Carousel>
            </div>
        );
    },
);
