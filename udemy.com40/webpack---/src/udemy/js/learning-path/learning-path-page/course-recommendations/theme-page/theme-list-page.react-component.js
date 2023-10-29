import {Loader} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';

import courseRecommendationsEventTracker from '../course-recommendations-event-tracker';
import ThemeContainer from './theme-container.react-component';

import '../course-recommendations.less';

@inject('learningPathStore', 'courseRecommendationsStore')
@observer
export default class ThemeListPage extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        courseRecommendationsStore: PropTypes.shape({
            themesByType: PropTypes.array.isRequired,
            updateTheme: PropTypes.func.isRequired,
            isLoading: PropTypes.bool.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        courseRecommendationsEventTracker.themesPageViewed();
    }

    render() {
        const {themesByType, updateTheme, isLoading} = this.props.courseRecommendationsStore;

        return (
            <div styleName="container">
                <h1 className="ud-heading-lg" styleName="page-title">
                    {gettext("What skills drive your learning path's goal?")}
                </h1>

                {isLoading ? (
                    <Loader size="xlarge" block={true} styleName="page-loader" />
                ) : (
                    themesByType.map((obj, i) => (
                        <fieldset key={`type-${i}`}>
                            <legend className="ud-heading-lg" styleName="themes-title">
                                {obj.title}
                            </legend>
                            <ThemeContainer
                                updateTheme={updateTheme}
                                themes={obj.themes}
                                {...obj.containerProps}
                            />
                        </fieldset>
                    ))
                )}
            </div>
        );
    }
}
