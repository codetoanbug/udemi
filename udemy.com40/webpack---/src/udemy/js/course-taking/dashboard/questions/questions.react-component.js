import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Route, withRouter} from 'react-router-dom';

import requires from '../../registry/requires';
import HashSwitch from '../../utils/hash-switch.react-component';
import QuestionsDisabled from './question-answer/questions-disabled.react-component';
import QuestionOverview from './question-overview.react-component';
import SingleQuestionView from './single-question-view.react-component';

@withRouter
@requires('courseTakingStore')
@observer
export default class Questions extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    render() {
        const {courseTakingStore} = this.props;
        if (!courseTakingStore.course) {
            return <Loader block={true} size="xxlarge" />;
        }

        if (courseTakingStore.areQuestionsDisabled) {
            return <QuestionsDisabled courseTakingStore={courseTakingStore} />;
        }

        return (
            <HashSwitch location={this.props.location}>
                <Route path="questions/:questionId(\d+)" component={SingleQuestionView} />
                <Route path="questions" component={QuestionOverview} />
            </HashSwitch>
        );
    }
}
