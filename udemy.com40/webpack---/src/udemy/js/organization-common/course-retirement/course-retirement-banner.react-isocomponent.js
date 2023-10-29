import {Tracker} from '@udemy/event-tracking';
import {AlertBanner} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import getConfigData from 'utils/get-config-data';
import {isomorphic} from 'utils/isomorphic-rendering';

import {COURSE_ALTERNATIVE_MESSAGE, LEARN_MORE} from './constants';
import CourseAlternatives from './course-alternatives.react-component';
import CourseRetirementAlternativesStore from './course-retirement-alternatives.mobx-store';
import {CourseRetirementBannerViewEvent} from './events';
import {retirementDateFormat} from './utils';

import './course-retirement-banner.less';

@isomorphic
@observer
export default class CourseRetirementBanner extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        courseLabelId: PropTypes.number.isRequired,
        displayShowMore: PropTypes.bool,
        className: PropTypes.string,
    };

    static defaultProps = {
        displayShowMore: true,
        className: null,
    };

    constructor(props) {
        super(props);
        this.store = new CourseRetirementAlternativesStore(props.courseId, props.courseLabelId);
    }

    async componentDidMount() {
        await this.store.getCourseAlternatives();
        this.store.courseRetirement && this.trackRetirementBannerView();
    }

    trackRetirementBannerView() {
        Tracker.publishEvent(
            new CourseRetirementBannerViewEvent({
                courseId: this.props.courseId,
            }),
        );
    }

    renderLearnMoreLink() {
        return (
            <a href={LEARN_MORE.LINK} target="_blank" rel="noopener noreferrer">
                {gettext('Learn more.')}
            </a>
        );
    }

    get title() {
        const udConfig = getConfigData();
        const dateFormat = retirementDateFormat(this.store.courseRetirement.retirement_date);

        return interpolate(
            gettext(
                'This course is set to be retired from the %(productName)s content collection on %(retirementDate)s.',
            ),
            {productName: udConfig.brand.product_name, retirementDate: dateFormat},
            true,
        );
    }

    renderContent() {
        return (
            <>
                <AlertBanner
                    udStyle="information"
                    title={this.title}
                    showCta={false}
                    body={
                        <p>
                            {COURSE_ALTERNATIVE_MESSAGE.TEXT} {this.renderLearnMoreLink()}
                        </p>
                    }
                    styleName={classNames(
                        !this.store.courseAlternatives.length && 'no-alternatives',
                    )}
                />
                {this.store.courseAlternatives.length ? (
                    <CourseAlternatives
                        styleName="alternatives-with-border"
                        courses={this.store.courseAlternatives.slice()}
                        displayShowMore={this.props.displayShowMore}
                        courseToBeRetiredId={this.props.courseId}
                    />
                ) : null}
            </>
        );
    }

    render() {
        return (
            <div data-purpose="course-retirement" className={this.props.className}>
                {this.store.isLoading || !this.store.courseRetirement ? null : this.renderContent()}
            </div>
        );
    }
}
