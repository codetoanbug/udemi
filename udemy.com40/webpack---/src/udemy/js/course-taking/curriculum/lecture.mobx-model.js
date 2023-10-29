import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import AudioIcon from '@udemy/icons/dist/audio.ud-icon';
import PresentationIcon from '@udemy/icons/dist/presentation.ud-icon';
import VideoMashupIcon from '@udemy/icons/dist/video-mashup.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';
import {ASSET_TYPE, ASSET_STATUS, ASSET_URL_TTL, ASSET_LICENSE_TOKEN_TTL} from 'asset/constants';
import udApi from 'utils/ud-api';

import {API_LECTURE_FIELDS, API_LECTURE_MEDIA_LICENSE_FIELDS} from '../lecture-view/constants';
import {ASSET_UNAVAILABLE, LECTURE_LOCKED} from '../locked-screen/constants';
import CurriculumItem from './curriculum-item.mobx-model';

const DEFAULT_ICON = ArticleIcon;
const ICON_MAP = {
    Video: VideoIcon,
    VideoMashup: VideoMashupIcon,
    Audio: AudioIcon,
    Presentation: PresentationIcon,
};

export default class Lecture extends CurriculumItem {
    @observable lastWatchedSecond;
    @observable isUnavailable;
    dataLoadTime;
    licenseTokenLoadTime;

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            description: 'description',
            downloadUrl: 'download_url',
            isFree: 'is_free',
            lastWatchedSecond: {
                source: 'last_watched_second',
                map: (lastWatchedSecond) =>
                    lastWatchedSecond !== null ? lastWatchedSecond : undefined,
            },
            asset: {
                source: 'asset',
                map: (asset) => {
                    if (!asset) {
                        return;
                    }
                    const AssetClass = assetModelMap[asset.asset_type] || AssetModel;
                    return new AssetClass(asset);
                },
            },
            url: 'url',
        };
    }

    get titleIndex() {
        return this.isPublished ? `${this.objectIndex}.` : gettext('Unpublished lecture:');
    }

    get isVideo() {
        return (
            this.asset &&
            [ASSET_TYPE.VIDEO, ASSET_TYPE.VIDEO_MASHUP, ASSET_TYPE.AUDIO].includes(this.asset.type)
        );
    }

    get isMissingAsset() {
        return (
            !this.asset ||
            this.asset.type === ASSET_TYPE.UPCOMING ||
            this.asset.status !== ASSET_STATUS.SUCCESS
        );
    }

    get resourcesApiUrl() {
        return `/users/me/subscribed-courses/${this.courseId}/lectures/${this.id}/supplementary-assets/`;
    }

    get progressApiUrl() {
        return `/users/me/subscribed-courses/${this.courseId}/lectures/${this.id}/progress-logs/`;
    }

    get markIncompleteUrl() {
        return `/users/me/subscribed-courses/${this.courseId}/completed-lectures/${this.id}/`;
    }

    @action
    setLastWatchedSecond(time) {
        this.lastWatchedSecond = time;
    }

    get isDataExpired() {
        return !this.dataLoadTime || new Date() - this.dataLoadTime > ASSET_URL_TTL;
    }

    get isLicenseTokenExpired() {
        return (
            !this.licenseTokenLoadTime ||
            new Date() - this.licenseTokenLoadTime > ASSET_LICENSE_TOKEN_TTL
        );
    }

    loadData(courseResource, extraParams = {}) {
        // Refresh the entire data or only the license auth token when the cached values are expired
        if (this.isDataExpired) {
            return this._fetchData(
                courseResource,
                Object.assign({}, {...API_LECTURE_FIELDS}, extraParams, {
                    q: Math.random(),
                }),
            ).finally(() => {
                this.dataLoadTime = new Date();
                this.licenseTokenLoadTime = this.dataLoadTime;
            });
        } else if (this.isLicenseTokenExpired) {
            return this._fetchData(
                courseResource,
                Object.assign({}, {...API_LECTURE_MEDIA_LICENSE_FIELDS}, extraParams, {
                    q: Math.random(),
                }),
            ).finally(() => {
                this.licenseTokenLoadTime = new Date();
            });
        }

        return Promise.resolve();
    }

    @action
    setData(data) {
        if (this.asset) {
            // Split out asset data so that any existing asset model on the lecture is not overwritten.
            const {asset: assetData, ...lectureData} = data;
            this.setDataFromAPI(lectureData);
            this.asset.setDataFromAPI(assetData);
        } else {
            this.setDataFromAPI(data);
        }
    }

    markAsViewed() {
        return udApi.post(
            `/users/me/subscribed-courses/${this.courseId}/lectures/${this.id}/view-logs/`,
        );
    }

    @autobind
    @action
    markAsComplete(isDownloaded = false) {
        if (this.isCompleted) {
            return Promise.resolve();
        }

        this.isLoading = true;
        this.setComplete();

        const url = `/users/me/subscribed-courses/${this.courseId}/completed-lectures/`;
        const data = {lecture_id: this.id, downloaded: isDownloaded};
        return udApi
            .post(url, data)
            .catch(this.setIncomplete)
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    get iconComponent() {
        return ICON_MAP[this.asset && this.asset.type] || DEFAULT_ICON;
    }

    _fetchData(courseResource, params) {
        const lectureUrl = `/users/me/${courseResource}/${this.courseId}/lectures/${this.id}/`;

        return udApi.get(lectureUrl, {params}).then(
            (response) => {
                this.setData(response.data);
            },
            (error) => {
                if (
                    error.response &&
                    error.response.data &&
                    (error.response.data.detail === LECTURE_LOCKED ||
                        error.response.data.detail === ASSET_UNAVAILABLE)
                ) {
                    this.isUnavailable = true;
                } else {
                    throw error;
                }
            },
        );
    }
}
