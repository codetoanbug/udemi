import {AlertBanner} from '@udemy/react-messaging-components';
import {Accordion, Loader} from '@udemy/react-reveal-components';
import {observer, PropTypes as ObservablePropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {BadgeSidebar} from '../badge-sidebar/badge-sidebar.react-component';
import requires from '../registry/requires';
import Section from './section.react-component';
import './course-content.less';

@requires('courseTakingStore')
@observer
export default class CourseContent extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            isLoading: PropTypes.bool,
            curriculumSections: ObservablePropTypes.arrayOrObservableArray,
            coursePortion: PropTypes.object,
            courseCertificates: ObservablePropTypes.arrayOrObservableArray,
            course: PropTypes.object,
        }).isRequired,
        showBadgeDueDateModule: PropTypes.bool,
    };

    static defaultProps = {
        showBadgeDueDateModule: false,
    };

    get portionAlert() {
        const {coursePortion} = this.props.courseTakingStore;
        return (
            <AlertBanner
                showCta={false}
                styleName="alert-banner"
                title={ninterpolate(
                    '%(items)s item has been selected from this course',
                    '%(items)s items have been selected from this course',
                    coursePortion.numSelectedItems,
                    {items: coursePortion.numSelectedItems},
                )}
            />
        );
    }

    render() {
        const {courseTakingStore} = this.props;
        const {curriculumSections, isContentTabInDashboard, isLoading} = courseTakingStore;

        if (isLoading) {
            return isContentTabInDashboard ? (
                <Loader size="xxlarge" block={true} />
            ) : (
                <Loader size="large" block={true} styleName="sidebar-loader" />
            );
        }

        return (
            <div className={isContentTabInDashboard ? '' : 'ct-sidebar-course-content'}>
                {this.props.courseTakingStore.coursePortion && this.portionAlert}
                {this.props.showBadgeDueDateModule && (
                    <BadgeSidebar
                        badge={this.props.courseTakingStore.courseCertificates[0]}
                        userId={UD.me.id}
                        courseId={this.props.courseTakingStore.course.id}
                    />
                )}
                <Accordion size="medium" data-purpose="curriculum-section-container">
                    {curriculumSections.map((section, index) => (
                        <Section
                            key={section.id}
                            index={index}
                            section={section}
                            curriculumItems={section.items}
                        />
                    ))}
                </Accordion>
            </div>
        );
    }
}
