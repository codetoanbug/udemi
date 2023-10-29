import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {discoveryTracker} from 'browse/tracking';
import {SOURCE_PAGES} from 'share/constants';
import {socialNetworks} from 'share/helpers';
import udApiStat from 'utils/ud-api-stat';

import SocialShareButton from './social-share-button.react-component';

import './social-share-items.less';

@observer
export default class SocialShareItems extends Component {
    static propTypes = {
        store: PropTypes.shape({
            shareableObject: PropTypes.object.isRequired,
            share: PropTypes.func.isRequired,
            sharedUrl: PropTypes.string.isRequired,
            sourcePage: PropTypes.string.isRequired,
        }).isRequired,
    };

    @autobind
    handleClick(network) {
        this.props.store.share(network);
        if (this.props.store.sourcePage === SOURCE_PAGES.CLP) {
            discoveryTracker.trackCourseShareToChannelEvent(
                this.props.store.shareableObject.id,
                network,
            );
        }
        udApiStat.increment('social_sharing.button.clicked', {network});
    }

    render() {
        const {store} = this.props;

        const socialSharingButtons = socialNetworks().map((network, index) => {
            return (
                <SocialShareButton
                    key={index}
                    network={network}
                    onClick={this.handleClick}
                    shareUrl={store.sharedUrl}
                />
            );
        });

        return <div styleName="social-share-items">{socialSharingButtons}</div>;
    }
}
