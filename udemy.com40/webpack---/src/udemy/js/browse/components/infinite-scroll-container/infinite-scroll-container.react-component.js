import Observer from '@researchgate/react-intersection-observer';
import PropTypes from 'prop-types';
import React from 'react';

export default class InfiniteScrollContainer extends React.Component {
    static propTypes = {
        onFirstChildEnter: PropTypes.func,
        onLastChildEnter: PropTypes.func.isRequired,
        rootId: PropTypes.string,
    };

    static defaultProps = {
        onFirstChildEnter: undefined,
        rootId: undefined,
    };

    handleFirstChildChange = (event, unobserve) => {
        window.setTimeout(() => {
            if (event.isIntersecting) {
                unobserve();
                this.props.onFirstChildEnter(event);
            }
        }, 0);
    };

    handleLastChildChange = (event, unobserve) => {
        window.setTimeout(() => {
            if (event.isIntersecting) {
                unobserve();
                this.props.onLastChildEnter(event);
            }
        }, 0);
    };

    render() {
        const {children, rootId, onFirstChildEnter} = this.props;

        return React.Children.toArray(children)
            .filter((child) => !!child) // Observer throws an error when the child is null
            .map((child, i, array) => {
                const isFirstChild = i === 0;
                const isLastChild = i === array.length - 1;
                if (isLastChild || (isFirstChild && onFirstChildEnter)) {
                    return (
                        <Observer
                            {...child.props}
                            onChange={
                                isFirstChild && onFirstChildEnter
                                    ? this.handleFirstChildChange
                                    : this.handleLastChildChange
                            }
                            root={rootId && `#${rootId}`}
                            key={child.key}
                        >
                            {child}
                        </Observer>
                    );
                }
                return child;
            });
    }
}
