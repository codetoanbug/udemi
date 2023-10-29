import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import './captions-display.less';
import CueText from './cue-text.react-component';
import Well from './well.react-component';

@inject('captionDisplayStore', 'userActivityStore')
@observer
export default class CueDisplay extends React.Component {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        userActivityStore: PropTypes.object,
    };

    static defaultProps = {
        userActivityStore: null,
    };

    render() {
        if (this.props.captionDisplayStore.shouldDisplayWell) {
            return <Well />;
        }
        const containerClass = classNames('captions-container', {
            'user-inactive':
                this.props.userActivityStore && !this.props.userActivityStore.isUserActive,
        });
        const componentNode = (
            <div styleName={containerClass}>
                <CueText />
            </div>
        );

        return ReactDOM.createPortal(componentNode, this.props.captionDisplayStore.player.el());
    }
}
