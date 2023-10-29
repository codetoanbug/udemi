import {makeHoc} from '@udemy/shared-utils';

import {StoreType} from './store-context';
import {useStores} from './use-stores';

export interface WithStoresProps {
    stores: InstanceType<StoreType>[];
}

/**
 * Higher order component that provides access to stores from `StoreProvider`. Uses
 * the `useStores` hook internally.
 *
 * @example
 * ```tsx
 * interface MyComponentProps extends WithStoresProps {
 *   stores: InstanceType<StoreContextClassType>[];
 * }
 *
 * class _MyComponent extends React.Component<MyComponentProps> {
 *   render() {
 *     const [fooStore] = this.props.stores
 *     return (
 *      <div>
 *       <p>Foo Store Data: {JSON.stringify(fooStore.data)}</p>
 *     </div>
 *     );
 *   }
 * };
 *
 * export const MyComponent = withStores(['FooStore'], _MyComponent);
 * ```
 */

export function withStores<
    TStore extends ReadonlyArray<StoreType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TComponent extends React.ComponentType<any>,
>(storeClasses: [...TStore], Component: TComponent) {
    const hoc = makeHoc({
        useGetData: () => {
            const stores = useStores(storeClasses);
            return {stores};
        },
        getDisplayName: (name) => `WithStore(${name})`,
        getPropTypes: (propTypes) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {stores, ...propTypesWithoutStores} = propTypes;
            return propTypesWithoutStores;
        },
    });
    return hoc(Component);
}
