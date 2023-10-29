import Observer from '@researchgate/react-intersection-observer';
import autobind from 'autobind-decorator';
import React, {Component, ComponentType} from 'react';

interface TrackImpressionProps {
    /**
     * Callback function to be triggered when the component
     * is viewed
     */
    trackFunc: () => void;
    /**
     * Whether to trigger only once, or trigger every time
     * the wrapped component enters the viewport
     */
    onlyOnce: boolean;
    /**
     * At what proportion of component's visibility the
     * callback should be executed
     */
    visibilityThreshold: number;
    /**
     * How long in ms should the component keep being visible
     * before the callback is executed
     */
    minDuration: number;
    /**
     * Set of values (% or px) to grow/shrink the root element's bounding box before the intersection is computed.
     */
    rootMargin: string;

    /**
     * Accepting the same children as Observer
     */
    children?: React.ComponentProps<typeof Observer>['children'];

    /**
     * Is this a development environment
     */
    isDev?: boolean;
}

export class TrackImpression extends Component<TrackImpressionProps> {
    static displayName = 'TrackImpression';

    static defaultProps = {
        onlyOnce: true,
        // setting the visibilityThreshold to 1 causes some children to never intersect;
        // not sure why, but .99 seems to fix it well enough
        visibilityThreshold: 0.99,
        minDuration: 500,
        rootMargin: '0px 0px 0px',
    };

    componentWillUnmount() {
        clearTimeout(this.recordedTimeout);
    }

    recordedTimeout!: ReturnType<typeof setTimeout>;

    @autobind
    handleIntersection(event: IntersectionObserverEntry, unobserve: () => void) {
        const {trackFunc, onlyOnce, visibilityThreshold, minDuration} = this.props;
        if (event.isIntersecting && event.intersectionRatio >= visibilityThreshold) {
            this.recordedTimeout = setTimeout(() => {
                if (onlyOnce) {
                    unobserve();
                }
                trackFunc();
            }, minDuration);
        } else {
            clearTimeout(this.recordedTimeout);
        }
    }

    render() {
        const {children, isDev} = this.props;

        if (
            isDev === true &&
            children &&
            React.Children.count(children) === 1 &&
            (React.Children.only(children)?.type as ComponentType).displayName ===
                TrackImpression.displayName
        ) {
            // In order to prevent a bug caused by nested Observers.
            // Details on https://udemy.slack.com/archives/C1TGV7X6F/p1600291892030700
            // and https://github.com/udemy/website-django/pull/46416
            throw Error(
                'Nesting TrackImpression components without a div in between is not allowed. Details in code',
            );
        }

        return (
            <Observer
                onChange={this.handleIntersection}
                threshold={this.props.visibilityThreshold}
                rootMargin={this.props.rootMargin}
            >
                {children}
            </Observer>
        );
    }
}
