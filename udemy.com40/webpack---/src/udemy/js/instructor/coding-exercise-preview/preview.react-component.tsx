import autobind from 'autobind-decorator';
import classNames from 'classnames';
// @ts-expect-error importing issue
import loopProtect from 'loop-protect';
import {observable, reaction, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {PREVIEW_DELAY} from 'course-taking/quiz-view/coding-exercise/constants';
import {getFileExtension} from 'course-taking/quiz-view/coding-exercise/helpers';
import {FileModel} from 'instructor/code-editor/file.mobx-model';
import {jsLibBaseUrl} from 'instructor/code-editor/language-settings';
import debounce from 'utils/debounce';
import udApiStat from 'utils/ud-api-stat';

import './preview.less';

export interface PreviewProps {
    files: FileModel[];
    isResizing: boolean;
    isVisible: boolean;
    language: string;
    dd_key: string;
}
@observer
export class Preview extends React.Component<PreviewProps> {
    componentDidMount() {
        loopProtect.alias = 'window.runnerWindow.protect';

        this.debouncedGeneratePreview = debounce(this.generatePreview, PREVIEW_DELAY);
        this.disposeFilesWatcher = reaction(
            () => this.props.files.map((file) => file.content),
            this.debouncedGeneratePreview,
        );
    }

    componentWillUnmount() {
        this.disposeFilesWatcher?.();
    }

    @observable isInitialRender = true;

    get htmlFile() {
        const htmlFiles = this.props.files.filter((file) => {
            const extension = getFileExtension(file.fileName);
            return extension === 'html' || extension === 'htm';
        });

        return htmlFiles.length > 0 ? htmlFiles[0] : null;
    }

    debouncedGeneratePreview: any | undefined;
    previewIframe: HTMLIFrameElement | null | undefined;
    disposeFilesWatcher: (() => any) | undefined;

    _mergeFilesWithExtension(extension: string) {
        return this.props.files
            .filter((file) => getFileExtension(file.fileName) === extension)
            .map((file) => file.content)
            .join('\n');
    }

    /* istanbul ignore next TODO someday */
    computeIframeContent() {
        const iframeContent = document.createElement('html');
        iframeContent.innerHTML = this.htmlFile?.content ?? '';

        let head = iframeContent.getElementsByTagName('head')[0];
        if (!head) {
            head = document.createElement('head');
            iframeContent.appendChild(head);
        }

        let useUdemyBabelScript = false;
        const babelScriptNode = iframeContent.getElementsByClassName('babelScript');
        if (babelScriptNode?.[0]?.parentNode) {
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
        try {
            this._trackInitialRender(`${this.props.dd_key}.preview_initial_render.start`, {
                language: this.props.language,
            });
            this.previewIframe.contentWindow?.postMessage(
                JSON.stringify({
                    type: 'render',
                    data: {
                        source: this.computeIframeContent(),
                        options: {requested: true},
                    },
                }),
                '*',
            );
            this._trackInitialRender(`${this.props.dd_key}.preview_initial_render.success`, {
                language: this.props.language,
            });
        } catch (e) {
            this._trackInitialRender(`${this.props.dd_key}.preview_initial_render.error`, {
                language: this.props.language,
                error: e.message,
            });
        } finally {
            this.isInitialRender &&
                runInAction(() => {
                    this.isInitialRender = false;
                });
        }
    }

    _trackInitialRender(key: string, data: Record<string, unknown>) {
        if (this.isInitialRender) {
            udApiStat.increment(key, data);
        }
    }

    render() {
        if (!this.props.isVisible) {
            return null;
        }

        // Use a different subdomain for security purposes.
        return (
            <div styleName="preview">
                <iframe
                    src="https://null.udemy.com/staticx/udemy/js/other-libs/jsbin/iframe.html"
                    sandbox="allow-pointer-lock allow-same-origin allow-modals allow-forms allow-popups allow-scripts"
                    title={gettext('Code output')}
                    styleName={classNames({
                        resizing: this.props.isResizing,
                    })}
                    ref={(elem) => {
                        this.previewIframe = elem;
                    }}
                    onLoad={this.generatePreview}
                />
            </div>
        );
    }
}
