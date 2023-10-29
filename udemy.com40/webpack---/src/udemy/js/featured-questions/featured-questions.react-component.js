import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import udApiStat from 'utils/ud-api-stat';

import {TAUGHT_COURSES_PARAMS, TAUGHT_COURSES_PARAMS_SLIM} from '../instructor/constants';
import FeaturedQuestionsForm from './components/featured-questions-form.react-component';
import FeaturedQuestionsList from './components/featured-questions-list.react-component';
import {DATADOG_METRICS} from './constants';
import FeaturedQuestionsStore from './featured-questions.mobx-store';

import './featured-questions.less';

@inject('instructorStore')
@observer
export class FeaturedQuestions extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
        instructorStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        store: PropTypes.instanceOf(FeaturedQuestionsStore),
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
    };

    static defaultProps = {
        store: undefined,
        isUBOnlyDataPreviewEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
    };

    constructor(props) {
        super(props);
        const {instructorStore} = props;
        this.store = props.store || new FeaturedQuestionsStore({instructorStore});
    }

    componentDidMount() {
        const selectedCourseId = this.getSelectedCourseIdFromQueryParams();
        const taughtCoursesParams = this.props.isTaughtCoursesApiSlimVersionEnabled
            ? TAUGHT_COURSES_PARAMS_SLIM
            : TAUGHT_COURSES_PARAMS;
        this.store.loadInitialTaughtCourses(selectedCourseId, taughtCoursesParams);
        udApiStat.increment(
            DATADOG_METRICS.FEATURED_QUESTION_RENDER,
            {},
            () => true,
            () => false,
        );
    }

    getSelectedCourseIdFromQueryParams() {
        const searchParams = new URLSearchParams(this.props.location.search);
        const selectedCourseId = searchParams.get('course');
        if (selectedCourseId) {
            return parseInt(selectedCourseId, 10);
        }
        return null;
    }

    @autobind
    onCourseSelect(courseId) {
        this.store.selectCourse(courseId);
    }

    @autobind
    toggleShowCreateFeaturedQuestion() {
        this.store.toggleShowCreateFeaturedQuestion();
    }

    render() {
        const allCourseDropdownData = {
            data: this.store.taughtCourses,
            selectedId: this.store.selectedCourseId,
            onCourseSelect: this.onCourseSelect,
            includeAllCourses: false,
        };

        const showLoader = !this.store.ready;
        return (
            <Provider
                featuredQuestionsStore={this.store}
                instructorStore={this.props.instructorStore}
            >
                <MemoizedBrowserRouter>
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Featured Questions')}
                            loaded={!showLoader}
                            allCourseDropdownData={allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        {showLoader && <MainContentLoader />}
                        {!showLoader &&
                            this.store.selectedCourseId !== null &&
                            (this.store.showCreateFeatureQuestion ? (
                                <FeaturedQuestionsList
                                    courseId={this.store.selectedCourseId}
                                    baseUrl={this.props.baseUrl}
                                    location={this.props.location}
                                    showCreateFeatureQuestion={this.store.showCreateFeatureQuestion}
                                    onShowCreateFeaturedQuestion={
                                        this.toggleShowCreateFeaturedQuestion
                                    }
                                />
                            ) : (
                                <FeaturedQuestionsForm courseId={this.store.selectedCourseId} />
                            ))}
                    </div>
                </MemoizedBrowserRouter>
            </Provider>
        );
    }
}

export default withRouter(FeaturedQuestions);
