import {DesktopInstructorHeader} from '@udemy/react-header';

import udRenderReactComponents from 'utils/ud-render-react-components';

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--instructor-header--instructor-header',
        DesktopInstructorHeader,
        moduleArgs,
    );
}
