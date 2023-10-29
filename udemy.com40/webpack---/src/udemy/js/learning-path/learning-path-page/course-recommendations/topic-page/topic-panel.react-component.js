import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CoursesPanel from './courses-panel.react-component';

import '../course-recommendations.less';

@observer
export default class TopicPanel extends React.Component {
    static propTypes = {
        topic: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.fetchCoursesForTopic();
    }

    fetchCoursesForTopic() {
        if (this.props.topic.isExpanded) {
            this.props.topic.fetchCourses();
        }
    }

    @autobind
    toggleExpanded(isExpanded) {
        this.props.topic.setIsExpanded(isExpanded);
        this.fetchCoursesForTopic();
    }

    render() {
        const {topic} = this.props;
        return (
            <Accordion.Panel
                styleName="section-container"
                title={topic.title}
                expanded={topic.isExpanded}
                onToggle={this.toggleExpanded}
            >
                <CoursesPanel topic={topic} />
            </Accordion.Panel>
        );
    }
}
