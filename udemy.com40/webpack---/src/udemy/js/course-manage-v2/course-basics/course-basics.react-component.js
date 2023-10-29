import autobind from 'autobind-decorator';
import {Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import udApiStat from 'utils/ud-api-stat';

import CourseBasicsForm from './course-basics-form.react-component';
import CourseBasicsStore from './course-basics.mobx-store';
import HeaderActions from './header-actions.react-component';

export default class CourseBasics extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        pageStore: PropTypes.object.isRequired,
        basicsStore: PropTypes.object,
        ...CourseBasicsForm.props,
    };

    static defaultProps = {
        basicsStore: null,
    };

    constructor(props) {
        super(props);
        this.basicsStore = props.basicsStore || new CourseBasicsStore(this.props.courseId);
        this.props.pageStore.setHeaderActions(this.renderHeaderButtons);
        udApiStat.increment('course_manage.edit', {action: 'basics'});
    }

    componentDidMount() {
        this.basicsStore.initializeForm();
    }

    componentWillUnmount() {
        this.props.pageStore.cleanHeaderActions(this.renderHeaderButtons);
    }

    @autobind
    renderHeaderButtons() {
        if (!this.basicsStore.courseLoaded) {
            return null;
        }
        const {canSave, saveForm, previewUrl} = this.basicsStore;
        const {refreshPublishCourseStatus} = this.props.pageStore;
        return (
            <HeaderActions
                isSaveEnabled={canSave}
                saveForm={saveForm}
                onSaveComplete={refreshPublishCourseStatus}
                previewUrl={previewUrl}
            />
        );
    }

    render() {
        // Don't pass the basicsStore to other components directly. Inject with provider as store.
        const {basicsStore, ...props} = this.props;
        return (
            <Provider store={this.basicsStore}>
                <SubHeader title={gettext('Course landing page')} />
                <MainContent>
                    <CourseBasicsForm {...props} />
                </MainContent>
            </Provider>
        );
    }
}
