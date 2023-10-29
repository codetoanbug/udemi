import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';

import courseRecommendationsEventTracker from '../course-recommendations-event-tracker';
import ThemePanel from './theme-panel.react-component';

import '../course-recommendations.less';

@inject('learningPathStore', 'courseRecommendationsStore')
@observer
export default class TopicsPage extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        courseRecommendationsStore: PropTypes.shape({
            topics: PropTypes.object,
            topicsByTheme: PropTypes.object,
            isLoading: PropTypes.bool.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        courseRecommendationsEventTracker.coursesPageViewed();
    }

    render() {
        const {topicsByTheme} = this.props.courseRecommendationsStore;

        return (
            <div styleName="container">
                <h1 className="ud-heading-lg" styleName="page-title">
                    {gettext('Select courses for your learning path')}
                </h1>
                {Object.values(topicsByTheme).map((groupedTopics, i) => {
                    return <ThemePanel groupedTopics={groupedTopics} key={`theme-${i}`} />;
                })}
            </div>
        );
    }
}
