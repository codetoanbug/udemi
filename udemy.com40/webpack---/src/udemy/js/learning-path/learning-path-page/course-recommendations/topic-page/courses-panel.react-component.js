import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CourseItem from './course-item.react-component';
import Topic from './topic.mobx-model';

import '../course-recommendations.less';

@observer
export default class CoursesPanel extends React.Component {
    static propTypes = {
        topic: PropTypes.instanceOf(Topic).isRequired,
    };

    render() {
        const {topic} = this.props;

        return topic.isLoading ? (
            <Loader size="medium" block={true} styleName="courses-loader" />
        ) : (
            topic.courses.map((course) => {
                return <CourseItem course={course} key={`course-${course.id}`} />;
            })
        );
    }
}
