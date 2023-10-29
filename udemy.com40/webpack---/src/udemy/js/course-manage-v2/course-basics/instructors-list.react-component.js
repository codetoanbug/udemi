import {AlertBanner} from '@udemy/react-messaging-components';
import {PropTypes as mobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Instructor from './instructor.react-component';
import './instructor.less';

export default class InstructorsList extends Component {
    static propTypes = {
        instructorBios: mobxPropTypes.arrayOrObservableArray.isRequired,
        minSummaryWords: PropTypes.number.isRequired,
    };

    renderAllCompleteStatus() {
        return (
            <AlertBanner
                showCta={false}
                udStyle="success"
                styleName="instructors-status"
                title={gettext('All instructor bios are complete!')}
            />
        );
    }

    renderSomeIncompleteStatus() {
        return (
            <AlertBanner
                showCta={false}
                udStyle="error"
                styleName="instructors-status"
                title={gettext(
                    'All visible instructors of this course must complete their profile before the course can be published.',
                )}
                body={interpolate(
                    gettext(
                        'This includes name, image, and a short summary of your background %(minSummaryWords)s words minimum.',
                    ),
                    {minSummaryWords: this.props.minSummaryWords},
                    true,
                )}
            />
        );
    }

    render() {
        return (
            <>
                {this.props.instructorBios.some((instructorBio) => !instructorBio.isComplete)
                    ? this.renderSomeIncompleteStatus()
                    : this.renderAllCompleteStatus()}
                {this.props.instructorBios.map((instructorBio) => (
                    <Instructor
                        key={instructorBio.user.id}
                        instructorBio={instructorBio}
                        minSummaryWords={this.props.minSummaryWords}
                    />
                ))}
            </>
        );
    }
}
