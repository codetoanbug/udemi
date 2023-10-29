import LanguageIcon from '@udemy/icons/dist/language.ud-icon';
import NewIcon from '@udemy/icons/dist/new.ud-icon';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import deviceType, {DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import CaptionDesktop from 'course-landing-page/components/caption/caption-desktop.react-isocomponent';
import CaptionMobile from 'course-landing-page/components/caption/caption-mobile.react-isocomponent';
import getRequestData from 'utils/get-request-data';

import CourseStats from './course-stats.react-component';

import './course-lead.less';

@inject(({resourceContextMenu}) => ({
    resourceContextMenu,
}))
@deviceType
export default class CourseLead extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        deviceType: PropTypes.string.isRequired,
        className: PropTypes.string,
        resourceContextMenu: PropTypes.object,
    };

    static defaultProps = {
        className: null,
        resourceContextMenu: {},
    };

    get renderCourseStats() {
        const {courseTakingStore} = this.props;
        const course = {
            ...courseTakingStore.courseLeadData,
            num_subscribers: courseTakingStore.course.numSubscribers,
            content_info: courseTakingStore.course.contentLengthText,
        };
        return <CourseStats styleName="course-stats" data-purpose="course-stats" course={course} />;
    }

    get renderCourseDate() {
        const {courseTakingStore} = this.props;
        const userLocale = getRequestData().locale.replace('_', '-') || 'en-US';
        const courseDate = courseTakingStore.courseLeadData.last_update_date
            ? {
                  type: gettext('Last updated'),
                  date: new Date(
                      courseTakingStore.courseLeadData.last_update_date,
                  ).toLocaleDateString(userLocale, {
                      month: 'long',
                      year: 'numeric',
                  }),
              }
            : {
                  type: gettext('Published'),
                  date: new Date(
                      courseTakingStore.courseLeadData.published_time,
                  ).toLocaleDateString(userLocale, {
                      month: 'long',
                      year: 'numeric',
                  }),
              };
        return (
            <div styleName="course-date" className="ud-text-sm" data-purpose="course-date">
                <NewIcon styleName="meta-icon" size="xsmall" label={false} />
                {courseDate.type} {courseDate.date}
            </div>
        );
    }

    get renderLanguages() {
        const {courseTakingStore, deviceType} = this.props;

        return (
            <div styleName="language-wrapper" data-purpose="language">
                <div styleName="caption" className="ud-text-sm">
                    <LanguageIcon styleName="meta-icon" size="xsmall" label={false} />
                    {/* eslint-disable-next-line gettext/no-variable-string */}
                    {gettext(courseTakingStore.course.locale.simple_english_title)}
                </div>
                {deviceType === DEVICE_TYPE_MOBILE ? (
                    <CaptionMobile
                        captioned_languages={courseTakingStore.courseLeadData.captionedLanguages}
                    />
                ) : (
                    <CaptionDesktop
                        captioned_languages={courseTakingStore.courseLeadData.captionedLanguages}
                    />
                )}
            </div>
        );
    }

    render() {
        const {className, courseTakingStore} = this.props;
        return (
            <div className={className}>
                <div styleName="course-title" className="ud-text-md" data-purpose="title">
                    {courseTakingStore.course.headline}
                </div>
                {this.renderCourseStats}
                {this.renderCourseDate}
                {this.renderLanguages}
            </div>
        );
    }
}
