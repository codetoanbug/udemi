import {getUniqueId} from '@udemy/design-system-utils';
import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import VideoGroupIcon from '@udemy/icons/dist/video-group.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SystemMessagePopover from 'base-components/ungraduated/popover/system-message-popover.react-component';
import SystemMessage from 'utils/ud-system-message';

import ProgramCourseContent from '../program-course-content.mobx-model';
import requires from '../registry/requires';
import './sub-header.less';

class ProgramCourseDropdown extends Component {
    static propTypes = {
        title: PropTypes.node.isRequired,
        isOpen: PropTypes.bool.isRequired,
        onToggle: PropTypes.func.isRequired,
    };

    render() {
        const {isOpen, onToggle, title, children, ...props} = this.props;
        return (
            <Dropdown
                placement="bottom-start"
                menuWidth="auto"
                styleName="popper"
                isOpen={isOpen}
                onToggle={onToggle}
                trigger={
                    <Dropdown.Button
                        {...props}
                        styleName="dropdown-btn"
                        udStyle="ghost"
                        size="medium"
                    >
                        <span styleName="dropdown-title">{title}</span>
                    </Dropdown.Button>
                }
            >
                {children}
            </Dropdown>
        );
    }
}

@requires('courseTakingStore')
@observer
export default class SubHeader extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            program: PropTypes.shape({
                title: PropTypes.string,
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                courses: PropTypes.arrayOf(PropTypes.instanceOf(ProgramCourseContent)),
            }),
            course: PropTypes.shape({
                title: PropTypes.string,
                id: PropTypes.number,
            }),
        }).isRequired,
    };

    programCourseDropdownId = getUniqueId('program-course-dropdown');

    @observable isOnboardingPopoverOpen = null;
    @observable isProgramCourseDropdownOpen = false;

    @autobind @action onToggleOnboardingPopover(isOpen) {
        this.isOnboardingPopoverOpen = isOpen;
    }

    @autobind @action onToggleProgramCourseDropdown(isOpen) {
        this.isProgramCourseDropdownOpen = isOpen;
        if (this.isOnboardingPopoverOpen !== false) {
            SystemMessage.seen(SystemMessage.ids.onBoardingForProgramsPopover);
            this.isOnboardingPopoverOpen = false;
        }
    }

    render() {
        const {program, course: currentCourse} = this.props.courseTakingStore;
        if (!currentCourse || !program) {
            return null;
        }

        const videoCourses = program.courses.filter((course) => !course.isPracticeTest);
        const practiceTestCourses = program.courses.filter((course) => course.isPracticeTest);
        const programCourseDropdown = (
            <ProgramCourseDropdown
                id={this.programCourseDropdownId}
                title={currentCourse.title}
                isOpen={this.isProgramCourseDropdownOpen}
                onToggle={this.onToggleProgramCourseDropdown}
            >
                {videoCourses.length > 0 && (
                    <div styleName="dropdown-menu-header dropdown-menu-item">
                        {gettext('Courses')}
                    </div>
                )}
                <Dropdown.Menu>
                    {videoCourses.map((course) => (
                        <Dropdown.MenuItem
                            key={course.id}
                            href={course.url}
                            styleName={classNames('dropdown-menu-item', {
                                active: course.id === currentCourse.id,
                            })}
                            icon={<VideoGroupIcon label={false} />}
                        >
                            {course.title}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
                <div styleName="dropdown-menu-header dropdown-menu-item">
                    {gettext('Practice tests')}
                </div>
                {practiceTestCourses.length === 0 && (
                    <div className="ud-text-sm" styleName="dropdown-menu-item dropdown-menu-empty">
                        {gettext('This program doesn’t have a practice test yet')}
                    </div>
                )}
                <Dropdown.Menu>
                    {practiceTestCourses.map((course) => (
                        <Dropdown.MenuItem
                            key={course.id}
                            href={course.url}
                            styleName={classNames('dropdown-menu-item', {
                                active: course.id === currentCourse.id,
                            })}
                            icon={<BarChartIcon label={false} />}
                        >
                            {course.title}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </ProgramCourseDropdown>
        );
        return (
            <div styleName="sub-header">
                <SystemMessagePopover
                    placement="right"
                    systemMessageId={SystemMessage.ids.onBoardingForProgramsPopover}
                    styleName="popper"
                    isOpen={this.isOnboardingPopoverOpen}
                    onToggle={this.onToggleOnboardingPopover}
                    trigger={programCourseDropdown}
                >
                    <div>
                        {gettext(
                            'Click here to navigate between courses and practice tests in this program',
                        )}
                    </div>
                </SystemMessagePopover>
            </div>
        );
    }
}
