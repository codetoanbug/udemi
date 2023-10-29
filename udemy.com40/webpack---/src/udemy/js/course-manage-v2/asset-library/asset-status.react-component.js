import {Meter} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {assetStatuses} from './constants';
import './asset-status.less';

@observer
export default class AssetStatus extends Component {
    static propTypes = {
        asset: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: undefined,
    };

    render() {
        const {className, asset} = this.props;
        switch (asset.status) {
            case assetStatuses.uploading:
                return (
                    <div className={className} styleName="upload-progress-container">
                        <Meter
                            aria-hidden={true}
                            value={asset.progress_percentage}
                            min={0}
                            max={100}
                            label={gettext('%(percent)s%')}
                            styleName="upload-progress"
                        />
                        <div className="ud-text-xs">
                            {interpolate(
                                gettext('%(percent)s%'),
                                {percent: parseInt(asset.progress_percentage, 10)},
                                true,
                            )}
                        </div>
                    </div>
                );
            case assetStatuses.queued:
                return <div className={className}>{gettext('Queued')}</div>;
            case assetStatuses.failed:
                return (
                    <div className={className} styleName="negative">
                        {gettext('Failed')}
                    </div>
                );
            case assetStatuses.processing:
                return <div className={className}>{gettext('Processing')}</div>;
            case assetStatuses.success:
                return (
                    <div className={className} styleName="positive">
                        {gettext('Success')}
                    </div>
                );
        }
    }
}
