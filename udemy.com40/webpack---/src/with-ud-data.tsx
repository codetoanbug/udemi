import {makeHoc} from '@udemy/shared-utils';

import {UDData} from './types';
import {useUDData} from './use-ud-data';

export interface WithUDDataProps {
    udData: UDData;
}

/**
 * Higher order component that provides access to the UD Data for class components. Uses
 * the `useUDData` hook internally.
 *
 * @example
 * ```tsx
 * interface MyProps extends UDData {
 *   foo: string;
 * }
 *
 * class _MyComponent extends React.Component<MyProps> {
 *   render() {
 *     const {Config} = this.props.udData
 *     return (
 *      <div>
 *       <p>App version: {Config.version}</p>
 *     </div>
 *     );
 *   }
 * };
 *
 * export const MyComponent = withUDData(_MyComponent);
 * ```
 */
export const withUDData = makeHoc({
    useGetData: () => {
        const udData = useUDData();
        return {udData};
    },
    getDisplayName: (name) => `WithUDData(${name})`,
    getPropTypes: (propTypes) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {udData, ...propTypesWithoutUdData} = propTypes;
        return propTypesWithoutUdData;
    },
});
