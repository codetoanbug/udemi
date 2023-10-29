import udRenderReactComponents from 'utils/ud-render-react-components';

import UIFeedback from './ui-feedback.react-component';

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--ui-feedback--ui-feedback',
        UIFeedback,
        moduleArgs,
    );
}
