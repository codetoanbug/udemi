import Observer from '@researchgate/react-intersection-observer';
import {LocalizedHtml} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CourseAlternativesContainer from 'course-landing-page/components/limited-access-container/course-alternatives-container.react-component';
import {COURSE_RETIREMENT_ALERT_TYPES} from 'learning-path/learning-path-page/constants';
import pageEventTracker from 'learning-path/learning-path-page/page-event-tracker';
import {BUTTON_ADD_TO_PATH} from 'organization-common/course-retirement/constants';
import {retirementDateFormat} from 'organization-common/course-retirement/utils';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import AddContentButton from '../add-content/add-content-button.react-component';

import './to-be-retired-course-alert.less';

const udConfig = getConfigData();

@inject('learningPathStore', 'actionCallbacks')
@observer
export default class ToBeRetiredCourseAlert extends React.Component {
    static propTypes = {
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        index: PropTypes.number.isRequired,
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        actionCallbacks: PropTypes.shape({
            handleEditClick: PropTypes.func,
        }).isRequired,
    };

    get title() {
        const {item} = this.props;

        return interpolate(
            gettext(
                'The course above is set to be retired from the %(product)s content collection on %(retirementDate)s and will be removed from this path. Learners enrolled in this course won’t lose access to it.',
            ),
            {
                product: udConfig.brand.product_name,
                retirementDate: retirementDateFormat(item.content.retirementDate),
            },
            true,
        );
    }

    get subtitle() {
        const {item, index, learningPathStore} = this.props;
        const {isEditModeEnabled} = learningPathStore;

        return (
            <>
                <LocalizedHtml
                    html={gettext(
                        'We’re always updating our content collection to ensure you have access to fresh and relevant courses that help you achieve your outcomes. ' +
                            '<a class="learnMore">Learn more</a>.',
                    )}
                    interpolate={{
                        learnMore: (
                            <a
                                href={udLink.toSupportLink('course_retirements', true)}
                                className="ud-link-neutral ud-link-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={this.onLearnMoreClick}
                            />
                        ),
                    }}
                />
                {isEditModeEnabled && (
                    <>
                        <div styleName="course-alternatives-container-wrapper">
                            <CourseAlternativesContainer
                                store={item.courseAlternativeStore}
                                buttonProps={{
                                    type: BUTTON_ADD_TO_PATH.TYPE,
                                    index,
                                    section: item.learningPathSection,
                                }}
                                className="course-alternative-container"
                            />
                        </div>
                        <div styleName="add-content-button-wrapper">
                            <AddContentButton
                                section={item.learningPathSection}
                                sectionIndex={index}
                                size="medium"
                                context="to-be-retired-alert"
                                id={`add-content-from-course-retirement-warning-section-${item.learningPathSection.id}`}
                            />
                        </div>
                    </>
                )}
            </>
        );
    }

    @autobind
    onLearnMoreClick() {
        pageEventTracker.clickedLearnMore(
            this.props.item.content.courseId,
            COURSE_RETIREMENT_ALERT_TYPES.TO_BE_RETIRED,
        );
    }

    @autobind
    onEditPathClick() {
        this.props.actionCallbacks.handleEditClick();
        pageEventTracker.clickedEditPath(
            this.props.item.content.courseId,
            COURSE_RETIREMENT_ALERT_TYPES.TO_BE_RETIRED,
        );
    }

    @autobind
    onIntersect(event, unobserve) {
        if (event.isIntersecting) {
            pageEventTracker.viewedCourseRetirementAlert(
                this.props.item,
                COURSE_RETIREMENT_ALERT_TYPES.TO_BE_RETIRED,
            );
            unobserve();
        }
    }

    render() {
        const {learningPathStore} = this.props;
        const {isEditModeEnabled} = learningPathStore;

        return (
            <Observer onChange={this.onIntersect}>
                <div
                    styleName="course-retirement-alert"
                    onClick={(e) => e.stopPropagation()}
                    aria-hidden="true"
                >
                    <AlertBanner
                        udStyle="warning"
                        title={this.title}
                        body={this.subtitle}
                        dismissButtonProps={false}
                        ctaText={gettext('Edit path')}
                        onAction={() => {
                            this.onEditPathClick();
                        }}
                        showIcon={!this.props.learningPathStore.isMobileViewportSize}
                        showCta={!isEditModeEnabled}
                    />
                </div>
            </Observer>
        );
    }
}
