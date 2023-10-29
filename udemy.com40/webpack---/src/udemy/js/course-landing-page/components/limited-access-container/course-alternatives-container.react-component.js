import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseAlternatives from 'organization-common/course-retirement/course-alternatives.react-component';
import CourseRetirementAlternativesStore from 'organization-common/course-retirement/course-retirement-alternatives.mobx-store';

import './course-alternatives-container.less';

@observer
export default class CourseAlternativesContainer extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CourseRetirementAlternativesStore).isRequired,
        buttonProps: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: '',
    };

    componentDidMount() {
        const {store} = this.props;

        if (store.courseAlternatives.length === 0) {
            this.props.store.getCourseAlternatives();
        }
    }

    get courseAlternativesSubtitle() {
        const {store} = this.props;

        return ninterpolate(
            'If you’re looking for an alternative, here is our suggestion for you.',
            'If you’re looking for an alternative, here are our suggestions for you.',
            store.courseAlternatives.length,
        );
    }

    render() {
        const {store, buttonProps} = this.props;

        if (!store.isLoading && !store.courseAlternatives.length) {
            return null;
        }

        if (store.isLoading) {
            return <Loader />;
        }

        return (
            <div styleName="course-alternatives-container" className={this.props.className}>
                <p className="ud-text-sm" styleName="title">
                    {this.courseAlternativesSubtitle}
                </p>
                <CourseAlternatives
                    courses={store.courseAlternatives.slice()}
                    buttonProps={buttonProps}
                    courseToBeRetiredId={store.courseId}
                />
            </div>
        );
    }
}
