import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udMe from 'utils/ud-me';

export function isMarketplaceShareEnabled(shareableObject) {
    const udConfig = getConfigData();
    const brand = udConfig.brand;
    return (
        !shareableObject.is_private && !brand.has_organization && brand.is_external_sources_enabled
    );
}

export function socialNetworks() {
    const udRequest = getRequestData();
    const udConfig = getConfigData();
    const allowMailRef = udConfig.features.social_share && udConfig.features.social_share.email;
    return [
        'clipboard',
        'facebook',
        'twitter',
        ...(udRequest.isMobile ? ['messenger', 'whatsapp'] : []),
        !udMe.isLoading && udMe.id && allowMailRef ? 'mail_ref' : 'mailto',
    ];
}
