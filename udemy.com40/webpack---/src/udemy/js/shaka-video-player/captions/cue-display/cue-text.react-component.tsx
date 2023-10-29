import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './captions-display.less';

interface CueTextProps {
    captionDisplayStore: any;
}
@inject('captionDisplayStore')
@observer
export class CueText extends React.Component<CueTextProps> {
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
