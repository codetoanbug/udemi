import {LocalizedHtml} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import React, {Component} from 'react';

import {parseDateString, toLocalDateStamp, toLocaleDateString} from 'utils/date';
import udLink from 'utils/ud-link';

import {RETIREMENT_CUTOUT_MONTHS} from './constants';

import './course-retirement-badge.less';

export interface CourseRetirementBadgeProps {
    courseTitle: string;
    retirementDate: string;
    showIcon?: boolean;
    isCourseAvailableInOrg?: boolean;
    className?: string;
}

export class CourseRetirementBadge extends Component<CourseRetirementBadgeProps> {
    static defaultProps = {
        showIcon: true,
        isCourseAvailableInOrg: true,
    };

    get retirementDateFormat() {
        // in case we get retirementDate as DateTime instead of Date
        const date = toLocalDateStamp(new Date(this.props.retirementDate));
        return parseDateString(date, 'ISO');
    }

    get isRetired() {
        const {isCourseAvailableInOrg} = this.props;
        const today = new Date();

        return this.retirementDateFormat < today && !isCourseAvailableInOrg;
    }

    get badgeCopy() {
        const dateString = toLocaleDateString(this.retirementDateFormat, {
            month: 'short',
            day: 'numeric',
        });

        const badgeCopy = this.isRetired
            ? gettext('Retired')
            : interpolate(gettext('To be retired on %(dateString)s'), {dateString}, true);

        return badgeCopy;
    }

    get isRetiredTooltipCopy() {
        return (
            <LocalizedHtml
                html={ninterpolate(
                    'This course was retired more than %(months)s month ago and won’t be shown on the Course updates page. You’ll still have access to insights and enrolled learners can keep learning. <a class="link">Learn more.</a>',
                    'This course was retired more than %(months)s months ago and won’t be shown on the Course updates page. You’ll still have access to insights and enrolled learners can keep learning. <a class="link">Learn more.</a>',
                    RETIREMENT_CUTOUT_MONTHS,
                    {months: RETIREMENT_CUTOUT_MONTHS},
                )}
                interpolate={{
                    link: (
                        <a
                            href={udLink.toSupportLink('course_retirements', true)}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        );
    }

    get tooltipCopy() {
        const {courseTitle} = this.props;

        const today = new Date();
        const before3months = new Date(today.setMonth(today.getMonth() - 3));

        const tooltipCopy =
            this.isRetired && this.retirementDateFormat < before3months ? (
                this.isRetiredTooltipCopy
            ) : (
                <LocalizedHtml
                    html={gettext(
                        'You’ll still have access to insights and enrolled learners can keep learning. ' +
                            'For more information and alternative courses go to the <a class="link">Course updates</a> page.',
                    )}
                    interpolate={{
                        link: (
                            <a
                                href={`/organization-manage/courses/course-updates/?search=${courseTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            );

        return tooltipCopy;
    }

    render() {
        const {showIcon, className} = this.props;

        const classes = classNames('badge', {'is-retired': this.isRetired});

        return (
            <div styleName="badge-wrapper" className={className}>
                <Badge styleName={classes} data-purpose="retirement-badge-copy">
                    {this.badgeCopy}
                </Badge>
                {showIcon && (
                    <Popover
                        placement="bottom"
                        styleName="icon-wrapper"
                        trigger={<InfoOutlineIcon label={false} size="small" />}
                        canToggleOnHover={true}
                        withPadding={false}
                    >
                        <div
                            styleName="icon-tooltip-wrapper"
                            data-purpose="retirement-badge-tooltip-copy"
                        >
                            {this.tooltipCopy}
                        </div>
                    </Popover>
                )}
            </div>
        );
    }
}
