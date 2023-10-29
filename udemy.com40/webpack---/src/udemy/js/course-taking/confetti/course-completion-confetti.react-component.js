import {Confetti} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from '../registry/requires';

@requires('courseTakingStore')
@observer
export default class CourseCompletionConfetti extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    render() {
        if (!this.props.courseTakingStore.isConfettiRequired) {
            return null;
        }

        return (
            <Confetti
                usePortal={true}
                width={this.props.courseTakingStore.windowSize.innerWidth}
                height={this.props.courseTakingStore.windowSize.innerHeight}
            />
        );
    }
}
