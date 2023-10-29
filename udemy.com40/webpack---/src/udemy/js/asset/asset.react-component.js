import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AssetStore from './asset.mobx-store';
import {ASSET_STATUS} from './constants';
import DelayedState from './delayed-state.react-component';
import FailedState from './failed-state.react-component';
import UnprocessedState from './unprocessed-state.react-component';

export default function wrappedAssetComponent(assetName, AssetComponent, assetModel) {
    return observer(
        class extends React.Component {
            static displayName = assetName;

            static propTypes = {
                id: PropTypes.number.isRequired,
                asset: PropTypes.object,
                assetData: PropTypes.object,
                courseId: PropTypes.number,
                lectureId: PropTypes.number,
                practiceId: PropTypes.number,
            };

            static defaultProps = {
                asset: null,
                assetData: null,
                courseId: null,
                lectureId: null,
                practiceId: null,
            };

            constructor(props) {
                super(props);
                this.store = new AssetStore(
                    props.id,
                    assetModel,
                    props.courseId,
                    props.lectureId,
                    props.practiceId,
                );
            }

            componentDidMount() {
                this.store.fetchData(this.props.asset, this.props.assetData);
            }

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
                    // Haven't fetched the asset status yet, or the status is invalid.
                    return null;
                }
                return <Provider store={this.store}>{component}</Provider>;
            }
        },
    );
}
