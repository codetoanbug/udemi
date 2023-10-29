import {noop} from '@udemy/shared-utils';
import {udLink} from '@udemy/ud-data';
import {action, computed, observable, ObservableMap} from 'mobx';

import {FB_WORKPLACE} from 'organization-common/ufb-social-share/constants';
import udApi from 'utils/ud-api';

import networkBehaviors from './behaviors';
import getShareStrings from './config';
import {isMarketplaceShareEnabled} from './helpers';

export default class SocialShareStore {
    constructor(
        shareableObject,
        sourceUrl,
        context,
        sharedUrl = '',
        networkShareBehaviors = null,
        globalOverrides = {gettext, interpolate},
    ) {
        this.shareableObject = shareableObject;
        this.sourceUrl = sourceUrl;
        this.context = context;
        this.loadingNetwork = new ObservableMap();
        this.networkShareBehaviors = networkShareBehaviors || networkBehaviors;
        this._setUrl(sharedUrl);
        this.globalOverrides = globalOverrides;
    }

    @observable isImportEmailModalShown = false;
    @observable isShareModalShown = false;
    @observable isCopyLinkShown = false;
    @observable showEmailFeedback = false;
    @observable url = '';

    get isMarketplaceShareEnabled() {
        return isMarketplaceShareEnabled(this.shareableObject);
    }

    @action
    _setUrl(url) {
        this.url = url;
    }

    @computed
    get sharedUrl() {
        return this.url;
    }

    @computed
    get sourcePage() {
        return this.context;
    }

    @action
    clearLoadingNetwork = (network) => {
        this.loadingNetwork.set(network, false);
    };

    @action
    setLoadingNetwork = (network) => {
        this.loadingNetwork.set(network, true);
    };

    @action
    showImportEmailModal = () => {
        this.isImportEmailModalShown = true;
        this.showEmailFeedback = false;
    };

    @action
    hideImportEmailModal = () => {
        this.isImportEmailModalShown = false;
    };

    @action
    showShareModal = () => {
        this.isShareModalShown = true;
    };

    @action
    hideShareModal = () => {
        this.isShareModalShown = false;
    };

    @action
    showCopyText = () => {
        this.isCopyLinkShown = true;
        setTimeout(this.hideCopyText, 3000);
    };

    @action
    hideCopyText = () => {
        this.isCopyLinkShown = false;
    };

    @action
    callbackEmails = () => {
        this.isImportEmailModalShown = false;
        this.showEmailFeedback = true;
    };

    doShareBehaviour(network) {
        const behavior = this.networkShareBehaviors[network];
        if (!behavior) {
            return null;
        }
        behavior(this.url, this._shareContext(network), this._shareActions);

        this.clearLoadingNetwork(network);
    }

    @action
    share(network, onError = noop) {
        this.setLoadingNetwork(network);
        return this.getOrPopulateUrl()
            .then(() => {
                this.doShareBehaviour(network);
            })
            .catch((error) => {
                onError(error);
            });
    }

    getOrPopulateUrl = () => {
        if (this.url) {
            return Promise.resolve(this.url);
        }

        return udApi.post('share/', this._getPostData()).then(
            action((response) => {
                this.url = response.data.url;
                return Promise.resolve(this.url);
            }),
        );
    };

    _getPostData() {
        const sourceUrl = this.sourceUrl ? udLink.to(this.sourceUrl) : null;
        return {
            target: sourceUrl || window.location.href.replace(window.location.search, ''),
            context: this.context,
        };
    }

    _shareContext(network) {
        const {gettext, interpolate} = this.globalOverrides;
        if (network === FB_WORKPLACE) {
            return {
                id: this.shareableObject.id,
            };
        }
        return {
            shareableText: interpolate(
                getShareStrings(gettext)[this.context].shareableText,
                {
                    title: this.shareableObject.title,
                },
                true,
            ),
            title: this.shareableObject.title,
        };
    }

    get _shareActions() {
        return {
            showImportEmailModal: this.showImportEmailModal,
            showCopyText: this.showCopyText,
        };
    }
}
