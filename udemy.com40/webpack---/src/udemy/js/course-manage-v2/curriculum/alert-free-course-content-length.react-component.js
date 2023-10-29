import {LocalizedHtml} from '@udemy/i18n';
import {Link} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
    FREE_COURSE_CONTENT_LENGTH_LIMIT_START_DATE,
} from 'course-manage-v2/constants';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

@inject('store')
@observer
export default class AlertFreeCourseContentLength extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const lang = udMe.language;
        this.freeCourseFAQLink = udLink.toFreeCourseFAQLink(lang);
    }

    render() {
        const {store, ...props} = this.props;
        if (!store.showAlertFreeCourseContentLength) {
            return null;
        }
        return (
            <AlertBanner
                {...props}
                udStyle="warning"
                ctaText={gettext('Dismiss')}
                onAction={store.dismissAlertFreeCourseContentLength}
                dismissButtonProps={false}
                data-purpose="alert-free-course-content"
                title={ninterpolate(
                    'Free courses published or updated after %(date)s must have less than %(hours)s hour of video.',
                    'Free courses published or updated after %(date)s must have less than %(hours)s hours of video.',
                    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                    {
                        date: FREE_COURSE_CONTENT_LENGTH_LIMIT_START_DATE,
                        hours: FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                    },
                )}
                body={
                    <LocalizedHtml
                        className="ud-text-with-links"
                        html={gettext(
                            'If you add or change any video content you will be required ' +
                                'to <a class="priceCenter">select a new price</a> for your course. ' +
                                'To learn more about the new free course experience and policy read our ' +
                                '<a class="freeCourseFAQLink">FAQ on the teaching center</a>.',
                        )}
                        interpolate={{
                            priceCenter: <Link to="/pricing" />,
                            freeCourseFAQLink: (
                                <a
                                    href={this.freeCourseFAQLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                }
            />
        );
    }
}
