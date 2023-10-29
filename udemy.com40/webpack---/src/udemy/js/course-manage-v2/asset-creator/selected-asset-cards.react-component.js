import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {videoBasedAssetTypes, textBasedAssetTypes} from '../asset-library/constants';
import './selected-asset-cards.less';

const basePropTypes = {
    asset: PropTypes.shape({
        thumbnail_url: PropTypes.string,
        title: PropTypes.string,
        content_summary: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
};

export const SelectedAssetCard = observer(({asset, onEdit, onReplaceWithVideo}) => {
    const isVideoBased = videoBasedAssetTypes.has(asset.asset_type);
    const isTextBased = textBasedAssetTypes.has(asset.asset_type);
    return (
        <div styleName="asset-card" data-purpose="selected-asset">
            {asset.thumbnail_url ? (
                <div
                    styleName="thumbnail-container"
                    style={{backgroundImage: `url(${asset.thumbnail_url})`}}
                />
            ) : null}
            <div styleName="flex">
                <div className="ud-heading-md" styleName="ellipsis">
                    {asset.title}
                </div>
                <time styleName="content-summary">{asset.content_summary}</time>
                <div>
                    <Button
                        typography="ud-text-md"
                        udStyle="link"
                        data-purpose="edit-content-link"
                        onClick={onEdit}
                    >
                        <span>
                            <EditIcon label={false} color="inherit" styleName="btn-icon" />
                            {gettext('Edit Content')}
                        </span>
                    </Button>
                </div>
                {!isVideoBased ? (
                    <div>
                        <Button
                            typography="ud-text-md"
                            udStyle="link"
                            data-purpose="replace-with-video"
                            onClick={onReplaceWithVideo}
                        >
                            <span>
                                <PlayIcon label={false} color="inherit" styleName="btn-icon" />
                                {isTextBased
                                    ? gettext('Replace With Video')
                                    : gettext('Convert To Video')}
                            </span>
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
});

SelectedAssetCard.propTypes = Object.assign({}, basePropTypes, {
    onReplaceWithVideo: PropTypes.func.isRequired,
});

export const SelectedChildAssetCard = observer(({asset, onEdit}) => {
    return (
        <div styleName="asset-card" data-purpose="child-asset-card">
            {asset.thumbnail_url ? (
                <div
                    styleName="thumbnail-container"
                    style={{backgroundImage: `url(${asset.thumbnail_url})`}}
                />
            ) : null}
            <div styleName="flex child-asset-details">
                <div styleName="flex">
                    <div className="ud-heading-md" styleName="ellipsis">
                        {asset.title}
                    </div>
                    <time styleName="content-summary">{asset.content_summary}</time>
                </div>
                <div styleName="actions">
                    <Button
                        udStyle="secondary"
                        size="small"
                        data-purpose="edit-content"
                        onClick={onEdit}
                    >
                        {gettext('Change')}
                    </Button>
                </div>
            </div>
        </div>
    );
});

SelectedChildAssetCard.propTypes = basePropTypes;
