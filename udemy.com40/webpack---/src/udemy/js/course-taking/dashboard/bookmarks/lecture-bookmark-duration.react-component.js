import {Duration} from '@udemy/react-date-time-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './lecture-bookmark-duration.less';

@observer
export default class LectureBookmarkDuration extends Component {
    static propTypes = {
        position: PropTypes.number.isRequired,
    };

    render() {
        return (
            <div className="ud-heading-sm" styleName="bookmark-timer">
                <Duration
                    numSeconds={this.props.position}
                    presentationStyle={Duration.STYLE.TIMESTAMP}
                    id={`bookmark-${this.props.position}`}
                />
            </div>
        );
    }
}
