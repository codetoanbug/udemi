import {PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import PresentationAsset from 'asset/presentation/presentation-asset.react-component';
import './video-mashup-asset-creator.less';

export default class PresentationPreviewer extends Component {
    static propTypes = {
        asset: PropTypes.shape({
            id: PropTypes.number.isRequired,
            slide_urls: mobxTypes.arrayOrObservableArray.isRequired,
        }).isRequired,
    };

    render() {
        return (
            <div styleName="asset-preview-container">
                <PresentationAsset id={this.props.asset.id} assetData={this.props.asset} />
            </div>
        );
    }
}
