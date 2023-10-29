import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import CourseCompletionConfetti from '../confetti/course-completion-confetti.react-component';
import requires from '../registry/requires';

import './mobile-overlay.less';

@requires('courseTakingStore')
export default class MobileOverlay extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        displayImageOverlay: PropTypes.bool,
    };

    static defaultProps = {
        displayImageOverlay: false,
    };

    render() {
        return (
            <>
                {this.props.displayImageOverlay && (
                    <Image
                        styleName="course-image"
                        src={this.props.courseTakingStore.course.image240x135}
                        alt={gettext('Course image')}
                        width={240}
                        height={135}
                    />
                )}
                <div styleName="backdrop" />
                <CourseCompletionConfetti />
            </>
        );
    }
}
