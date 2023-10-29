import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Meter} from '@udemy/react-messaging-components';
import {
    TakeOverWizard,
    getWizardMeterLabel,
    getWizardHeaderText,
} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CourseCreateActionEvent} from 'course-manage-v2/events';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import CourseCategoryPage from './course-category-page.react-component';
import CourseTimePage from './course-time-page.react-component';
import CourseTitlePage from './course-title-page.react-component';
import CourseTypePage from './course-type-page.react-component';
import CreateCourseFlowStore from './create-course-flow.mobx-store';

import './create-course-flow.less';

const udConfig = getConfigData();

const contentMap = new Map([
    [1, (store) => <CourseTypePage store={store} />],
    [2, (store) => <CourseTitlePage store={store} />],
    [3, (store) => <CourseCategoryPage store={store} />],
    [4, (store) => <CourseTimePage store={store} />],
]);

const ufbContentMap = new Map([[1, (store) => <CourseTitlePage store={store} />]]);

@observer
export default class CreateFlowWrapper extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        returnUrl: PropTypes.string,
        window: PropTypes.object,
        store: PropTypes.object,
        isIP: PropTypes.bool,
        isInSupplyGapsTargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        returnUrl: undefined,
        window,
        store: undefined,
        isIP: false,
        isInSupplyGapsTargetGroup: false,
    };

    constructor(props) {
        super(props);
        const {isIP, isInSupplyGapsTargetGroup} = this.props;
        this.store = this.props.store || new CreateCourseFlowStore();
        this.store.setIsIP(isIP);
        this.store.setIsInSupplyGapsTargetGroup(isInSupplyGapsTargetGroup);
        this.isUfb = udConfig.brand.organization;
        if (this.store.currentPageNum !== this.props.match.params.currentPageNum) {
            // if user navigates to a page directly, data from prior pages is missing and user
            // should be redirected to the first page
            if (!this.store.priorPagesCompleted(this.props.match.params.currentPageNum)) {
                this.props.history.replace('/1');
            }
            this.store.setPage(this.props.match.params.currentPageNum);
        }
        this.trackEvent('show', this.store.currentPage);
    }

    UNSAFE_componentWillUpdate(nextProps) {
        const currentPageNumber = parseInt(this.props.match.params.currentPageNum || 1, 10);
        const nextPageNumber = parseInt(nextProps.match.params.currentPageNum || 1, 10);
        if (currentPageNumber !== nextPageNumber) {
            this.store.setPage(nextPageNumber);
            this.trackEvent('show', this.store.currentPage);
        }
    }

    getPageContent() {
        const store = this.store;
        const pageFactory = this.isUfb
            ? ufbContentMap.get(store.currentPageNum)
            : contentMap.get(store.currentPageNum);
        if (pageFactory) {
            return pageFactory(store);
        }
        return null;
    }

    trackEvent(action, step) {
        Tracker.publishEvent(new CourseCreateActionEvent({step, action}));
    }

    @autobind
    goToPreviousPage() {
        this.props.history.push(`/${this.store.currentPageNum - 1}`);
    }

    @autobind
    goToNextPage() {
        this.props.history.push(`/${this.store.currentPageNum + 1}`);
    }

    @autobind
    onExit() {
        this.trackEvent('exit', this.store.currentPage);
        this.props.window.location.href = this.props.returnUrl || udLink.to('home', 'teaching');
    }

    @autobind
    onFinish() {
        const onFinishPromise = this.isUfb ? this.store.createCourse : this.store.finishFlow;
        onFinishPromise().then(() => {
            if (this.store.courseId) {
                this.trackEvent('finish', this.store.currentPage);
                this.props.window.location.href = `/instructor/course/${this.store.courseId}/manage/goals`;
            }
        });
    }

    render() {
        const {currentPageNum, totalNumPages, nextDisabled} = this.store;
        const isLastPage = currentPageNum === totalNumPages;
        const progress = {value: currentPageNum, min: 0, max: totalNumPages};
        return (
            <TakeOverWizard
                headerProps={{
                    centerChildren: this.isUfb ? null : getWizardHeaderText(progress),
                    rightChildren: (
                        <Button data-purpose="exit-button" udStyle="ghost" onClick={this.onExit}>
                            {gettext('Exit')}
                        </Button>
                    ),
                    progressBar: (
                        <Meter
                            {...progress}
                            label={getWizardMeterLabel(progress, {gettext, interpolate})}
                        />
                    ),
                }}
                footerProps={{
                    leftChildren: currentPageNum > 1 && (
                        <Button udStyle="secondary" onClick={this.goToPreviousPage}>
                            {gettext('Previous')}
                        </Button>
                    ),
                    rightChildren: (
                        <Button
                            disabled={nextDisabled}
                            onClick={isLastPage ? this.onFinish : this.goToNextPage}
                        >
                            {isLastPage ? gettext('Create Course') : gettext('Continue')}
                        </Button>
                    ),
                }}
            >
                <div styleName="takeover-content">{this.getPageContent()}</div>
            </TakeOverWizard>
        );
    }
}
