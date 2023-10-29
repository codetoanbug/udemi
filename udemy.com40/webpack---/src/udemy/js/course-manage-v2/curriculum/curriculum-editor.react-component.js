import autobind from 'autobind-decorator';
import {Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';

import CurriculumEditorContent from './curriculum-editor-content.react-component';
import CurriculumEditorStore from './curriculum-editor.mobx-store';
import CurriculumHeader from './curriculum-header.react-component';
import HeaderActions from './header-actions.react-component';
import {loadingState} from './item/constants';

export default class CurriculumEditor extends Component {
    static propTypes = {
        pageStore: PropTypes.object.isRequired,
        courseId: PropTypes.number.isRequired,
        exportLecturesUrl: PropTypes.string,
        curriculumStore: PropTypes.object,
    };

    static defaultProps = {
        curriculumStore: null,
    };

    static defaultProps = {
        // These aren't specified or relevant for test-only course curricula.
        exportLecturesUrl: undefined,
    };

    constructor(props) {
        super(props);
        this.props.pageStore.setHeaderActions(this.renderHeaderButtons);
        this.curriculumStore = props.curriculumStore || new CurriculumEditorStore(this.props);
    }

    componentDidMount() {
        this.props.pageStore.getContentLengthVideo();
    }

    componentWillUnmount() {
        this.props.pageStore.cleanHeaderActions(this.renderHeaderButtons);
        this.props.pageStore.updateMenuCheckbox();
    }

    @autobind
    renderHeaderButtons() {
        if (this.curriculumStore.loadingState !== loadingState.loaded) {
            return null;
        }
        return (
            <HeaderActions
                learnUrl={this.props.pageStore.course.learnUrl}
                wasPublished={this.curriculumStore.course.wasPublished}
            />
        );
    }

    render() {
        const exportLecturesUrl = this.props.exportLecturesUrl;
        return (
            <Provider store={this.curriculumStore}>
                <div className="full-width-lines">
                    <CurriculumHeader
                        pageStore={this.props.pageStore}
                        exportLecturesUrl={exportLecturesUrl}
                    />
                    <MainContent>
                        <CurriculumEditorContent />
                    </MainContent>
                </div>
            </Provider>
        );
    }
}
