import {FunnelLog} from '@udemy/funnel-tracking';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {InstructorCard} from 'browse/components/instructor-card/instructor-card.react-component';

import styles from './popular-instructors-unit.less';

@observer
export default class PopularInstructorsUnitDesktop extends Component {
    static propTypes = {
        titleId: PropTypes.string,
        className: PropTypes.string,
        onLoad: PropTypes.func,
        unit: PropTypes.object.isRequired,
        carouselProps: PropTypes.object,
        cardProps: PropTypes.object,
        showTitle: PropTypes.bool,
        alternateHeadline: PropTypes.shape({
            title: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        }),
        componentName: PropTypes.string.isRequired,
    };

    static defaultProps = {
        titleId: 'popularInstructorsHeading',
        className: undefined,
        onLoad: noop,
        cardProps: undefined,
        carouselProps: undefined,
        showTitle: true,
        alternateHeadline: undefined,
    };

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        const {
            titleId,
            className,
            unit,
            carouselProps,
            cardProps,
            showTitle,
            alternateHeadline,
            componentName,
        } = this.props;
        const instructors = unit.items;

        const {className: carouselClassName, ...restOfCarouselProps} = carouselProps ?? {};
        const {className: cardClassName, ...restOfCardProps} = cardProps ?? {};

        return (
            <div className={className}>
                <section aria-labelledby={titleId}>
                    {showTitle && (
                        <h2
                            id={titleId}
                            className={classNames('ud-heading-xl', styles['unit-title'])}
                            data-purpose="title"
                        >
                            {unit.title}
                        </h2>
                    )}
                    {!showTitle && alternateHeadline && (
                        <AlternateHeadline titleTag="h2" titleId={titleId} {...alternateHeadline} />
                    )}
                    <Carousel
                        showPager={true}
                        className={classNames(
                            carouselClassName ?? '',
                            styles['instructor-grid-columns'],
                        )}
                        {...restOfCarouselProps}
                    >
                        {instructors.map((instructor, idx) => (
                            <FunnelLog key={idx} item={{id: `instructor|${instructor.id}`}}>
                                <InstructorCard
                                    instructor={instructor}
                                    className={classNames(
                                        cardClassName ?? '',
                                        styles['instructor-card-container'],
                                    )}
                                    withContainer={true}
                                    index={idx}
                                    componentName={componentName}
                                    {...restOfCardProps}
                                />
                            </FunnelLog>
                        ))}
                    </Carousel>
                </section>
            </div>
        );
    }
}
