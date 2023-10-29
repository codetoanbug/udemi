import {udSentry} from '@udemy/sentry';
import {ErrorBoundary as DSWErrorBoundary} from '@udemy/shared-utils';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export const ErrorBoundary = (props: ErrorBoundaryProps) => (
    <DSWErrorBoundary captureException={udSentry.captureException}>
        {props.children}
    </DSWErrorBoundary>
);
