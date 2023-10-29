import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AssetStore from './asset.mobx-store';
import {ASSET_STATUS} from './constants';
import DelayedState from './delayed-state.react-component';
import FailedState from './failed-state.react-component';
import UnprocessedState from './unprocessed-state.react-component';

interface WrappedAssetComponentProps {
    id: string;
    asset: any;
    assetData: any;
}

export function wrappedVideoAssetComponent(assetName: any, AssetComponent: any, assetModel: any) {
    return observer(
        class WrappedAssetComponent extends React.Component<WrappedAssetComponentProps> {
            static displayName = assetName;

            static propTypes = {
                id: PropTypes.number.isRequired,
                asset: PropTypes.object,
                assetData: PropTypes.object,
            };

            static defaultProps = {
                asset: null,
                assetData: null,
            };

            constructor(props: any) {
                super(props);
                this.store = new AssetStore(props.id, assetModel);
            }

            componentDidMount() {
                this.store.fetchData(this.props.asset, this.props.assetData);
            }

            store: any;

            render() {
                if (!this.store.asset) {
                    return null;
                }
                let component;
                switch (this.store.asset.status) {
                    case ASSET_STATUS.SUCCESS:
                        component = <AssetComponent {...this.props} />;
                        break;
                    case ASSET_STATUS.UNPROCESSED:
                        component = <UnprocessedState />;
                        break;
                    case ASSET_STATUS.FAILED:
                        component = <FailedState />;
                        break;
                    case ASSET_STATUS.DELAYED:
                        component = <DelayedState />;
                        break;
                }
                if (!component) {
                    return null;
                }
                return <Provider store={this.store}>{component}</Provider>;
            }
        },
    );
}
