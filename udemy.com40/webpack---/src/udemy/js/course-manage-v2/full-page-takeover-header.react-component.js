import {LocalizedHtml} from '@udemy/i18n';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import SettingsIcon from '@udemy/icons/dist/settings.ud-icon';
import {Button, IconButton, Link} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Badge} from '@udemy/react-messaging-components';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './full-page-takeover-header.less';

@observer
export default class FullPageTakeoverHeader extends Component {
    static propTypes = {
        pageStore: PropTypes.shape({
            action: PropTypes.string,
            subaction: PropTypes.string,
            headerActions: PropTypes.func,
            courseLoaded: PropTypes.bool,
            course: PropTypes.shape({
                title: PropTypes.string,
                qualityStatus: PropTypes.string,
                statusLabel: PropTypes.string,
                learnUrl: PropTypes.string,
                visibleInstructors: mobxTypes.arrayOrObservableArray,
                canEdit: PropTypes.bool,
                isLive: PropTypes.bool,
                contentLengthVideo: PropTypes.number,
            }),
        }),
    };

    static defaultProps = {
        pageStore: {
            action: '',
            subaction: '',
            headerActions: noop,
            course: {
                title: '',
                qualityStatus: '',
                statusLabel: '',
                learnUrl: '',
                visibleInstructors: [],
                canEdit: false,
                isLive: false,
                contentLengthVideo: 0,
            },
        },
    };

    render() {
        if (!this.props.pageStore.courseLoaded) {
            return null;
        }

        const {course, headerActions} = this.props.pageStore;
        return (
            <div className="cm-full-page-takeover-header" styleName="row header">
                <div>
                    <Button
                        udStyle="ghost"
                        size="small"
                        typography="ud-text-md"
                        componentClass="a"
                        href="/instructor/courses"
                        styleName="back-btn"
                        aria-label={gettext('Back to courses')}
                    >
                        <PreviousIcon label={false} size="medium" />
                        <span aria-hidden={true} styleName="back-to-courses">
                            {gettext('Back to courses')}
                        </span>
                    </Button>
                </div>
                <div styleName="flex row content">
                    <div styleName="flex row left">
                        <h1 className="ud-heading-lg" styleName="title" data-purpose="course-title">
                            {course.title}
                        </h1>
                        <Badge styleName="status">{course.statusLabel}</Badge>
                        <LocalizedHtml
                            html={interpolate(
                                course.canTogglePublishedState
                                    ? gettext(
                                          '<span class="duration">%(duration)s</span> of video content published',
                                      )
                                    : gettext(
                                          '<span class="duration">%(duration)s</span> of video content uploaded',
                                      ),
                                true,
                            )}
                            interpolate={{
                                duration: (
                                    <Duration
                                        numSeconds={course.contentLengthVideo}
                                        precision={Duration.PRECISION.MINUTES}
                                    />
                                ),
                            }}
                        />
                    </div>
                    {headerActions && headerActions()}
                    {course.canEdit && (
                        <IconButton
                            udStyle="ghost"
                            size="small"
                            componentClass={Link}
                            to="/settings"
                            styleName="settings-btn"
                        >
                            <SettingsIcon size="medium" label={gettext('Course Settings')} />
                        </IconButton>
                    )}
                </div>
            </div>
        );
    }
}
