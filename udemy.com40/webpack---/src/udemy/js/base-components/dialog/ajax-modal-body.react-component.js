import autobind from 'autobind-decorator';
import {intercept} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udAppLoader from 'loaders/ud-app-loader';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

@observer
export default class AjaxModalBody extends Component {
    static propTypes = {
        ajaxContentStore: PropTypes.object.isRequired,
        onBootstrapContents: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);

        this.modalBodyRef = React.createRef();
        this.contentChanged = false;
    }

    componentDidMount() {
        this.bootstrapContents();
        this.disposers = [intercept(this.props.ajaxContentStore, 'content', this.unloadOldContent)];
    }

    componentDidUpdate() {
        if (this.contentChanged) {
            this.bootstrapContents();
            this.contentChanged = false;
        }
    }

    componentWillUnmount() {
        this.disposers && this.disposers.forEach((disposer) => disposer());
        this.unmountContents();
    }

    bootstrapContents() {
        this.udAppUnloader = udAppLoader(this.modalBodyRef.current);
        this.props.onBootstrapContents(this.modalBodyRef.current);
    }

    unmountContents() {
        if (this.udAppUnloader) {
            this.udAppUnloader();
            this.udAppUnloader = null;
        }
    }

    @autobind
    unloadOldContent(change) {
        const currentValue = this.props.ajaxContentStore.content;
        this.contentChanged = currentValue !== change.newValue;
        if (currentValue && this.contentChanged) {
            this.unmountContents();
        }
        return change;
    }

    render() {
        return (
            <div
                ref={this.modalBodyRef}
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'ajax-modal-body:content',
                    html: this.props.ajaxContentStore.content,
                    domPurifyConfig: {ADD_ATTR: ['target']},
                })}
            />
        );
    }
}
