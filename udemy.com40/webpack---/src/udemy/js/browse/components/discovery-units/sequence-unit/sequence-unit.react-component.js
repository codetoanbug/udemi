import {TrackingContextProvider} from '@udemy/event-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {CourseDetailsQuickViewBoxLazy, UnitTitle} from '@udemy/react-discovery-units';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import BrowseCourseCard from 'browse/components/course-card/browse-course-card.react-component';
import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker, attachFrontendTrackingIds} from 'browse/tracking';

import styles from './sequence-unit.less';

@withMatchMedia({
    isMobileMax: 'mobile-max',
    hasCoarsePointer: '(any-pointer: coarse)',
    hasFinePointer: '(any-pointer: fine)',
})
class SequenceUnit extends React.Component {
    static propTypes = {
        unit: PropTypes.object.isRequired,
        className: PropTypes.string,
        outerTitle: PropTypes.string,
        showSubtitle: PropTypes.bool,
        isMobileMax: PropTypes.bool,
        hasCoarsePointer: PropTypes.bool,
        hasFinePointer: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        pgettext: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        className: null,
        outerTitle: null,
        showSubtitle: true,
        isMobileMax: null,
        hasCoarsePointer: null,
        hasFinePointer: null,
    };

    componentDidMount() {
        attachFrontendTrackingIds(this.props.unit.items);
    }

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;

    get outerTitle() {
        // don't set this as a default prop bc we can't have gettext in isorendering
        return (
            this.props.outerTitle ||
            pgettext('E.g. a predefined series of courses', 'Learning series')
        );
    }

    render() {
        const {
            unit,
            className,
            showSubtitle,
            isMobileMax,
            hasCoarsePointer,
            hasFinePointer,
        } = this.props;

        const learningSeriesId = unit.source_objects.length > 0 ? unit.source_objects[0].id : '';
        const exploreButtonProps = {
            'data-purpose': 'explore-button',
            componentClass: 'a',
            udStyle: 'primary',
            size: 'large',
            href: `/courses/learning-series/${learningSeriesId}/`,
            className: styles['explore-button'],
        };
        const buttonCta = gettext('Explore series');

        const unitTitleProps = {...unit};
        if (!isMobileMax) {
            unitTitleProps.actionLink = {
                text: buttonCta,
                buttonProps: {...exploreButtonProps},
            };
        }

        return (
            <div className={className}>
                <h2 className="ud-heading-xl">{this.outerTitle}</h2>
                {showSubtitle && (
                    <div className={classNames('ud-text-md', styles['secondary-header'])}>
                        {gettext(
                            'A topic-based collection of courses, based on the patterns of other learners',
                        )}
                    </div>
                )}

                <div className={styles.wrapper}>
                    <UnitTitle unit={unitTitleProps} />
                    <div className={classNames('ud-heading-md', styles['courses-count'])}>
                        {ninterpolate('%s course', '%s courses', unit.items.length)}
                    </div>
                    {unit.description && <p className={styles.description}>{unit.description}</p>}
                    <Carousel
                        allowScroll={hasCoarsePointer}
                        showPager={hasFinePointer}
                        className={styles.grid}
                    >
                        {unit.items.map((course, index) => {
                            return (
                                <TrackingContextProvider
                                    key={course.id}
                                    trackingContext={{
                                        trackImpressionFunc:
                                            discoveryTracker.trackDiscoveryImpression,
                                        index,
                                        backendSource: this.backendSource,
                                    }}
                                >
                                    <>
                                        <div className={styles['order-line']}>
                                            <span className={('ud-heading-xs', styles.order)}>
                                                {index + 1}
                                            </span>
                                            <div className={styles['connector-bar']} />
                                        </div>
                                        <CourseDetailsQuickViewBoxLazy
                                            course={course}
                                            courseCard={
                                                <BrowseCourseCard
                                                    className={styles['course-card']}
                                                    course={course}
                                                    renderInstructorContent={noop}
                                                    renderPriceText={noop}
                                                    showBadges={false}
                                                    showDetails={false}
                                                />
                                            }
                                            showPrice={true}
                                        />
                                    </>
                                </TrackingContextProvider>
                            );
                        })}
                    </Carousel>
                    {isMobileMax && <Button {...exploreButtonProps}>{buttonCta}</Button>}
                </div>
            </div>
        );
    }
}

export default withI18n(SequenceUnit);
