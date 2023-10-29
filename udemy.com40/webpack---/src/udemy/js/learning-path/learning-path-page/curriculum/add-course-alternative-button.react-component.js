import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import pageEventTracker from 'learning-path/learning-path-page/page-event-tracker';
import getConfigData from 'utils/get-config-data';

import LearningPathSection from '../../learning-path-section.mobx-model';
import {COURSE_CONTENT_TYPE, COURSE_RETIREMENT_ALERT_TYPES} from '../constants';

@observer
export default class AddCourseAlternativeButton extends React.Component {
    static propTypes = {
        courseUrl: PropTypes.string.isRequired,
        courseId: PropTypes.number.isRequired,
        courseRetirementId: PropTypes.number.isRequired,
        section: PropTypes.instanceOf(LearningPathSection).isRequired,
        itemIndex: PropTypes.number.isRequired,
        buttonProps: PropTypes.shape(Button.propTypes),
        alertType: PropTypes.string,
    };

    static defaultProps = {
        buttonProps: {udStyle: 'secondary', size: 'small'},
        alertType: COURSE_RETIREMENT_ALERT_TYPES.TO_BE_RETIRED,
    };

    @observable isLoading = false;

    @autobind
    async addCourse() {
        const {courseUrl, itemIndex} = this.props;
        const udConfig = getConfigData();
        const absoluteCourseUrl = `${udConfig.brand.organization.domain}${courseUrl}`;

        runInAction(() => {
            this.isLoading = true;
        });
        await this.props.section.createItem(absoluteCourseUrl, COURSE_CONTENT_TYPE, itemIndex);
        runInAction(() => {
            this.isLoading = false;
        });
        pageEventTracker.addedCourseAlternative(
            this.props.courseRetirementId,
            this.props.alertType,
            this.props.courseId,
        );
    }

    render() {
        const {buttonProps} = this.props;

        if (this.isLoading) {
            return <Loader />;
        }

        return (
            <Button onClick={this.addCourse} {...buttonProps}>
                {gettext('Add to path')}
            </Button>
        );
    }
}
