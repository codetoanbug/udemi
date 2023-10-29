import {LocalizedHtml} from '@udemy/i18n';
import {Avatar} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    AVAILABLE,
    AVAILABILITY_OPTIONS,
    NOT_AVAILABLE,
    UNSPECIFIED,
} from 'course-manage-v2/availability/constants';
import {compare, toLocaleDateString} from 'utils/date';

import './instructor-course-status.less';

@observer
export default class InstructorCourseStatus extends Component {
    static propTypes = {
        instructorStatus: PropTypes.shape({
            status: PropTypes.number.isRequired,
            respond_time_frame: PropTypes.string,
            available_date: PropTypes.string,
            user: PropTypes.shape({
                id: PropTypes.number.isRequired,
                display_name: PropTypes.string,
                initials: PropTypes.string,
                title: PropTypes.string,
                image_50x50: PropTypes.string,
            }),
        }).isRequired,
    };

    constructor(props) {
        super(props);
        const {instructorStatus} = props;
        this.instructorStatusText = this.getInstructorStatusText();
        instructorStatus.status === AVAILABILITY_OPTIONS[NOT_AVAILABLE] &&
        compare(new Date(), new Date(instructorStatus.available_date)) >= 0
            ? (this.isOldStatus = true)
            : (this.isOldStatus = false);
    }

    @autobind
    @action
    onDismiss() {
        this.showOverlay = !this.showOverlay;
    }

    getInstructorStatusText() {
        const {instructorStatus} = this.props;
        let instructorStatusText;
        if (instructorStatus.status === AVAILABILITY_OPTIONS[AVAILABLE]) {
            instructorStatusText = interpolate(
                gettext('Given our current workload, we are able to respond within %(timeframe)s.'),
                {timeframe: instructorStatus.respond_time_frame},
                true,
            );
        } else if (instructorStatus.status === AVAILABILITY_OPTIONS[NOT_AVAILABLE]) {
            instructorStatusText = interpolate(
                gettext('We are temporarily out of office until %(date)s.'),
                {
                    date: toLocaleDateString(new Date(instructorStatus.available_date), {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }),
                },
                true,
            );
        }
        return instructorStatusText;
    }

    render() {
        const {instructorStatus} = this.props;
        if (instructorStatus.status === AVAILABILITY_OPTIONS[UNSPECIFIED] || this.isOldStatus) {
            return null;
        }
        const instructor = instructorStatus.user;
        return (
            <div className="ud-text-sm" styleName="question-wrapper">
                <div>
                    <Avatar size="small" srcKey="image_50x50" alt="NONE" user={instructor} />
                </div>
                <div styleName="text-content">
                    <div>
                        <LocalizedHtml
                            html={interpolate(
                                gettext('<a class="link">%(instructorName)s</a> instructor'),
                                {instructorName: instructor.title},
                                true,
                            )}
                            interpolate={{
                                link: (
                                    <a
                                        ref={this.setTargetRef}
                                        href={instructor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                    </div>
                    {this.instructorStatusText}
                </div>
            </div>
        );
    }
}
