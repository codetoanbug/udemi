import {MainContentLoader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {inject, observer, Provider} from 'mobx-react';
import React from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import CourseList from 'my-courses-v3/course-list.react-component';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import LearningPathCard from 'organization-home/components/learning-path-card/learning-path-card.react-component';

import {LearningInProgressProps} from '../common/types';
import {CertificationLearningProductListMobxStore} from './certification-learning-product-list.mobx-store';
import styles from './learning-in-progress.less';

import './app.global.less';

@withMatchMedia({isMobileMax: 'mobile-max'})
@inject('certificationStore')
@observer
export class CertificationLearningInProgress extends React.Component<LearningInProgressProps> {
    static defaultProps: LearningInProgressProps;

    constructor(props: LearningInProgressProps) {
        super(props);
        const {certificationStore} = props;
        this.store = new CertificationLearningProductListMobxStore(certificationStore);
        this.resourceContextMenu = createUFBContextMenu();
    }

    async componentDidMount() {
        const {certification} = this.props.certificationStore;
        certification && (await this.store.fetchEnrolledBadgeLearningProducts(certification.id));
    }

    resourceContextMenu = createUFBContextMenu();
    store: CertificationLearningProductListMobxStore;

    renderNoContent = () => {
        return (
            <div className={classNames(styles['no-course-container'])}>
                <div className={classNames('ud-heading-lg', styles['no-course-header'])}>
                    {gettext('No learning content enrolled for this certificate')}
                </div>
                <div>
                    <div className={classNames('ud-text-md', styles['no-course-message'])}>
                        {gettext(
                            "You don't have any learning content enrolled for this certificate.",
                        )}
                    </div>
                    <div className={classNames('ud-text-md', styles['no-course-message'])}>
                        {gettext(
                            "Please select the 'Explore' tab to see all the available content for certification preparation.",
                        )}
                    </div>
                </div>
            </div>
        );
    };

    renderCourses = () => {
        return (
            <>
                <div
                    className={classNames(
                        'ud-heading-xl',
                        styles['learning-in-progress-tab-title'],
                    )}
                >
                    {gettext('Courses in progress')}
                </div>
                <CourseList store={this.store} history={history} location={location} />
            </>
        );
    };

    renderLearningPaths = () => {
        return (
            <>
                <div
                    className={classNames(
                        'ud-heading-xl',
                        styles['learning-in-progress-tab-title'],
                    )}
                >
                    {gettext('Udemy paths in progress')}
                </div>{' '}
                <Provider resourceContextMenu={this.resourceContextMenu}>
                    <div className="my-courses__wide-card-grid">
                        {this.store.learningPaths.map((learningPath, index) => (
                            <div key={index}>
                                <LearningPathCard
                                    learningPath={learningPath}
                                    size={this.props.isMobileMax ? 'small' : 'large'}
                                    wrapperClassName="my-learning-paths"
                                />
                            </div>
                        ))}
                    </div>
                </Provider>
            </>
        );
    };

    render() {
        const {courses, learningPaths, isEnrolledBadgeLearningProductsLoaded} = this.store;

        if (!isEnrolledBadgeLearningProductsLoaded) {
            return <MainContentLoader />;
        }
        if (courses.length == 0 && learningPaths.length == 0) {
            return this.renderNoContent();
        }
        return (
            <>
                {learningPaths.length > 0 && this.renderLearningPaths()}
                {courses.length > 0 && this.renderCourses()}
            </>
        );
    }
}
