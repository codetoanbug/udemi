import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Route} from 'react-router-dom';

import TwoPane from 'instructor/layout/two-pane.react-component';
import QuestionAnswerList from 'question-answer/question-answer-list.react-component';
import QuestionDetail from 'question-answer/question-detail.react-component';

import {COURSE, LEARN_MORE_LINK} from '../constants';
import './featured-questions-list.less';
import FeaturedQuestionsCurriculumItemsSearch from './featured-questions-curriculum-items-search.react-component';

@inject('instructorStore')
@observer
export default class FeaturedQuestionsList extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        instructorStore: PropTypes.object.isRequired,
        baseUrl: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        showCreateFeatureQuestion: PropTypes.bool.isRequired,
        onShowCreateFeaturedQuestion: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const {baseUrl, instructorStore} = this.props;
        instructorStore.FQLStore.baseUrl = baseUrl;
        this.featuredQuestionsListStore = instructorStore.FQLStore;
    }

    componentDidMount() {
        this.featuredQuestionsListStore.setFilter(COURSE, this.props.courseId);
        this.featuredQuestionsListStore.loadInitialThreads();
        this.featuredQuestionsListStore.setThreadFromPathname(this.props.location.pathname);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.courseId !== this.props.courseId) {
            this.featuredQuestionsListStore.clearCurriculumItemSelection();
            this.featuredQuestionsListStore.setFilter(COURSE, this.props.courseId);
            this.featuredQuestionsListStore.setLoadedInitialThreads(false);
            this.featuredQuestionsListStore.loadInitialThreads();
        }
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.featuredQuestionsListStore.setThreadFromPathname(this.props.location.pathname);
        }
    }

    @observable showFeaturedRemovalModal = false;

    @autobind
    handleCurriculumItemChange(curriculumItemId, curriculumItemType) {
        if (curriculumItemId && curriculumItemType) {
            this.featuredQuestionsListStore.setCurrentCurriculumItem(
                curriculumItemId,
                curriculumItemType,
            );
        } else {
            this.featuredQuestionsListStore.clearCurriculumItemSelection();
        }
    }

    @autobind
    @action
    onRemoveFeaturedQuestion() {
        this.showFeaturedRemovalModal = true;
    }

    @autobind
    @action
    closeFeaturedRemovalModal() {
        this.showFeaturedRemovalModal = false;
    }

    renderFeaturedRemovalModal() {
        return (
            <Modal
                isOpen={this.showFeaturedRemovalModal}
                onClose={this.closeFeaturedRemovalModal}
                title={gettext('Featured Question removed successfully!')}
            >
                <p>
                    {gettext(
                        'This question will not be listed under Featured Question in your course page.',
                    )}
                </p>
                <FooterButtons>
                    <Button onClick={this.closeFeaturedRemovalModal}>{gettext('OK')}</Button>
                </FooterButtons>
            </Modal>
        );
    }

    renderFeaturedQuestionsSearch(courseId) {
        return (
            <FeaturedQuestionsCurriculumItemsSearch
                placeholder={gettext('Search Lecture')}
                labelProps={{className: 'ud-sr-only'}}
                onCurriculumItemSelect={this.handleCurriculumItemChange}
                onCurriculumItemDeselect={this.handleCurriculumItemChange}
                selectedCourseId={courseId}
                initialCurriculumItemType={
                    this.featuredQuestionsListStore.currentCurriculumItemType
                }
                initialCurriculumItemId={this.featuredQuestionsListStore.currentCurriculumItemId}
            />
        );
    }

    renderEmptyState() {
        return (
            <div className="ud-text-with-links">
                <div className="ud-heading-md">
                    {gettext('There is no Featured Question setup for this course yet')}
                </div>
                <div className="ud-text-md" styleName="empty-state-body">
                    {gettext(
                        'Create new Featured Question or pin existing questions from your Q&A dashboard.',
                    )}{' '}
                    <a href={LEARN_MORE_LINK} target="_blank" rel="noopener noreferrer">
                        {gettext('Learn more.')}
                    </a>
                </div>
            </div>
        );
    }

    renderQuestionAnswerList() {
        return <QuestionAnswerList showFeaturedQuestionsBadge={false} />;
    }

    renderThreads() {
        return (
            <div styleName="two-pane">
                <TwoPane twoPaneStore={this.featuredQuestionsListStore.twoPaneStore}>
                    <Route render={this.renderQuestionAnswerList} />
                    <QuestionDetail
                        thread={this.featuredQuestionsListStore.selectedThread}
                        onRemoveFeaturedQuestion={this.onRemoveFeaturedQuestion}
                        showFeaturedQuestionsBadge={false}
                    />
                </TwoPane>
            </div>
        );
    }

    render() {
        const {showCreateFeatureQuestion, onShowCreateFeaturedQuestion, courseId} = this.props;
        const showLoader = !this.featuredQuestionsListStore.loadedInitialThreads;
        const isCurriculumItemSelected =
            this.featuredQuestionsListStore.currentCurriculumItemType !== null &&
            this.featuredQuestionsListStore.currentCurriculumItemId !== null;
        const showThreads =
            this.featuredQuestionsListStore.loadedInitialThreads &&
            (isCurriculumItemSelected || this.featuredQuestionsListStore._threads.length > 0);
        return (
            <Provider store={this.featuredQuestionsListStore}>
                <div>
                    <div styleName="featured-questions-options">
                        <div styleName="parent-left-options">
                            {!showLoader &&
                                showThreads &&
                                this.renderFeaturedQuestionsSearch(courseId)}
                            {!showLoader && !showThreads && this.renderEmptyState()}
                        </div>
                        {showCreateFeatureQuestion && (
                            <Button
                                onClick={onShowCreateFeaturedQuestion}
                                styleName="create-button"
                            >
                                {gettext('Create new Featured Question')}
                            </Button>
                        )}
                    </div>
                    {showLoader && <Loader block={true} size="large" />}
                    {!showLoader && showThreads && this.renderThreads()}
                    {this.renderFeaturedRemovalModal()}
                </div>
            </Provider>
        );
    }
}
