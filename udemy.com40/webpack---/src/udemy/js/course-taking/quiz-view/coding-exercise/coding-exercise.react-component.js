import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Ace from 'ace/ace.react-component';
import {loadAce} from 'utils/ud-ace';

import CurriculumItemFooter from '../../curriculum/controls/curriculum-item-footer.react-component';
import NextItemLink from '../../curriculum/next-item-link.react-component';
import requires from '../../registry/requires';
import CodingExerciseStore from './coding-exercise.mobx-store';
import EditorFooter from './editor-footer.react-component';
import Files from './files.react-component';
import Instructions from './instructions.react-component';
import Output from './output.react-component';

import './coding-exercise.less';

@requires('courseTakingStore', 'quizViewStore')
@observer
export default class CodingExercise extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        loadAce();
        this.codingExerciseStore = new CodingExerciseStore(
            this.props.courseTakingStore,
            this.props.quizViewStore,
        );
        this.codingExerciseStore.initializeFiles();
    }

    componentDidMount() {
        const {hasOpenedCodingExercise, hasSidebarContent} = this.props.courseTakingStore;
        if (!hasOpenedCodingExercise && hasSidebarContent) {
            this.props.courseTakingStore.toggleSidebar();
        }
        this.props.courseTakingStore.hasOpenedCodingExercise = true;
        this.codingExerciseStore.loadStudentFiles();
    }

    renderBody() {
        return (
            <div styleName="coding-exercise">
                <Instructions />
                <div styleName="workspace">
                    <Files />
                    <div styleName="editor-container">
                        <div styleName="editor">
                            {this.codingExerciseStore.activeFile && (
                                <Ace
                                    file={this.codingExerciseStore.activeFile}
                                    updateFile={this.codingExerciseStore.updateFile}
                                    updateCursorPosition={
                                        this.codingExerciseStore.updateCursorPosition
                                    }
                                />
                            )}
                        </div>
                        <EditorFooter />
                    </div>
                    <Output />
                </div>
            </div>
        );
    }

    renderFooter() {
        return (
            <CurriculumItemFooter
                reportId={this.codingExerciseStore.question.id}
                reportType="assessment"
                renderRightButtons={this.renderRightButtons}
            />
        );
    }

    @autobind
    renderRightButtons() {
        const {isEvaluating, evaluate} = this.codingExerciseStore;
        return (
            <>
                <Button
                    size="small"
                    className="ud-link-neutral"
                    styleName={isEvaluating ? 'check-waiting' : 'check-primary'}
                    udStyle="ghost"
                    data-purpose="check-button"
                    disabled={isEvaluating}
                    onClick={evaluate}
                >
                    <span styleName="block">
                        <span styleName="check-text primary">{gettext('Check solution')}</span>
                        <span styleName="check-text waiting">
                            <Loader color="inherit" size="small" styleName="check-loader" />
                            {gettext('Checking')}
                        </span>
                    </span>
                </Button>
                <Button
                    componentClass={NextItemLink}
                    size="small"
                    data-purpose="next-item"
                    onClick={() => this.codingExerciseStore.trackEvent('continue')}
                >
                    {gettext('Continue')}
                </Button>
            </>
        );
    }

    render() {
        if (!this.codingExerciseStore.question) {
            return null;
        }

        return (
            <Provider codingExerciseStore={this.codingExerciseStore}>
                <>
                    {this.renderBody()}
                    {this.renderFooter()}
                </>
            </Provider>
        );
    }
}
