import {RequestOriginInformation} from '@udemy/protobuf-objects/build/protos/udemy/dto/service_request_context/v1beta/request_origin_information_pb';
import {ServiceRequestContext} from '@udemy/protobuf-objects/build/protos/udemy/dto/service_request_context/v1beta/service_request_context_pb';
export const HTTP_REQUEST_CONTEXT_HEADER = 'x-udemy-request-context';
export const HTTP_ACCEPT_LANGUAGE_HEADER = 'Accept-Language';

export const populateRequestOrigin = (requestInit: RequestInit): RequestOriginInformation => {
    const {headers} = requestInit;
    const originInformation = new RequestOriginInformation();

    if (headers) {
        originInformation.setAcceptLanguage(
            (headers as Record<string, string>)[HTTP_ACCEPT_LANGUAGE_HEADER],
        );
    }

    return originInformation;
};

export const createRequestContext = (requestInit?: RequestInit): ServiceRequestContext => {
    const requestContext = new ServiceRequestContext();
    if (requestInit) {
        const requestOrigin = populateRequestOrigin(requestInit);
        requestContext.setRequestOriginInfo(requestOrigin);
    }

    return requestContext;
};
