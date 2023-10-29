import {TrackImpression} from '@udemy/event-tracking';
import {FunnelLog} from '@udemy/funnel-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {UnitTitle} from '@udemy/react-discovery-units';
import {PillGroup} from '@udemy/react-navigation-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';

import styles from './popular-topics-unit.less';

@withMatchMedia({isMobileMax: 'mobile-max'})
export default class PopularTopicsUnit extends Component {
    static propTypes = {
        className: PropTypes.string,
        onLoad: PropTypes.func,
        showTitle: PropTypes.bool,
        titleTypography: PropTypes.string,
        unit: PropTypes.shape({
            title: PropTypes.string.isRequired,
            items: MobxPropTypes.arrayOrObservableArray,
        }).isRequired,
        trackImpression: PropTypes.func,
        trackTopicClick: PropTypes.func,
        isMobileMax: PropTypes.bool,
    };

    static defaultProps = {
        className: undefined,
        showTitle: true,
        titleTypography: undefined,
        onLoad: noop,
        trackImpression: undefined,
        trackTopicClick: undefined,
        isMobileMax: null,
    };

    componentDidMount() {
        this.props.onLoad();
    }

    handleClick = (topicId, topicName) => {
        if (!this.props.trackTopicClick) {
            return;
        }
        this.props.trackTopicClick(topicId, topicName);
    };

    renderMobileTag(item) {
        return (
            <FunnelLog key={item.id} item={{id: `cl|${item.id}`}}>
                <PillGroup.Pill
                    componentClass="a"
                    href={item.url}
                    size="medium"
                    onClick={() => this.handleClick(item.id, item.title)}
                >
                    {item.title}
                </PillGroup.Pill>
            </FunnelLog>
        );
    }

    /**
     * Tags are rendered in two rows via a "zigzag" pattern according to relevance. We end up with the
     * most relevant tags being rendered on the left, with relevance decreasing as we move to the right.
     *
     * Visual example (number indicates relevance ranking):
     * tag-0  tag-2  tag-4
     *    tag-1   tag-3
     */
    renderMobileLinkTags() {
        const {unit} = this.props;

        const topRowItems = [];
        const bottomRowItems = [];
        unit.items.forEach((item, i) => {
            if (i % 2 === 0) {
                topRowItems.push(this.renderMobileTag(item));
            } else {
                bottomRowItems.push(this.renderMobileTag(item));
            }
        });

        return (
            <div
                className={classNames(
                    'ud-full-viewport-container',
                    styles['mobile-tags-container'],
                )}
            >
                <PillGroup className={styles['mobile-tags-row']} data-purpose="mobile-tags-row">
                    {topRowItems}
                </PillGroup>
                <PillGroup className={styles['mobile-tags-row']} data-purpose="mobile-tags-row">
                    {bottomRowItems}
                </PillGroup>
            </div>
        );
    }

    renderDesktopLinkTags() {
        const {unit} = this.props;

        const carouselStyles = classNames(styles.carousel, {
            [styles['single-row']]: unit.items.length < 10,
        });

        return (
            <Carousel
                className={classNames('popular-topics-unit-carousel', carouselStyles)}
                showPager={true}
            >
                {unit.items.map((item) => (
                    <FunnelLog key={item.id} item={{id: `cl|${item.id}`}}>
                        <a
                            href={item.url}
                            className={classNames('ud-heading-md', styles['topic-tag'])}
                            onClick={() => this.handleClick(item.id, item.title)}
                        >
                            {item.title}
                        </a>
                    </FunnelLog>
                ))}
            </Carousel>
        );
    }

    renderTopics() {
        const {unit, className, showTitle, titleTypography, isMobileMax} = this.props;
        return (
            <div className={className}>
                {showTitle && <UnitTitle unit={unit} typography={titleTypography} />}
                {isMobileMax ? this.renderMobileLinkTags() : this.renderDesktopLinkTags()}
            </div>
        );
    }

    render() {
        return (
            <>
                {this.props.trackImpression ? (
                    <TrackImpression trackFunc={this.props.trackImpression}>
                        {this.renderTopics()}
                    </TrackImpression>
                ) : (
                    this.renderTopics()
                )}
            </>
        );
    }
}
