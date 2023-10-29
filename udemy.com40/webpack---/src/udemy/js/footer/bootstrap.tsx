import {FooterServerData} from '@udemy/footer';

import udRenderReactComponents from 'utils/ud-render-react-components';

import {FooterContainer} from './footer-container.react-isocomponent';

import '@udemy/footer/dist/footer.global.css';

export function bootstrap(container: HTMLElement, moduleArgs: FooterServerData) {
    udRenderReactComponents(
        container,
        '.ud-component--footer--footer-container',
        FooterContainer,
        moduleArgs,
    );
}
