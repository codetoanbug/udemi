import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseList from './course-list.react-component';
import MyCoursesStore from './my-courses.mobx-store';

@observer
export default class Archived extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new MyCoursesStore('archive_tab', props.location, props.history);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.store.setState(searchParams);
        this.store.loadCourses();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            const searchParams = new URLSearchParams(this.props.location.search);
            this.store.setState(searchParams);
            this.store.loadCourses();
        }
    }

    render() {
        if (this.store.isLoading) {
            return <MainContentLoader />;
        }

        return (
            <CourseList
                store={this.store}
                history={this.props.history}
                location={this.props.location}
            />
        );
    }
}
