import ArrowRightIcon from '@udemy/icons/dist/arrow-right.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {convertSecondsToHumanReadable} from 'caption/cue.mobx-model';

import CueContentEditor from './cue-content-editor.react-component';
import './cue.less';

@inject('store')
@observer
export default class Cue extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        cue: PropTypes.object.isRequired,
        isEditing: PropTypes.bool.isRequired,
        isPlaying: PropTypes.bool.isRequired,
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.isEditing && this.props.isEditing && this.cueElement.scrollIntoView) {
            this.cueElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    @autobind
    handleSelect() {
        const {store, cue} = this.props;
        store.selectCue(cue);
    }

    @autobind
    handleChange(value) {
        const {store, cue} = this.props;
        store.onCueContentChange(cue, value);
    }

    @autobind
    handleMarkCorrect(event) {
        this.props.store.markCorrect(this.props.cue, event.target.checked);
    }

    render() {
        const {cue, isEditing, isPlaying} = this.props;

        const startTime = convertSecondsToHumanReadable(cue.startTime, 1);
        const endTime = convertSecondsToHumanReadable(cue.endTime, 1);
        const cueClasses = classNames('cue', {editing: isEditing, playing: isPlaying});

        return (
            // this is a exception in a11y because the user will have the same interaction tabing into the input elements.
            /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
            <div
                styleName={cueClasses}
                onClick={this.handleSelect}
                ref={(cueElement) => {
                    this.cueElement = cueElement;
                }}
            >
                <div
                    styleName="cue-time"
                    aria-label={interpolate(gettext('Between %s and %s'), [startTime, endTime])}
                >
                    <span>{startTime}</span>
                    <ArrowRightIcon label={false} />
                    <span>{endTime}</span>
                </div>
                <CueContentEditor
                    active={isEditing}
                    value={cue.text}
                    onFocus={this.handleSelect}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}
