import {useI18n} from '@udemy/i18n';
import LoadingSpinnerIcon from '@udemy/icons/dist/loading-spinner.ud-icon';
import {BaseIconProps, BaseIconSize} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

// Note: Loader CSS is served up via the react-reveal-components.global.css file;

/** React component props for the Loader component */
interface LoaderProps extends React.ComponentPropsWithRef<'div'> {
    /** The generic flag to display the Loader component. */
    block?: boolean;
    /** Flag to apply absolute positioning to the Loader component and overlay content.  */
    overlay?: boolean;
    /**
     * Loading label.
     * @defaultValue 'Loading'
     */
    label?: string;
    /** {@link BaseIconSize} to pass onto the Loading Icon. */
    size?: BaseIconSize;
    /**
     * Flag to turn on an CLP hack: ensure we get a good Largest Contentful Paint candidate
     * by making a huge spinner.  */
    withLCPCandidate?: boolean;
}

/**
 * ### Loader
 *
 * @remarks
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-reveal-components/dist/react-reveal-components.global.css';`
 */
export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({block = false, overlay = false, className, withLCPCandidate = false, ...props}, ref) => {
        const {gettext} = useI18n();
        const {label = gettext('Loading')} = props;
        const iconProps = props as BaseIconProps;

        if (block || overlay || withLCPCandidate) {
            if (withLCPCandidate) {
                iconProps.size = 'xxxlarge';
            }
            return (
                <div
                    className={classNames(
                        className,
                        'ud-loader-block',
                        overlay ? 'ud-loader-overlay' : '',
                        withLCPCandidate ? 'ud-lcp-candidate-white' : '',
                    )}
                    data-purpose="load-spinner-wrapper"
                    ref={ref}
                >
                    <LoadingSpinnerIcon {...iconProps} label={label} className="ud-loader" />
                </div>
            );
        }
        return (
            <LoadingSpinnerIcon
                {...iconProps}
                label={label}
                className={classNames(className, 'ud-loader')}
                ref={ref}
            />
        );
    },
);

Loader.displayName = 'Loader';

/** Intended to show while the main content of a page or dialog is loading. */
export const MainContentLoader = (props: LoaderProps) => (
    <Loader block={true} size="xxlarge" {...props} />
);
