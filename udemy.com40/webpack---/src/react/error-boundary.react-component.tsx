import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

/** React prop interface for `ErrorBoundary` component */
interface ErrorBoundaryProps {
    /** The child content of ErrorBoundary */
    children: React.ReactNode;
    /**
     * The Sentry instance's captureException to trigger when
     * the component catches an error
     */
    captureException: (e: Error) => void | null;
}

/**
 * ### ErrorBoundary
 *
 * A component that catches errors and displays a fallback UI (null).
 *
 * @remarks
 * The default component exported by this file is DjangoErrorBoundary, which is a wrapper around this component.
 */
@observer
export class ErrorBoundary extends Component<ErrorBoundaryProps> {
    @observable
    error: Error | null = null;

    @observable
    info: React.ErrorInfo | null = null;

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setErrorState(error, info);
        this.props.captureException?.(error);
    }

    @action
    setErrorState(error: Error, info: React.ErrorInfo) {
        this.error = error;
        this.info = info;
    }

    render() {
        return this.error ? null : this.props.children;
    }
}

/**
 * ### withErrorBoundary
 *
 * A HOC that wraps a component with an ErrorBoundary
 *
 * @param WrappedComponent - The Component you are wrapping with the ErrorBoundary
 * @param captureException - The Sentry instance's captureException to trigger if an error is caught.
 * Note that this is default to `Raven.captureException` within the monolith
 */
export function withErrorBoundary<TProps>(
    WrappedComponent: React.ComponentType<TProps>,
    captureException: ErrorBoundaryProps['captureException'],
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ComponentWithErrorBoundary = React.forwardRef<any, TProps>((props, ref) => {
        return (
            <ErrorBoundary captureException={captureException}>
                <WrappedComponent ref={ref} {...props} />
            </ErrorBoundary>
        );
    });
    ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${
        WrappedComponent.displayName ?? WrappedComponent.name
    })`;

    return ComponentWithErrorBoundary;
}
