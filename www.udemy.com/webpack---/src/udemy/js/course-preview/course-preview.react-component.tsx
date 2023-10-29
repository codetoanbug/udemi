import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Image} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {ASSET_TYPE} from 'asset/constants';
import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {PreviewsStore} from 'course-preview/previews.mobx-store';
import {Asset} from 'course-preview/types/asset';
import {PreviewableCourse} from 'course-preview/types/previewable-course';
import {ShakaVideoPlayer} from 'shaka-video-player/shaka-video-player.react-component';
import getRequestData from 'utils/get-request-data';
import {noop} from 'utils/noop';
import {AnyObject} from 'utils/types';
import udMe from 'utils/ud-me';
import './course-preview.less';

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_HEIGHT = 480;

interface VideoPreviewProps {
    /**
     * Values to be passed through to the VideoPlayer component
     */
    config: AnyObject;
    /**
     * If false, this component's contents will not be rendered
     */
    show: boolean;
    /**
     * The video asset to play
     */
    asset: Asset;
}

const VideoJsPlayer = React.lazy(
    () =>
        import(/* webpackChunkName: "video-player" */ 'video-player/video-player.react-component'),
);
export const VideoPreview = observer(({config, show, asset}: VideoPreviewProps) => {
    const deviceType = getDeviceType();
    const VideoPlayer = deviceType === DEVICE_TYPE_MOBILE ? VideoJsPlayer : ShakaVideoPlayer;

    const VideoMashupAsset = React.lazy(
        () =>
            import(
                /* webpackChunkName: "video-mashup-asset" */ 'asset/video/mashup/video-mashup-asset.react-component'
            ),
    );

    if (!show) {
        return null;
    }

    const AssetComponent =
        asset.asset_type === ASSET_TYPE.VIDEO_MASHUP ? VideoMashupAsset : VideoPlayer;

    const assetOptions =
        asset.asset_type === ASSET_TYPE.VIDEO_MASHUP
            ? {playerOptions: config, id: asset.id, asset}
            : {...config};

    return (
        <div styleName="video-preview">
            <React.Suspense fallback={null}>
                <AssetComponent
                    {...((assetOptions as unknown) as Asset)}
                    data-purpose="asset-component"
                />
            </React.Suspense>
        </div>
    );
});

interface VideoPreviewsProps {
    /**
     * An instance of the store
     */
    store: PreviewsStore;
    /**
     * A React ref that will be set to the div element containing the video player
     */
    videoRef: React.RefObject<HTMLDivElement>;
}

export const VideoPreviews = observer(({store, videoRef}: VideoPreviewsProps) => {
    return (
        <div ref={videoRef}>
            {store.previews.map((preview, index) => (
                <VideoPreview
                    asset={preview}
                    key={index}
                    config={store.getConfig(preview)}
                    show={preview.id === store.currentPreview.id}
                />
            ))}
        </div>
    );
});

interface PreviewRowProps {
    /**
     * Video preview to play
     */
    preview: Asset;
    /**
     * Is this preview the one currently being played?
     */
    isCurrentPreview?: boolean;
    /**
     * Called when the play button is clicked
     */
    play?(): void;
}

export const PreviewRow = ({preview, isCurrentPreview = false, play = noop}: PreviewRowProps) => {
    return (
        <button
            className="ud-custom-focus-visible"
            styleName={classNames('preview-row', {'current-preview-row': isCurrentPreview})}
            onClick={play}
        >
            <div styleName="preview-thumbnail-wrapper">
                <Image
                    src={preview.thumbnail_url}
                    alt=""
                    width={THUMBNAIL_WIDTH}
                    height={THUMBNAIL_HEIGHT}
                    styleName="preview-thumbnail"
                />
            </div>
            {isCurrentPreview && <PlayIcon label={false} color="inherit" styleName="icon" />}
            <div className="ud-heading-sm ud-focus-visible-target" styleName="preview-title">
                {preview.title}
            </div>

            {!getRequestData().isMobile && (
                <div className="ud-heading-xs">{preview.content_summary}</div>
            )}
        </button>
    );
};

interface CoursePreviewProps {
    /**
     * The course to preview
     */
    course: PreviewableCourse;
    /**
     * Instance of the store
     */
    store: PreviewsStore;
}

@observer
export class CoursePreview extends React.Component<CoursePreviewProps> {
    constructor(props: CoursePreviewProps) {
        super(props);
        this.videoRef = React.createRef<HTMLDivElement>();
    }

    private videoRef: React.RefObject<HTMLDivElement>;

    render() {
        if (udMe.isLoading) {
            return <Loader size="medium" block={true} />;
        }
        const {store} = this.props;
        return (
            <div styleName="previews" data-purpose="course-preview">
                <VideoPreviews
                    store={store}
                    videoRef={this.videoRef}
                    data-purpose="video-previews"
                />
                <div className="ud-heading-md" styleName="separation-text">
                    {gettext('Free Sample Videos:')}
                </div>
                <div styleName="preview-rows">
                    {store.previews.map((preview) => (
                        <PreviewRow
                            preview={preview}
                            key={preview.id}
                            isCurrentPreview={store.currentPreview.id === preview.id}
                            play={store.playPreview(preview, this.videoRef)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
