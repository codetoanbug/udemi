import {makeHoc} from '@udemy/shared-utils';

import {I18nApi} from './types';
import {useI18n} from './use-i18n';
import {omitI18nProps} from './utils';

export type WithI18nProps = I18nApi;

/**
 * Higher order component that provides access to the i18n APIs for class components. Uses
 * the `useI18n` hook internally.
 *
 * @example
 * ```tsx
 * interface MyProps extends WithI18nProps {
 *   foo: string;
 * }
 *
 * class _MyComponent extends React.Component<MyProps> {
 *   render() {
 *     const {lang, locale, gettext} = this.props;
 *     return (
 *       <div>
 *         <h1>{gettext('Hello translated world!')}</h1>
 *         <h2>{gettext('Current language')}: {lang}</h2>
 *         <h2>{gettext('Current locale')}: {locale}</h2>
 *       </div>
 *     );
 *   }
 * };
 *
 * export const MyComponent = withI18n(_MyComponent);
 * ```
 */
export const withI18n = makeHoc({
    useGetData: () => {
        const i18n = useI18n();
        return {...i18n};
    },
    getDisplayName: (name) => `WithI18n(${name})`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPropTypes: (propTypes) => omitI18nProps(propTypes as any),
});
