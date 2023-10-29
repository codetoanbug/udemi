// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDisplayName = (Component: any) => {
    return Component.displayName || Component.name || 'Component';
};
