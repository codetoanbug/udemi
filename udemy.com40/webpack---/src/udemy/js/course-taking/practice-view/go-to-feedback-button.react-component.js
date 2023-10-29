import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import requires from '../registry/requires';
import './practice.less';

@withRouter
@requires('practiceViewStore')
export default class GoToFeedbackButton extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    @autobind
    handleClick() {
        const {practiceViewStore} = this.props;
        practiceViewStore.completePracticeSubmission().then(
            action(() => {
                const {history, practiceViewStore} = this.props;
                history.push(`${practiceViewStore.baseUrl}${practiceViewStore.nextUrl}`);
            }),
        );
    }

    render() {
        return (
            <Button onClick={this.handleClick} size="small">
                {gettext('Go to feedback')}
            </Button>
        );
    }
}
