import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './captions-display.less';

@inject('captionDisplayStore')
@observer
export default class CueText extends React.Component {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
    };

    render() {
        if (!this.props.captionDisplayStore.activeCueText) {
            return null;
        }
        return (
            <div
                styleName="captions-cue-text"
                data-purpose="captions-cue-text"
                style={this.props.captionDisplayStore.captionStyle}
            >
                {this.props.captionDisplayStore.activeCueText}
            </div>
        );
    }
}
