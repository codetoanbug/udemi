import autobind from 'autobind-decorator';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';
import Prompt from 'course-manage-v2/prompt.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import CourseGoalsStore from './course-goals.mobx-store';
import GoalsForm from './goals-form.react-component';
import HeaderActions from './header-actions.react-component';

@observer
export default class CourseGoals extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        pageStore: PropTypes.object.isRequired,
        goalsStore: PropTypes.object,
    };

    static defaultProps = {
        goalsStore: null,
    };

    constructor(props) {
        super(props);
        const {pageStore, courseId} = props;
        this.goalsStore = props.goalsStore || new CourseGoalsStore(courseId);
        pageStore.setHeaderActions(this.renderHeaderButtons);
    }

    componentDidMount() {
        this.goalsStore.initializeLists();
    }

    componentWillUnmount() {
        this.props.pageStore.cleanHeaderActions(this.renderHeaderButtons);
    }

    @autobind
    renderHeaderButtons() {
        return (
            <HeaderActions
                store={this.goalsStore}
                onSaveComplete={this.props.pageStore.updateMenuCheckbox}
            />
        );
    }

    render() {
        const isDirty = this.goalsStore && this.goalsStore.dirty;
        return (
            <Provider store={this.goalsStore}>
                <div>
                    <SubHeader title={gettext('Intended learners')} />
                    <MainContent>
                        <GoalsForm />
                    </MainContent>
                    <Prompt when={isDirty} />
                </div>
            </Provider>
        );
    }
}
