import {when} from 'mobx';

import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udMe from 'utils/ud-me';

import {loadIntercom, patchHistory} from './utils';

const udConfig = getConfigData();
const udRequest = getRequestData();

const _getIntercomData = async (moduleArgs) => {
    await when(() => !udMe.isLoading);
    const intercomData = {};
    const appId = udConfig.third_party.intercom.app_id;
    if (udMe.id) {
        Object.assign(intercomData, {
            app_id: appId,
            email: udMe.email,
            name: udMe.title,
            created_at: udMe.created,
            user_id: udMe.id,
            user_hash: moduleArgs.intercom_user_hash,
        });
    }

    if (udRequest.extraIntercomData) {
        Object.assign(intercomData, udRequest.extraIntercomData);
    }
    return intercomData;
};

export default async function bootstrap(container, moduleArgs) {
    if (
        container.classList.contains('ud-component--intercom--app') &&
        udConfig.features.intercom_chat
    ) {
        const intercomData = await _getIntercomData(moduleArgs);
        loadIntercom(intercomData);
        window.Intercom('boot', intercomData);
        patchHistory();
    }
}
