import udRenderReactComponents from 'utils/ud-render-react-components';

import {ComponentProps} from '../utils/types';
import CategoryWithGlobalProviders from './category.react-isocomponent';

import './app.global.less';

export type ModuleArgs = ComponentProps<typeof CategoryWithGlobalProviders>;
export default function bootstrap(container: HTMLElement, moduleArgs: ModuleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--category--category',
        CategoryWithGlobalProviders,
        moduleArgs,
    );
}
