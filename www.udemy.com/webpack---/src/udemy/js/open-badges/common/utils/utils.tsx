import loadCommonAppContext from 'common/load-common-app-context';
import getConfigData from 'utils/get-config-data';

export const isBadgingDiscoveryEnabled = async (): Promise<boolean> => {
    if (isBadgingCertPrepEnabled()) {
        return true;
    }

    const commonAppContext = await loadCommonAppContext();
    const {user} = commonAppContext.data.header;

    return 'id' in user && user.consumer_subscription_active;
};

export const isBadgingCertPrepEnabled = (): boolean => {
    const udConfig = getConfigData();
    return udConfig.brand.has_organization && !udConfig.brand.organization?.is_enterprise_china;
};

export const isBadgingAssertionsEnabled = (): boolean => {
    const udConfig = getConfigData();
    return (
        isBadgingCertPrepEnabled() &&
        udConfig.features.organization.is_badging_assertions_upload_enabled
    );
};
