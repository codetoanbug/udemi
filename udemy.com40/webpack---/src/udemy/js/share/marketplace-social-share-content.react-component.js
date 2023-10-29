import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import SocialShareEmailForm from './social-share-email-form.react-component';
import SocialShareItems from './social-share-items.react-component';

@observer
export default class MarketplaceSocialShareContent extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onFormCancel: PropTypes.func,
    };

    static defaultProps = {
        onFormCancel: noop,
    };

    render() {
        if (this.props.store.isImportEmailModalShown) {
            return (
                <SocialShareEmailForm store={this.props.store} onCancel={this.props.onFormCancel} />
            );
        }
        return <SocialShareItems store={this.props.store} />;
    }
}
