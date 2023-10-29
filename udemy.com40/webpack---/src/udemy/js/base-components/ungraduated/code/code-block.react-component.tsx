import classNames from 'classnames';
/** @ts-expect-error g-c-p is an older library and has no type definitions */
import {prettyPrint} from 'google-code-prettify/bin/prettify.min';
import React, {Component} from 'react';

import './code.global.less';

type CodeBlockSupportedLanguages =
    | 'bsh'
    | 'c'
    | 'cc'
    | 'cpp'
    | 'cs'
    | 'csh'
    | 'cyc'
    | 'cv'
    | 'htm'
    | 'html'
    | 'java'
    | 'js'
    | 'm'
    | 'mxml'
    | 'perl'
    | 'pl'
    | 'pm'
    | 'py'
    | 'rb'
    | 'ts'
    | 'sh'
    | 'xhtml'
    | 'xml'
    | 'xsl';

/** React prop interface for the `CodeBlock` component. */
interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    /** The actual code to display */
    value: string;
    /** The programming language of the `value` prop. */
    language?: CodeBlockSupportedLanguages;
    /** Flag to display line numbers */
    showLineNumbers?: boolean;
    /**
     * Flag to disable click event propagation.
     *
     * @remarks
     * This is used on quiz answers so that user does not select on accident.
     */
    preventClick?: boolean;
}

/**
 * ### CodeBlock
 *
 * @remarks
 * This component renders raw text in a `<pre />` with `google-code-prettify` applied.
 * {@link https://github.com/google/code-prettify/blob/master/README.md Code-Prettify}
 */
class CodeBlock extends Component<CodeBlockProps> {
    static defaultProps = {
        showLineNumbers: true,
        language: undefined,
        preventClick: false,
    };

    componentDidMount() {
        if (this._hasValue) {
            this.node?.classList.remove('prettyprinted');
            prettyPrint(null, this.containerNode);
        }
    }

    componentDidUpdate(prevProps: CodeBlockProps) {
        if (prevProps.value !== this.props.value && this._hasValue) {
            this.node?.classList.remove('prettyprinted');
            prettyPrint(null, this.containerNode);
        }
    }

    node: HTMLPreElement | undefined = undefined;
    containerNode: HTMLDivElement | undefined = undefined;

    get _hasValue() {
        return Boolean(this.props.value);
    }

    onClick = (event: React.MouseEvent) => {
        if (this.props.preventClick) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    setContainerNode = (node: HTMLDivElement) => {
        this.containerNode = node;
    };

    setNode = (node: HTMLPreElement) => {
        this.node = node;
    };

    render() {
        const preClassName = classNames(
            {
                prettyprint: this._hasValue,
                linenums: this.props.showLineNumbers,
            },
            this.props.language ? `lang-${this.props.language}` : '',
            this.props.className,
        );

        return (
            <div ref={this.setContainerNode}>
                <pre
                    className={preClassName}
                    onClick={this.onClick}
                    role="presentation"
                    ref={this.setNode}
                >
                    {this.props.value}
                </pre>
            </div>
        );
    }
}

// eslint-disable-next-line import/no-default-export
export default CodeBlock;
