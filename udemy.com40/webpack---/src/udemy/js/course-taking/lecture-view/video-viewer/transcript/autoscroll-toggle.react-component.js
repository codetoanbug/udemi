import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {TRACKING_CATEGORIES} from '../../../constants';
import requires from '../../../registry/requires';
import {TRANSCRIPT_ACTIONS} from './constants';

import './transcript.less';

@requires('courseTakingStore', 'transcriptStore')
@observer
export default class AutoscrollToggle extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        transcriptStore: PropTypes.object.isRequired,
    };

    @autobind
    toggleAutoscroll() {
        if (this.props.transcriptStore.isAutoscrollEnabled) {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.TRANSCRIPT,
                TRANSCRIPT_ACTIONS.DISABLE_AUTOSCROLL,
            );
            this.props.transcriptStore.disableAutoscroll();
        } else {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.TRANSCRIPT,
                TRANSCRIPT_ACTIONS.ENABLE_AUTOSCROLL,
            );
            this.props.transcriptStore.enableAutoscroll();
        }
    }

    render() {
        return (
            <div styleName="autoscroll-wrapper">
                <Checkbox
                    styleName="autoscroll-checkbox"
                    name="autoscroll-checkbox"
                    checked={this.props.transcriptStore.isAutoscrollEnabled}
                    onChange={this.toggleAutoscroll}
                >
                    {gettext('Autoscroll')}
                </Checkbox>
            </div>
        );
    }
}
