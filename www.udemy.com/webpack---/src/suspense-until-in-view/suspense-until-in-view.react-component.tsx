import Observer from '@researchgate/react-intersection-observer';
import React, {useState} from 'react';

/**
 * ### SuspenseUntilInView
 *
 * @remarks
 * This component accepts all props that React.Suspense does.
 * https://reactjs.org/docs/code-splitting.html#suspense
 *
 * @remarks
 * There is one required property for this component:
 * * `fallback` - A fallback react tree to show when a Suspense child (like React.lazy) suspends
 * is required and has a type of `NonNullable<ReactNode>|null`;
 * If you do not need to pass anything anything to render, pass `null`.
 */
export const SuspenseUntilInView = ({
    className,
    ...props
}: React.SuspenseProps & {className?: string}) => {
    const [isInView, setIsInView] = useState(false);

    const handleChange = ({isIntersecting}: IntersectionObserverEntry, unobserve: () => void) => {
        // As recommended at https://github.com/researchgate/react-intersection-observer#performance-issues
        window.setTimeout(() => {
            if (isIntersecting) {
                setIsInView(true);
                unobserve();
            }
        }, 0);
    };

    return (
        <Observer onChange={handleChange} rootMargin="0% 0% 50%">
            <div className={className}>
                {!isInView ? props.fallback : <React.Suspense {...props} />}
            </div>
        </Observer>
    );
};

SuspenseUntilInView.displayName = 'SuspenseUntilInView';
