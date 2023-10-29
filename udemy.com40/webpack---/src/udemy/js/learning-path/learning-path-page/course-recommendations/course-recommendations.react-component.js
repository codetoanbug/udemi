import {Button} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import {Meter} from '@udemy/react-messaging-components';
import {
    TakeOverWizard,
    getWizardMeterLabel,
    getWizardHeaderText,
} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import {showErrorToast} from 'organization-common/toasts';
import Raven from 'utils/ud-raven';

import {LEARNING_PATH_ERROR_MESSAGES} from '../constants';
import courseRecommendationsEventTracker from './course-recommendations-event-tracker';
import styles from './course-recommendations.less';
import CourseRecommendationsStore from './course-recommendations.mobx-store';

@inject('learningPathStore')
@observer
export default class CourseRecommendations extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new CourseRecommendationsStore();
        courseRecommendationsEventTracker.setPathId(this.props.learningPathStore.learningPath.id);
    }

    async componentDidMount() {
        document.body.classList.add(styles.open);
        await this.store.fetchThemes();
    }

    componentWillUnmount() {
        document.body.classList.remove(styles.open);
    }

    @computed
    get headerProps() {
        const progress = {value: this.store.currentPageNum + 1, min: 0, max: this.store.totalPages};
        const headerText = getWizardHeaderText(progress);
        const progressBar = (
            <Meter {...progress} label={getWizardMeterLabel(progress, {gettext, interpolate})} />
        );
        const exitButton = (
            <Button
                disabled={this.store.isSaving}
                data-purpose="exit-button"
                udStyle="ghost"
                onClick={this.handleExitButtonClick}
            >
                {gettext('Exit')}
            </Button>
        );
        return {centerChildren: headerText, rightChildren: exitButton, progressBar};
    }

    @computed
    get footerProps() {
        const isTopicsPage = this.store.currentPageNum === 1;
        const footer = (
            <div styleName="footer">
                {this.store.currentPageNum > 0 ? (
                    <Button udStyle="secondary" onClick={this.handlePreviousButtonClick}>
                        {gettext('Previous')}
                    </Button>
                ) : (
                    <div>
                        {/* This right-aligns "Next" button on small screens via space-between. */}
                    </div>
                )}
                {isTopicsPage && (
                    <div styleName="footer-checkbox">
                        <Checkbox
                            data-purpose="add-section-headings-checkbox"
                            defaultChecked={this.store.isAddSectionHeadingsChecked}
                            onChange={this.handleChangeAddSectionHeadings}
                        >
                            {gettext('Add skills as section headings')}
                        </Checkbox>
                    </div>
                )}
                {isTopicsPage ? (
                    <Button
                        disabled={this.store.isSaving || !this.store.checkedCoursesForTopic.length}
                        onClick={this.addRecommendedCourses}
                    >
                        {gettext('Add to learning path')}
                    </Button>
                ) : (
                    <Button
                        disabled={!this.store.hasMinCheckedThemes}
                        onClick={this.handleNextButtonClick}
                    >
                        {gettext('Next')}
                    </Button>
                )}
            </div>
        );
        return {leftChildren: footer};
    }

    @autobind
    async addRecommendedCourses() {
        const {isAddSectionHeadingsChecked} = this.store;
        const {
            hideCourseRecommendations,
            insertSectionsAfterCurrent,
            insertCoursesInCurrentSection,
        } = this.props.learningPathStore;
        this.store.setIsSaving(true);

        try {
            if (isAddSectionHeadingsChecked) {
                await insertSectionsAfterCurrent(this.store.checkedCoursesForTopic);
            } else {
                await insertCoursesInCurrentSection(this.store.checkedCourseIds);
            }
            courseRecommendationsEventTracker.addedCoursesToPath(
                this.store.checkedCourseIds,
                isAddSectionHeadingsChecked,
            );
        } catch (e) {
            // Capture error and show notification
            Raven.captureException(e);
            showErrorToast(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_ADD_CONTENT);
        } finally {
            this.store.setIsSaving(false);
            hideCourseRecommendations();
        }
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    @autobind
    handleChangeAddSectionHeadings(event) {
        this.store.setIsAddSectionHeadingsChecked(event.target.checked);
    }

    @autobind
    handleNextButtonClick() {
        this.scrollToTop();
        this.store.fetchTopics().then(() => {
            return this.store.onNextClick();
        });
    }

    @autobind
    handlePreviousButtonClick() {
        this.scrollToTop();
        return this.store.onPrevClick();
    }

    @autobind
    handleExitButtonClick() {
        this.store.clearSelection();
        this.props.learningPathStore.hideCourseRecommendations();
    }

    render() {
        const Component = this.store.PAGES[this.store.currentPageNum];
        return ReactDOM.createPortal(
            <Provider courseRecommendationsStore={this.store}>
                <TakeOverWizard headerProps={this.headerProps} footerProps={this.footerProps}>
                    <Component learningPathId={this.props.learningPathStore.learningPath} />
                </TakeOverWizard>
            </Provider>,
            document.body,
        );
    }
}
