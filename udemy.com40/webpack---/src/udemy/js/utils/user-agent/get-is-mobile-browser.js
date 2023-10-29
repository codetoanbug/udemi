import getRequestData from 'utils/get-request-data';

const udRequest = getRequestData();

export default function getIsMobileBrowser() {
    return udRequest.isMobile || udRequest.isTablet;
}

export const isMobileBrowser = getIsMobileBrowser();
