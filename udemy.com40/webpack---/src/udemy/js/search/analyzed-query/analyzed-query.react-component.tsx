import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import Clipboard from 'clipboard';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import CheckedStateCheckbox from 'base-components/checked-state/checked-state-checkbox.react-component';

import './analyzed-query.less';

export interface AnalyzedQueryData {
    token: string;
    type: string;
}

interface AnalyzedQueryProps {
    analyzedQuery?: AnalyzedQueryData[];
    detectedLanguage?: string;
    isInferredLanguage?: boolean;
    inferredProbability: number;
    query?: Record<string, string>;
}

@observer
export class AnalyzedQuery extends Component<AnalyzedQueryProps> {
    static defaultProps = {
        inferredProbability: 0,
    };

    constructor(props: AnalyzedQueryProps) {
        super(props);
        this.queryText = JSON.stringify(this.props.query, null, 2);
    }

    private clipboard = new Clipboard('#copyButton');
    private queryText: string;
    @observable collapsed = true;

    @autobind
    @action
    toggle() {
        this.collapsed = !this.collapsed;
    }

    render() {
        if (!this.props.analyzedQuery) {
            return null;
        }
        const analyzedQueryTokenItems = this.props.analyzedQuery.map((token, i) => (
            <li key={i}>
                <strong>{token.token}</strong>
                {'(type:'} <i>{token.type}</i>
                {')'}
            </li>
        ));
        return (
            <div>
                <div styleName="container">
                    <div>
                        <strong>{'Analyzed Query Tokens:'}</strong>
                        <ul>{analyzedQueryTokenItems}</ul>
                    </div>
                </div>
                <div styleName="container">
                    <div>
                        <strong>{'Detected Query Language:'}</strong>
                        <ul>
                            <li>
                                <strong>{this.props.detectedLanguage}</strong>
                                {'(inferred:'} <i>{this.props.isInferredLanguage?.toString()}</i>
                                {', prob:'} <i>{this.props.inferredProbability}</i>
                                {')'}
                            </li>
                        </ul>
                    </div>
                </div>
                <div styleName="container">
                    <div>
                        <strong>{'Elasticsearch Query'}</strong>
                        <div>
                            <Button udStyle="ghost" size="medium" cssToggleId="query-input">
                                {'Show ⬇'}
                            </Button>
                            <Button
                                udStyle="ghost"
                                size="medium"
                                id="copyButton"
                                data-clipboard-text={this.queryText}
                            >
                                {'Copy to Clipboard'}
                            </Button>
                        </div>
                        <CheckedStateCheckbox id="query-input" />
                        <div styleName="query" id="query-input">
                            {this.queryText}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
