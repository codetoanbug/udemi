import marketplaceBootstrap from 'common/desktop/udlite-app';
import Header from 'header/ufb-desktop/header.react-isocomponent';
import UfbExpiredModal from 'organization-common/expired-modal/ufb-expired-modal.react-component';
import {App as OrganizationSlackModal} from 'organization-slack-modal/app';
import udRenderReactComponents from 'utils/ud-render-react-components';

import 'common/ufb-mobile/icons';

export default function bootstrap(container, moduleArgs) {
    moduleArgs.ufbHeaderComponent = Header;
    marketplaceBootstrap(container, moduleArgs);

    udRenderReactComponents(
        container,
        '.ud-component--organization-slack-modal--organization-slack-modal',
        OrganizationSlackModal,
        {},
    );

    udRenderReactComponents(
        container,
        '.ud-component--organization-trial--ufb-expired-modal',
        UfbExpiredModal,
        moduleArgs,
    );
}
