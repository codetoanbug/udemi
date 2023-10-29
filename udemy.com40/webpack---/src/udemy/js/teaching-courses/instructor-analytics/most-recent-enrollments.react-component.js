import LocationOnIcon from '@udemy/icons/dist/location-on.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Avatar} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer, PropTypes as MobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import getRequestData from 'utils/get-request-data';
import qs from 'utils/query-params';

import ResponsiveCardCarousel from './responsive-card-carousel.react-component';
import './most-recent-enrollments.less';

@withRouter
@observer
export default class MostRecentEnrollments extends Component {
    static propTypes = {
        students: MobxTypes.arrayOrObservableArray.isRequired,
        location: PropTypes.object.isRequired,
    };

    @autobind
    renderCard(student, isListView) {
        return (
            <a
                key={`${student.id}-${student.course ? student.course.id : 'null'}`}
                data-purpose="student-card"
                href={student.url}
                className="ud-custom-focus-visible"
                styleName={isListView ? 'card' : 'card card-desktop'}
            >
                <Avatar user={student} alt="NONE" />
                <div styleName="card-details">
                    <div className="ud-heading-sm ud-focus-visible-target" styleName="card-title">
                        {student.display_name}
                    </div>
                    <div className="ud-text-xs" styleName="card-row" data-purpose="country">
                        <LocationOnIcon label={false} size="xsmall" />
                        <span styleName="ellipsis">
                            {(student.country && student.country.title) || gettext('Unknown')}
                        </span>
                    </div>
                    {student.course && (
                        <div className="ud-text-xs" styleName="card-row" data-purpose="courses">
                            <PlayIcon label={false} size="xsmall" />
                            <span styleName="ellipsis">{student.course.title}</span>
                        </div>
                    )}
                    <div className="ud-text-xs" styleName="card-date" data-purpose="enrollment">
                        {interpolate(gettext('Enrolled %s'), [
                            new Date(student.enrollment_date).toLocaleDateString(
                                getRequestData().locale.replace('_', '-') || 'en-US',
                                {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                },
                            ),
                        ])}
                    </div>
                </div>
            </a>
        );
    }

    render() {
        const {students, location} = this.props;

        if (students.length === 0) {
            return null;
        }

        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const header = !queryParams.course_id
            ? gettext('Meet people taking your courses')
            : gettext('Meet people taking your course');

        return (
            <div>
                <h3 styleName="title">{header}</h3>
                <ResponsiveCardCarousel
                    renderItems={(isListView) => {
                        return students.map((student) => this.renderCard(student, isListView));
                    }}
                />
            </div>
        );
    }
}
