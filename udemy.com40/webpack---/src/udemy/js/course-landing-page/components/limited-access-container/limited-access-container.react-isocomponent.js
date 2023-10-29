import {
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL,
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY,
} from '@udemy/discovery-api';
import {AlertBanner} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import DiscoveryUnitsContainerStore from 'browse/components/discovery-units-container/discovery-units-container.mobx-store';
import DiscoveryUnitsContainer from 'browse/components/discovery-units-container/discovery-units-container.react-component';
import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {BUTTON_ENROLL} from 'organization-common/course-retirement/constants';
import CourseRetirementAlternativesStore from 'organization-common/course-retirement/course-retirement-alternatives.mobx-store';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

import CourseAlternativesContainer from './course-alternatives-container.react-component';

import './limited-access-container.less';

@isomorphic
@observer
export default class LimitedAccessContainer extends Component {
    static propTypes = {
        errorMessage: PropTypes.shape({
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string,
        }).isRequired,
        courseId: PropTypes.number,
        categoryId: PropTypes.number,
        subcategoryId: PropTypes.number,
        labelId: PropTypes.number,
    };

    static defaultProps = {
        courseId: undefined,
        categoryId: undefined,
        subcategoryId: undefined,
        labelId: undefined,
    };

    constructor(props) {
        super(props);
        const {courseId, categoryId, subcategoryId, labelId} = props;
        const labelPageObject = {
            ...(labelId && {label_id: labelId}),
        };
        const catPageObject = {
            ...(categoryId && {category_id: categoryId}),
            ...(subcategoryId && {subcategory_id: subcategoryId}),
        };
        if (labelId) {
            this.labelDiscoveryUnitsContainerStore = new DiscoveryUnitsContainerStore({
                pageType: PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL,
                pageObjectId: courseId,
                pageObject: labelPageObject,
            });
        }
        if (categoryId && subcategoryId) {
            this.catDiscoveryUnitsContainerStore = new DiscoveryUnitsContainerStore({
                pageType: PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY,
                pageObjectId: courseId,
                pageObject: catPageObject,
            });
        }
        this.courseRetirementAlternativesStore = new CourseRetirementAlternativesStore(
            courseId,
            labelId,
        );
    }

    componentDidMount() {
        this.courseRetirementAlternativesStore.getCourseAlternatives();
    }

    /*
        A filter function for discovery units to hide related topics unit if there is
        no best selling unit for the given topic.
    */
    renderUnitsFilter(unit, index, array) {
        const _topicUnitsFilter = (unit) =>
            ['bestseller', 'bestseller_labels'].includes(unit.type) &&
            unit.source_objects?.length &&
            unit.source_objects[0].type === 'course_label';
        const hasComplementaryTopicUnits =
            array.filter((unit) => _topicUnitsFilter(unit)).length > 1;
        return _topicUnitsFilter(unit) ? hasComplementaryTopicUnits : true;
    }

    render() {
        const deviceType = getDeviceType();
        const isMobile = deviceType === DEVICE_TYPE_MOBILE;
        const overridesUnitProps = {
            CourseUnit: {
                fullWidth: isMobile,
                showPager: !isMobile,
                layout: isMobile ? 'multirow' : 'singlerow',
            },
        };
        const {
            errorMessage: {title = '', subtitle = ''},
            categoryId,
            subcategoryId,
            labelId,
        } = this.props;

        const styleName = classNames('container', {
            'with-course-alternatives':
                this.courseRetirementAlternativesStore.courseAlternatives.length > 0,
        });

        return (
            <div styleName={styleName} className="ud-container">
                <div styleName="content">
                    <AlertBanner
                        styleName="content-spacing top-content-spacing"
                        title={
                            <div
                                styleName="alert-banner-title"
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'limited-access-container:title',
                                    html: title,
                                })}
                            />
                        }
                        body={
                            <div
                                styleName="alert-banner-body"
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'limited-access-controller:subtitle',
                                    html: subtitle,
                                    domPurifyConfig: {ADD_ATTR: ['target']},
                                })}
                            />
                        }
                        showCta={false}
                        udStyle="warning"
                    />
                    <CourseAlternativesContainer
                        store={this.courseRetirementAlternativesStore}
                        buttonProps={{
                            type: BUTTON_ENROLL.TYPE,
                            text: BUTTON_ENROLL.TEXT,
                        }}
                    />
                    {labelId && (
                        <DiscoveryUnitsContainer
                            data-purpose="label-discovery-units"
                            deviceType={deviceType}
                            pageType={PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL}
                            store={this.labelDiscoveryUnitsContainerStore}
                            unitPropsByType={overridesUnitProps}
                            filter={this.renderUnitsFilter}
                        />
                    )}
                    {categoryId && subcategoryId && (
                        <DiscoveryUnitsContainer
                            data-purpose="category-discovery-units"
                            deviceType={deviceType}
                            pageType={PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY}
                            store={this.catDiscoveryUnitsContainerStore}
                            unitPropsByType={overridesUnitProps}
                        />
                    )}
                </div>
            </div>
        );
    }
}
