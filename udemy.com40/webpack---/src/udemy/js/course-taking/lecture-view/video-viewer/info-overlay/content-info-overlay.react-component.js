import PropTypes from 'prop-types';
import React from 'react';

import InfoOverlay from './info-overlay.react-component';
import './content-info-overlay.less';

export default class ContentInfoOverlay extends React.Component {
    static propTypes = {
        infoMap: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            }),
        ).isRequired,
    };

    render() {
        const {infoMap, ...props} = this.props;
        return (
            <InfoOverlay title={gettext('Content information')} {...props}>
                {infoMap.map((item) => (
                    <div key={item.name} className="ud-text-lg" styleName="info-item">
                        {`${item.name}: ${item.value}`}
                    </div>
                ))}
            </InfoOverlay>
        );
    }
}
