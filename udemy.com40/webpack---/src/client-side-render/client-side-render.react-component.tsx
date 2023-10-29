import React from 'react';

/**
 * React props interface for `ClientSideRender` component
 */
export interface ClientSideRenderProps {
    /**
     * Placeholder component that will be rendered on the server
     *
     * @default null
     */
    placeholder?: React.ReactNode;
    /**
     * Name of UI region that is shown when CSR components are highlighted via the Udemy
     * Chrome extension
     *
     * @default 'component'
     */
    uiRegion?: string;
    children: React.ReactNode;
}

/**
 * ### ClientSideRender
 *
 * Component that ensures that its children are _only_ rendered on the client. On the server,
 * it renders a fallback component.
 * Instances of this component on a page can be highlighted using the "Highlight dynamic components"
 * switch in the Udemy Chrome extension.
 *
 * @example
 * ```tsx
 * <ClientSideRender placeholder={<Loader />} uiRegion="my UI region">
 *     <MyClientSideOnlyComponent />
 * </ClientSideRender>
 * ```
 */
export function ClientSideRender({
    placeholder = null,
    uiRegion = 'component',
    children,
}: ClientSideRenderProps) {
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{placeholder}</>;
    }

    if (!children) {
        return null;
    }

    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-client-side-render-only': `CSR: ${uiRegion}`,
    });
}
