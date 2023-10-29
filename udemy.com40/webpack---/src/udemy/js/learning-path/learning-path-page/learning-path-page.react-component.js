import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';

import {showErrorToast} from 'organization-common/toasts';
import getConfigData from 'utils/get-config-data';

import styles from '../app.less';
import {BASE_PATH} from '../constants';
import LearningPathStore from '../learning-path.mobx-store';
import {LMS_ENROLL_PARAM} from './constants';
import LearningPathView from './learning-path-view.react-component';
import pageEventTracker from './page-event-tracker';

const udConfig = getConfigData();

@inject('learningPathStore')
@withRouter
@observer
export default class LearningPathPage extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        match: PropTypes.object.isRequired,
        window: PropTypes.object,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        window,
    };

    async componentDidMount() {
        const window = this.props.window;
        const editMode = this.props.match.params.action === 'edit';
        this.props.learningPathStore.setPathId(this.props.match.params.pathId);
        // set pathId in the tracker class so we don't have to manually pass it to each tracking
        // call in this directory
        pageEventTracker.setPathId(parseInt(this.props.match.params.pathId, 10));
        const urlParams = new URLSearchParams(window.location.search);
        try {
            await this.props.learningPathStore.fetchLearningPathAndAutoEnroll(
                !!urlParams.get(LMS_ENROLL_PARAM),
            );
            await this.props.learningPathStore.learningPath.fetchCurriculum();

            if (editMode && !this.props.learningPathStore.learningPath.canUserEdit) {
                return this.props.history.push(
                    `${BASE_PATH}${this.props.learningPathStore.learningPath.id}/`,
                );
            }
            this.modeReactionDisposer = reaction(
                () => this.props.match.params.action,
                this._pickMode,
                {
                    fireImmediately: true,
                },
            );
            await this.props.learningPathStore.fetchProgress();

            pageEventTracker.setPath(this.props.learningPathStore.learningPath);
        } catch (e) {
            this.props.history.push(BASE_PATH);
            showErrorToast(e.message);
        }
    }

    componentWillUnmount() {
        if (this.modeReactionDisposer) {
            this.modeReactionDisposer();
        }
        if (this.props.learningPathStore.learningPath.isHistoryLogVisible) {
            this.props.learningPathStore.learningPath.hideHistoryLog();
        }
    }

    @autobind
    _pickMode() {
        this.props.learningPathStore.setEditMode(this.props.match.params.action === 'edit');
    }

    render() {
        const {learningPathStore} = this.props;
        const {showNewLearningPathPageUIEnabled} = learningPathStore;

        const learningPathPageTitle = () => {
            const suffix = udConfig.brand.product_name;
            let pageTitle = `Learning path: ${learningPathStore.learningPath.title}`;
            if (learningPathStore.learningPath.isProPath) {
                pageTitle = `Udemy path: ${learningPathStore.learningPath.title}`;
            }
            return (
                <Helmet>
                    <title>
                        {interpolate(
                            gettext('%(learningPathTitle)s | %(suffix)s'),
                            {
                                learningPathTitle: pageTitle,
                                suffix,
                            },
                            true,
                        )}
                    </title>
                </Helmet>
            );
        };

        return (
            <span
                className={classNames({
                    [styles['learning-path-page-grid-v2']]: showNewLearningPathPageUIEnabled,
                })}
            >
                {learningPathPageTitle()}
                {learningPathStore.isLoading ? (
                    <div className="ud-container">
                        <MainContentLoader size="xlarge" />
                    </div>
                ) : (
                    <>
                        <div
                            className={classNames('ud-container', {
                                [styles[
                                    'learning-path-page-grid'
                                ]]: !showNewLearningPathPageUIEnabled,
                            })}
                        >
                            <LearningPathView />
                        </div>
                    </>
                )}
            </span>
        );
    }
}
