import {withI18n} from '@udemy/i18n';
import {Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AjaxContentStore from 'base-components/dialog/ajax-content.mobx-store';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import serverOrClient from 'utils/server-or-client';

import AjaxModalBody from './ajax-modal-body.react-component';
import './ajax-modal.less';

const getAjaxModalTypes = (modalTypes) => {
    const {title, renderTitle, ...ajaxModalTypes} = modalTypes;
    return ajaxModalTypes;
};

@observer
export class AjaxModalBase extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        requireExplicitAction: PropTypes.bool,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        fullPage: PropTypes.bool,
        loading: PropTypes.bool,
        className: PropTypes.string,
        getContainer: PropTypes.func,
        url: PropTypes.string.isRequired,
        /** Id of the element that provides the modal title.
            The ajax content must have such an element for A11Y.
            If you don't want to show the title, hide it with .ud-sr-only. */
        labelledById: PropTypes.string.isRequired,
        /** Used to import() the apps in the modal content so that they bootstrap immediately
            once the content itself is rendered. This prevents visual flickering in content
            that is partially rendered by Django and partially rendered by React. */
        preloader: PropTypes.func,
        /**
- Links are intercepted such that they open inside the modal, unless they have `target="_blank"` or `data-disable-loader`.
- Forms are intercepted such that they are submitted via AJAX.
- `<div class="run-command" />` is parsed and evaluated.
        */
        shouldInterceptContent: PropTypes.bool,
        skipCache: PropTypes.bool,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    static defaultProps = {
        ...getAjaxModalTypes(Modal.defaultProps),
        preloader: null,
        shouldInterceptContent: false,
        skipCache: false,
    };

    constructor(props) {
        super(props);

        this.store = new AjaxContentStore(this.props.url);
    }

    componentDidMount() {
        this.fetchContent(this.props.url, this.props.isOpen);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isOpen !== this.props.isOpen) {
            this.fetchContent(this.props.url, this.props.isOpen);
        }
    }

    componentWillUnmount() {
        if (this.contentNode) {
            this.contentNode.removeEventListener('intercept-ajax-content', this.applyInterceptor);
            this.contentNode.removeEventListener('close-ajax-modal', this.props.onClose);
            this.contentNode = null;
        }
    }

    @autobind fetchContent(url, isOpen) {
        if (isOpen) {
            this.store.setUrl(url, this.props.skipCache);
            this.store.fetchContent(this.props.preloader);
        }
    }

    @autobind onBootstrapContents(contentNode) {
        this.contentNode = contentNode;
        this.applyInterceptor();

        this.contentNode.removeEventListener('close-ajax-modal', this.props.onClose);
        this.contentNode.addEventListener('close-ajax-modal', this.props.onClose);
    }

    @autobind applyInterceptor() {
        if (this.props.shouldInterceptContent) {
            this.contentNode.removeEventListener('intercept-ajax-content', this.applyInterceptor);
            this.contentNode.addEventListener('intercept-ajax-content', this.applyInterceptor);

            const links = this.contentNode.querySelectorAll('a:not([data-disable-loader])');
            Array.from(links).forEach((link) => {
                link.removeEventListener('click', this.onClickLink);
                link.addEventListener('click', this.onClickLink);
            });

            const forms = this.contentNode.querySelectorAll('form:not([data-disable-loader])');
            Array.from(forms).forEach((form) => {
                form.removeEventListener('submit', this.onSubmitForm);
                form.addEventListener('submit', this.onSubmitForm);
            });

            this.handleRunCommandElements(this.contentNode);
        }
    }

    handleRunCommandElements(containerNode) {
        const commands = Array.from(containerNode.querySelectorAll('.run-command'));
        commands.forEach((command) => {
            if (command.classList.contains('close-popup')) {
                this.props.onClose();
            }
            if (command.classList.contains('redirect')) {
                serverOrClient.global.location.href = command.dataset.url;
            }
            if (command.classList.contains('refresh-page')) {
                serverOrClient.global.location.reload();
            }
        });
        return commands.length > 0;
    }

    @autobind onClickLink(event) {
        // For target="_blank" or JavaScript links, this handler does nothing.
        // For standard links, this performs the navigation inside the modal.
        // In IE11, standard links inside React apps apparently have no host if you check
        // directly, so we instead check on a clone. Note that `<a href="" />` has host
        // www.udemy.com, but `<a />` has no host.
        const link = event.target;
        const linkClone = document.createElement('a');
        linkClone.href = link.href;
        if (link.target === '_blank' || !link.href || !linkClone.host) {
            return true;
        }
        event.preventDefault();
        this.fetchContent(link.href, this.props.isOpen);
    }

    @autobind async onSubmitForm(event) {
        event.preventDefault();
        try {
            const {data} = await this.store.submitForm(event.target);
            if (data && data.returnUrl) {
                serverOrClient.global.location.href = data.returnUrl;
            } else if (data && typeof data === 'string') {
                // Make sure the content html is in sync with the content in the store.
                // E.g. the "Log in" modal form disables the submit button while it is submitting.
                this.store.setContent(this.contentNode.innerHTML);

                const formResponseNode = document.createElement('div');
                formResponseNode.innerHTML = data;
                if (!this.handleRunCommandElements(formResponseNode)) {
                    this.store.setContent(data);
                }
            }
        } catch (e) {
            this.store.setContent(this.props.gettext('An unknown error occurred'), true);
        }
    }

    @autobind renderTitle() {
        return [this.props.labelledById, null];
    }

    render() {
        const {skipCache, url, labelledById, className, gettext, ...modalProps} = this.props;
        const isContentReady = !this.store.isLoading && !!this.store.content;
        let content = null;
        if (isContentReady && this.store.hasErrorContent) {
            content = (
                <div
                    id={labelledById}
                    className="ud-modal-title"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'ajax-modal:error-content',
                        html: this.store.content,
                    })}
                />
            );
        } else if (isContentReady) {
            content = (
                <AjaxModalBody
                    ajaxContentStore={this.store}
                    onBootstrapContents={this.onBootstrapContents}
                />
            );
        }
        return (
            <Modal
                {...modalProps}
                className={className}
                styleName={classNames({'ajax-error': this.store.hasErrorContent})}
                fullPage={isContentReady ? modalProps.fullPage : false}
                loading={!isContentReady}
                title=""
                renderTitle={this.renderTitle}
            >
                {content}
            </Modal>
        );
    }
}

export default withI18n(AjaxModalBase);
