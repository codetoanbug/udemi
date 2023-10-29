import MockAdapter from 'axios-mock-adapter';

import {udApi, UdApiInstance} from './ud-api';

let udApiMock: MockAdapter;

export function createUDApiMock(api: UdApiInstance): MockAdapter {
    const adapter = new MockAdapter(api);

    adapter.restore = function restoreNotAllowed() {
        throw new Error(
            'restore() cannot be called on this MockAdapter, as it is shared across test cases',
        );
    };

    return adapter;
}

export type UdApiMock = ReturnType<typeof createUDApiMock>;

export function getUdApiMock(): MockAdapter {
    if (!udApiMock) {
        udApiMock = createUDApiMock(udApi);
    }
    return udApiMock;
}
