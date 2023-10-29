import {lockPageScroll, unlockPageScroll} from '@udemy/design-system-utils';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Cue from './cue.react-component';
import './cue-list.less';

@inject('store')
@observer
export default class CueList extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    componentDidMount() {
        lockPageScroll(this.ref.current);
    }

    componentWillUnmount() {
        unlockPageScroll(this.ref.current);
    }

    ref = React.createRef();

    render() {
        const cues = this.props.store.localCues.map((cue) => (
            <Cue
                key={cue.id}
                cue={cue}
                isEditing={cue.id === this.props.store.editingCueId}
                isPlaying={this.props.store.playingCueIds.includes(cue.id)}
            />
        ));
        return (
            <div ref={this.ref} styleName="cues-container">
                <div styleName="cues">{cues}</div>
            </div>
        );
    }
}
