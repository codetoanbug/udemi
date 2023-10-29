import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS} from 'course-manage-v2/constants';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import udLink from 'utils/ud-link';

import '../price.less';

@observer
export default class OwnerOptIn extends Component {
    static propTypes = {
        isOwnerOptedIntoDeals: PropTypes.bool.isRequired,
        isPracticeTestCourse: PropTypes.bool.isRequired,
        publishedPracticeTestCount: PropTypes.number.isRequired,
    };

    localizedMatrixUrl() {
        return udLink.toStorageStaticAsset('support/Udemy+Price+Tier+Matrix-V3.pdf');
    }

    getPracticeCourseMessage() {
        let message = '';
        if (this.props.isPracticeTestCourse) {
            message = gettext('Practice test only courses can not be free.');
        } else if (this.props.publishedPracticeTestCount > 0) {
            message = gettext('Courses with practice tests can not be free.');
        }
        return message && <div data-purpose="practice-course-message">{message}</div>;
    }

    getOwnerMarketingText() {
        if (this.props.isOwnerOptedIntoDeals) {
            return gettext(
                "Please select the price tier for your course below and click 'Save'. In markets where" +
                    ' Udemy is not optimizing your list price, the list price that students will see in other currencies' +
                    ' is determined using the <a href="%(url)s" target="_blank" rel="no opener no referrer">price tier matrix</a>.',
            );
        }
        return gettext(
            "Please select the price tier for your course below and click 'Save'. The list price that students " +
                'will see in other currencies is determined using the' +
                ' <a href="%(url)s" target="_blank" rel="no opener no referrer">price tier matrix</a>.',
        );
    }

    render() {
        return (
            <>
                {this.props.isOwnerOptedIntoDeals && (
                    <>
                        <h3 className="ud-heading-md" styleName="opt-in-section-title">
                            {gettext('Udemy Deals and List Price')}
                        </h3>
                        <p>{gettext('You are opted into the Udemy Deals program.')}</p>
                        <p>
                            {gettext(
                                'Since you participate in the Udemy Deals program, Udemy optimizes your list ' +
                                    'price in most currencies and offers your course at a compelling discount' +
                                    ' via targeted promotions.',
                            )}
                        </p>
                        <p>
                            {gettext(
                                "In markets where Udemy doesn't currently display an optimized list price," +
                                    ' we show a list price chosen by the instructor.',
                            )}
                        </p>
                    </>
                )}
                <h3 className="ud-heading-md" styleName="opt-in-section-title">
                    {gettext('Course Price Tier')}
                </h3>
                <p
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'price-form:link-to-price-tier-matrix',
                        domPurifyConfig: {ADD_ATTR: ['target']},
                        html: interpolate(
                            this.getOwnerMarketingText(),
                            {url: this.localizedMatrixUrl()},
                            true,
                        ),
                    })}
                />
                <p>
                    {ninterpolate(
                        'If you intend to offer your course for free, ' +
                            'the total length of video content must be less than %(hours)s hour.',
                        'If you intend to offer your course for free, ' +
                            'the total length of video content must be less than %(hours)s hours.',
                        FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                        {
                            hours: FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                        },
                    )}
                </p>
                {this.getPracticeCourseMessage()}
            </>
        );
    }
}
