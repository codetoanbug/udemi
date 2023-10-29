import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import './captions-display.less';

import {CaptionDisplayStore} from '../caption-display.mobx-store';
import {CueText} from './cue-text.react-component';
import {Well} from './well.react-component';

interface CueDisplayProps {
    containerForCue: any;
    captionDisplayStore: CaptionDisplayStore;
    userActivityStore: any;
}
@inject('captionDisplayStore', 'userActivityStore')
@observer
export class CueDisplay extends React.Component<CueDisplayProps> {
    static propTypes = {
        containerForCue: PropTypes.object,
        captionDisplayStore: PropTypes.object.isRequired,
        userActivityStore: PropTypes.object,
    };

    static defaultProps = {
        userActivityStore: null,
        containerForCue: null,
    };

    render() {
        if (this.props.captionDisplayStore.shouldDisplayWell) {
            return <Well captionDisplayStore={this.props.captionDisplayStore} />;
        }
        const containerClass = classNames('captions-container', {
            'user-inactive':
                this.props.userActivityStore && !this.props.userActivityStore.isUserActive,
        });
        const componentCue = (
            <div styleName={containerClass}>
                <CueText captionDisplayStore={this.props.captionDisplayStore} />
            </div>
        );
        return ReactDOM.createPortal(componentCue, this.props.containerForCue);
    }
}
