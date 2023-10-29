import branch from 'branch-sdk';

import getConfigData from 'utils/get-config-data';
import getOSName from 'utils/user-agent/get-os-name';

const udConfig = getConfigData();

class BranchMetrics {
    private _branch: typeof branch | null = null;
    private courseId: string | undefined;

    get branch() {
        if (!this._branch) {
            let key;
            if (udConfig.env === 'DEV') {
                key = udConfig.brand.has_organization
                    ? 'key_test_ebnrXmCOBlD9UQdlGuImyhilsymwj142'
                    : 'key_test_odgEKD7HeY8pCwFbkosrribgArahL8zN';
            } else {
                key = udConfig.brand.has_organization
                    ? 'key_live_ociw5pCRCis8ILedNrHjEbkfxCgwEgdh'
                    : 'key_live_dkmkLOFE7jz8nKqIcFl0hliaamb5MyJ6';
            }
            branch.init(key);
            this._branch = branch;
        }

        return this._branch;
    }

    createLink(params: branch.DeepLinkData) {
        const deferred = createDeferred();
        this.courseId = params?.data?.courseId;
        this.branch.link(params, (e, data) => {
            if (this.courseId)
                data = `${data}?$deeplink_path=udemy://discover?courseId=${this.courseId}`;
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    createiOSLinkWithDesktop(params: branch.DeepLinkData) {
        const newParams = {...params};
        newParams.data = newParams.data ?? {};
        return this.createLink(newParams);
    }

    createAndroidLinkWithDesktop(params: branch.DeepLinkData) {
        const newParams = {...params};
        newParams.data = newParams.data ?? {};
        return this.createLink(newParams);
    }

    createUFBLink(params: branch.DeepLinkData) {
        const newParams = {...params};
        newParams.data = Object.assign({}, newParams.data, {
            organizationName: udConfig.brand.title,
            organizationIdentifier: udConfig.brand.identifier,
            ufbDomain: udConfig.brand.url,
            $ios_url: udConfig.third_party.branch_metrics.ios_ufb_download_url,
            $android_url: udConfig.third_party.branch_metrics.android_ufb_download_url,
        });
        if ('ios' === getOSName()) {
            newParams.data.$desktop_url = udConfig.third_party.branch_metrics.ios_ufb_download_url;
        }
        if ('android' === getOSName()) {
            newParams.data.$desktop_url =
                udConfig.third_party.branch_metrics.android_ufb_download_url;
        }
        return this.createLink(newParams);
    }

    sendSMS(params: {phone: string; linkData: branch.DeepLinkData}) {
        const deferred = createDeferred();
        this.branch.sendSMS(params.phone, params.linkData, {make_new_link: false}, (error) => {
            if (!error) {
                deferred.resolve();
            } else {
                deferred.reject(error);
            }
        });
        return deferred.promise;
    }
}

const branchMetrics = new BranchMetrics();
// eslint-disable-next-line import/no-default-export
export default branchMetrics;

interface Deferred<T = unknown> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
    reject: (reason?: T) => void;
}

function createDeferred() {
    const deferred: Partial<Deferred> = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred as Deferred;
}
