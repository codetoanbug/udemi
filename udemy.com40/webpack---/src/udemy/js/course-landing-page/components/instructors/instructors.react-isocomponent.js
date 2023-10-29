import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import Instructor from './instructor.react-component.js';
import styles from './styles.less';

@isomorphic
export default class Instructors extends React.Component {
    static propTypes = {
        course_id: PropTypes.number.isRequired,
        instructors_info: PropTypes.array.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: 'component-margin',
    };

    render() {
        if (!this.props.instructors_info.length) {
            return null;
        }

        const instructorHeaderText = ngettext(
            'Instructor',
            'Instructors',
            this.props.instructors_info.length,
        );

        return (
            <div className={classNames(this.props.className, styles.instructors)}>
                <span id="instructor" className="in-page-offset-anchor"></span>
                <h2 className={classNames('ud-heading-xl', styles.instructors__header)}>
                    {instructorHeaderText}
                </h2>
                {this.props.instructors_info.map((instructor, index) => (
                    <Instructor
                        key={instructor.id}
                        index={index + 1}
                        instructor={instructor}
                        courseId={this.props.course_id}
                    />
                ))}
            </div>
        );
    }
}
