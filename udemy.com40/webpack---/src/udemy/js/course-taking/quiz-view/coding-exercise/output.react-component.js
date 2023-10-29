import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import loopProtect from 'loop-protect';
import {action, observable, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import {jsLibBaseUrl} from 'instructor/code-editor/language-settings';
import debounce from 'utils/debounce';
import udApiStat from 'utils/ud-api-stat';

import CodingExerciseStore from './coding-exercise.mobx-store';
import {
    PREVIEW_DELAY,
    SIDEBAR_MIN_WIDTH,
    PARSED_FEEDBACK_LANGUAGES,
    WIDE_OUTPUT_LANGUAGES,
} from './constants';
import {getFileExtension} from './helpers';
import ParsedFeedback from './parsed-feedback.react-component';

import './output.less';

@inject('codingExerciseStore')
@observer
export default class Output extends React.Component {
    static propTypes = {
        codingExerciseStore: PropTypes.instanceOf(CodingExerciseStore).isRequired,
    };

    componentDidMount() {
        loopProtect.alias = 'window.runnerWindow.protect';

        this.debouncedGeneratePreview = debounce(this.generatePreview, PREVIEW_DELAY);
        this.disposeFilesWatcher = reaction(
            () => this.props.codingExerciseStore.combinedFiles.map((file) => file.content),
            this.debouncedGeneratePreview,
        );
    }

    componentWillUnmount() {
        this.disposeFilesWatcher && this.disposeFilesWatcher();
    }

    @observable isPanelResizing = false;
    previewIframe;
    disposeFilesWatcher;

    get feedbackTitle() {
        if (this.props.codingExerciseStore.hasSolutionPassed) {
            return (
                <>
                    <SuccessIcon label={false} color="positive" styleName="feedback-icon" />
                    {gettext('Well done, your solution is correct!')}
                </>
            );
        }

        if (this.props.codingExerciseStore.hasEvaluationFailed) {
            if (this.props.codingExerciseStore.hasPusherFailed) {
                return (
                    <>
                        <WarningIcon label={false} color="negative" styleName="feedback-icon" />
                        {gettext('Oops, there was a timeout issue. Please try again.')}
                    </>
                );
            }
            return (
                <>
                    <WarningIcon label={false} color="negative" styleName="feedback-icon" />
                    {gettext('Oops, there was an error on our end. Please try again.')}
                </>
            );
        }

        return (
            <>
                <WarningIcon label={false} color="negative" styleName="feedback-icon" />
                {gettext('Oops, your solution is incorrect.')}
            </>
        );
    }

    get feedbackContent() {
        const language = this.props.codingExerciseStore.question.prompt.language.toLowerCase();
        if (
            this.props.codingExerciseStore.hasEvaluationFailed ||
            (this.props.codingExerciseStore.hasSolutionPassed &&
                !PARSED_FEEDBACK_LANGUAGES.includes(language))
        ) {
            return null;
        } else if (!this.props.codingExerciseStore.evaluatorFeedback) {
            return gettext('Unable to retrieve feedback on your solution');
        }

        if (PARSED_FEEDBACK_LANGUAGES.includes(language)) {
            return <ParsedFeedback />;
        }

        return (
            <pre data-purpose="feedback-content">
                {this.props.codingExerciseStore.evaluatorFeedback}
            </pre>
        );
    }

    get feedback() {
        if (!this.props.codingExerciseStore.hasCheckedSolutionOnce) {
            return null;
        }

        return (
            <div styleName="output-section">
                <div className="ud-heading-md" data-purpose="feedback-title">
                    {this.feedbackTitle}
                </div>
                {this.feedbackContent}
            </div>
        );
    }

    get logOutput() {
        if (
            !this.props.codingExerciseStore.hasCheckedSolutionOnce ||
            !this.props.codingExerciseStore.logOutput
        ) {
            return null;
        }

        return (
            <div styleName="output-section">
                <div className="ud-heading-md" data-purpose="log-title">
                    {gettext('Your output')}
                </div>
                <pre data-purpose="log-content">{this.props.codingExerciseStore.logOutput}</pre>
            </div>
        );
    }

    _mergeFilesWithExtension(extension) {
        return this.props.codingExerciseStore.combinedFiles
            .filter((file) => getFileExtension(file.fileName) === extension)
            .map((file) => file.content)
            .join('\n');
    }

    /* istanbul ignore next TODO someday */
    computeIframeContent() {
        const iframeContent = document.createElement('html');
        iframeContent.innerHTML = this.props.codingExerciseStore.htmlFile?.content || '';

        let head = iframeContent.getElementsByTagName('head')[0];
        if (!head) {
            head = document.createElement('head');
            iframeContent.appendChild(head);
        }

        let useUdemyBabelScript = false;
        const babelScriptNode = iframeContent.getElementsByClassName('babelScript');
        if (babelScriptNode && babelScriptNode[0]?.parentNode) {
            const scriptBabelRemoveImportExport = document.createElement('script');
            scriptBabelRemoveImportExport.src = `${jsLibBaseUrl}/babel-plugin-remove-import-export-1.1.1-udemy.js`;
            babelScriptNode[0].parentNode.insertBefore(
                scriptBabelRemoveImportExport,
                babelScriptNode[0].nextSibling,
            );
            useUdemyBabelScript = true;
        }

        const style = document.createElement('style');
        style.innerHTML = this._mergeFilesWithExtension('css');
        head.appendChild(style);

        let body = iframeContent.getElementsByTagName('body')[0];
        if (!body) {
            body = document.createElement('body');
            iframeContent.appendChild(body);
        }
        const scriptJsx = document.createElement('script');
        if (useUdemyBabelScript) {
            scriptJsx.type = 'text/babel';
            scriptJsx.dataset.presets = 'env,react';
            scriptJsx.dataset.plugins = 'remove-import-export';
        }
        let jsx = this._mergeFilesWithExtension('js') + this._mergeFilesWithExtension('jsx');

        if (useUdemyBabelScript) {
            // NOTE: override these because the remove-import-export plugin isn't removing them
            jsx = jsx.replace(
                /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g,
                '',
            );
            jsx = jsx.replace(/export default [\w+];/g, '');
            jsx = jsx.replace(/export default class/g, 'class');
            jsx = jsx.replace(/export default function/g, 'function');
        }

        try {
            jsx = loopProtect(jsx);
        } catch (err) {
            /* empty */
        }
        scriptJsx.innerHTML = jsx;
        body.appendChild(scriptJsx);

        return iframeContent.outerHTML;
    }

    @autobind
    generatePreview() {
        if (!this.previewIframe) {
            return false;
        }
        const {
            isInitialPreviewRender,
            setIsInitialPreviewRender,
            question,
        } = this.props.codingExerciseStore;
        try {
            this._trackInitialRender('quiz.coding_exercise.frontend.preview_initial_render.start', {
                language: question.prompt.language,
            });
            this.previewIframe.contentWindow.postMessage(
                JSON.stringify({
                    type: 'render',
                    data: {
                        source: this.computeIframeContent(),
                        options: {requested: true},
                    },
                }),
                '*',
            );
            this._trackInitialRender(
                'quiz.coding_exercise.frontend.preview_initial_render.success',
                {
                    language: question.prompt.language,
                },
            );
        } catch (e) {
            this._trackInitialRender('quiz.coding_exercise.frontend.preview_initial_render.error', {
                language: question.prompt.language,
                error: e.message,
            });
        } finally {
            isInitialPreviewRender && setIsInitialPreviewRender(false);
        }
    }

    _trackInitialRender(key, data) {
        const {isInitialPreviewRender} = this.props.codingExerciseStore;
        if (isInitialPreviewRender) {
            udApiStat.increment(key, data);
        }
    }

    get preview() {
        if (!this.props.codingExerciseStore.isPreviewVisible) {
            return null;
        }

        // Use a different subdomain for security purposes.
        return (
            <div styleName="preview">
                <iframe
                    src="https://null.udemy.com/staticx/udemy/js/other-libs/jsbin/iframe.html"
                    sandbox="allow-pointer-lock allow-same-origin allow-modals allow-forms allow-popups allow-scripts"
                    title={gettext('Code output')}
                    styleName={classNames({resizing: this.isPanelResizing})}
                    ref={(elem) => {
                        this.previewIframe = elem;
                    }}
                    onLoad={this.generatePreview}
                />
            </div>
        );
    }

    onMove(event, resizeData) {
        const w = Math.max(SIDEBAR_MIN_WIDTH, resizeData.width);
        resizeData.container.style.width = `${w}px`;
    }

    @autobind
    @action
    onResizerStart() {
        this.isPanelResizing = true;
    }

    @autobind
    @action
    onResizerEnd() {
        this.isPanelResizing = false;
    }

    render() {
        const language = this.props.codingExerciseStore.question.prompt.language.toLowerCase();
        return (
            <Resizer
                styleName={classNames('output', {
                    'output-wide': WIDE_OUTPUT_LANGUAGES.includes(language),
                })}
                onMove={this.onMove}
                onStart={this.onResizerStart}
                onEnd={this.onResizerEnd}
                edges={{left: true}}
            >
                <div styleName="drag-handle" />
                {this.feedback}
                {this.logOutput}
                {this.preview}
            </Resizer>
        );
    }
}
