import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {serverOrClient} from '@udemy/shared-utils';
import {withUDData} from '@udemy/ud-data';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RETIREMENT_ALERT_MODAL_ACTIONS, SHOW_ALTERNATIVES_URL_PARAM} from './constants';
import styles from './course-retirement-modal-alert.less';
import CourseRetirementStore from './course-retirement.mobx-store';
import {CourseRetirementModalAlertActionEvent, CourseRetirementModalAlertViewEvent} from './events';
import {retirementDateFormat} from './utils';

@observer
class InternalCourseRetirementModalAlert extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        modalType: PropTypes.string.isRequired,
        getTitle: PropTypes.func,
        isSubmitting: PropTypes.bool,
        udData: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        getTitle: undefined,
        isSubmitting: false,
    };

    constructor(props) {
        super(props);
        this.store = new CourseRetirementStore(props.courseId, {
            Config: props.udData.Config,
        });
    }

    async componentDidMount() {
        await this.store.fetchCourseRetirement(this.props.udData.Config.brand.organization.id);
        if (this.store.courseRetirement) {
            this.trackAlertView();
        }
    }

    get window() {
        return serverOrClient.global;
    }

    linkToClp = () => {
        Tracker.publishEvent(
            new CourseRetirementModalAlertActionEvent({
                courseId: this.props.courseId,
                modalType: this.props.modalType,
                action: RETIREMENT_ALERT_MODAL_ACTIONS.CLICKED_ALTERNATIVES_LINK,
            }),
        );
        // Redirects to clp, where we scroll to retired course banner and expand alternatives
        this.window.open(`/${this.props.courseId}?${SHOW_ALTERNATIVES_URL_PARAM}`);
    };

    renderViewLink = () => {
        return (
            <Button
                className={styles['view-alternatives-button']}
                data-purpose="view-alternatives-button"
                typography="ud-text-md"
                udStyle="link"
                onClick={this.linkToClp}
            >
                {this.props.gettext('View alternative courses')}
            </Button>
        );
    };

    get defaultTitle() {
        const {gettext, interpolate} = this.props;
        return interpolate(
            gettext(
                'This course is set to be retired from %(productName)s on %(retirementDate)s but enrolled learners won’t lose access to it.',
            ),
            {
                productName: this.props.udData.Config.brand.product_name,
                retirementDate: retirementDateFormat(this.store.courseRetirement.retirement_date),
            },
            true,
        );
    }

    getTitle = () => {
        const formattedRetirementDate = retirementDateFormat(
            this.store.courseRetirement.retirement_date,
        );
        if (this.props.getTitle) {
            return this.props.getTitle(formattedRetirementDate);
        }
        return this.defaultTitle;
    };

    trackAlertView = () => {
        Tracker.publishEvent(
            new CourseRetirementModalAlertViewEvent({
                courseId: this.props.courseId,
                modalType: this.props.modalType,
            }),
        );
    };

    trackModalSubmit = () => {
        Tracker.publishEvent(
            new CourseRetirementModalAlertActionEvent({
                courseId: this.props.courseId,
                modalType: this.props.modalType,
                action: RETIREMENT_ALERT_MODAL_ACTIONS.SUBMITTED_MODAL,
            }),
        );
    };

    render() {
        if (this.store.isLoading || !this.store.courseRetirement) {
            return null;
        }

        if (this.props.isSubmitting) {
            this.trackModalSubmit();
        }

        return (
            <AlertBanner
                className={styles['retirement-alert']}
                udStyle="warning"
                title={this.getTitle()}
                showCta={false}
                body={<p>{this.renderViewLink()}</p>}
            />
        );
    }
}

const CourseRetirementModalAlert = withI18n(withUDData(InternalCourseRetirementModalAlert));
export default CourseRetirementModalAlert;
