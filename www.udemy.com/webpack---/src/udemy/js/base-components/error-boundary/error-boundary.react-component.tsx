import {
    ErrorBoundary as DSWErrorBoundary,
    withErrorBoundary as dswWithErrorBoundary,
} from '@udemy/shared-utils';
import React from 'react';

import Raven from 'utils/ud-raven';

/** React prop interface for `ErrorBoundary` component */
interface ErrorBoundaryProps {
    /** The child content of ErrorBoundary */
    children: React.ReactNode;
    /**
     * The Sentry instance's captureException to trigger when
     * the component catches an error
     */
    captureException?: (e: Error) => void;
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
export function withErrorBoundary<TProps>(WrappedComponent: React.ComponentType<TProps>) {
    return dswWithErrorBoundary(WrappedComponent, Raven.captureException);
}

const DjangoErrorBoundary = (props: ErrorBoundaryProps) => (
    <DSWErrorBoundary captureException={Raven.captureException} {...props} />
);

// eslint-disable-next-line import/no-default-export
export default DjangoErrorBoundary;
