import axios from 'axios';
import {action, observable, runInAction} from 'mobx';

import getConfigData from 'utils/get-config-data';
import {noop} from 'utils/noop';
import serializeForm from 'utils/serialize-form';

export default class AjaxContentStore {
    @observable _url = '';
    @observable content = '';
    @observable isLoading = false;
    @observable hasErrorContent = false;

    constructor(url) {
        this.setUrl(url);
    }

    @action
    setUrl(url, skipCache = false) {
        // Reset content if url changes, so that fetchContent
        // would try to fetch it again.
        if (url !== this._url || skipCache) {
            this.content = '';
            this._url = url;
        }
    }

    @action
    setContent(content, isErrorContent = false) {
        // Sometimes we have the content without needing to make an ajax request.
        // E.g. we make an ajax form submit request, and set the content to the response data.
        this.content = content;
        this.hasErrorContent = isErrorContent;
    }

    @action
    async fetchContent(preloader = null) {
        // Don't fetch content if we already fetch it for the same url.
        if (this.content) {
            return Promise.resolve();
        }

        this.isLoading = true;
        this.hasErrorContent = false;
        this.content = '';

        const requests = [
            axios.get(this._url, {
                headers: {
                    Accept: 'text/html',

                    // Django uses this to determine whether a request is AJAX, in which case it
                    // returns a <div class="run-command redirect"></div> instead of the HTML of
                    // the redirected page.
                    'X-Requested-With': 'XMLHttpRequest',
                },
                params: {
                    display_type: 'popup',
                },
            }),
        ];

        if (preloader) {
            requests.push(preloader(this._url).catch(noop));
        }

        try {
            const [response] = await Promise.all(requests);
            runInAction(() => {
                this.content = response.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                // If PerimeterX flagged this response, it's possible the user might get here and be
                // shown a message from PerimeterX. In that case, the captcha will be broken. However,
                // since we've never seen this affect any real users, we're just going to ignore it
                // for now.
                if (error.response && error.response.data) {
                    this.content = error.response.data;
                } else {
                    this.content = error.message;
                }
                this.hasErrorContent = true;
                this.isLoading = false;
            });
        }
    }

    submitForm(form) {
        const paramsObj = serializeForm(form);
        const paramsList = [];
        Object.entries(paramsObj).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    paramsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
                });
            } else {
                paramsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        });

        return axios.request({
            baseURL: getConfigData().url.to_root,
            method: form.getAttribute('method') || 'get',
            url: form.getAttribute('action'),
            data: paramsList.join('&'),
            headers: {
                // Django expects form data.
                'Content-Type': 'application/x-www-form-urlencoded',
                // Django uses this to determine whether a request is AJAX.
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
    }
}
