import {Keys, getUniqueId} from '@udemy/design-system-utils';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import './info-overlay.less';

@inject(({focusTrappingDialogProps}) => ({focusTrappingDialogProps}))
export default class InfoOverlay extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        title: PropTypes.node.isRequired,
        onClose: PropTypes.func.isRequired,
        container: PropTypes.object,
        focusTrappingDialogProps: PropTypes.shape({
            findTriggerNode: PropTypes.func,
        }),
    };

    static defaultProps = {
        container: null,
        focusTrappingDialogProps: {},
    };

    constructor(props, context) {
        super(props, context);
        this.dialogRef = React.createRef();
        this.labelledById = getUniqueId('info-overlay');
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentDidUpdate(prevProps) {
        prevProps.isOpen !== this.props.isOpen && this.toggleDialog();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    @autobind
    toggleDialog() {
        if (this.props.isOpen) {
            const findTriggerNode = this.props.focusTrappingDialogProps.findTriggerNode;
            const trigger = document.activeElement;
            if (findTriggerNode && trigger && trigger.getAttribute('role') === 'menuitem') {
                this.triggerNode = findTriggerNode();
            } else {
                this.triggerNode = trigger;
            }

            this.dialogRef.current && this.dialogRef.current.focus();
        } else {
            this.triggerNode && this.triggerNode.focus();
        }
    }

    @autobind
    onKeyDown(event) {
        const code = event.which || event.keyCode;
        code === Keys.ESCAPE && this.props.onClose(event);
    }

    render() {
        if (!this.props.isOpen || !this.props.container) {
            return null;
        }

        const dialog = (
            <div
                ref={this.dialogRef}
                role="dialog"
                tabIndex="-1"
                aria-labelledby={this.labelledById}
                styleName="info-overlay"
            >
                <h2 id={this.labelledById} className="ud-heading-xxl" styleName="title">
                    {this.props.title}
                </h2>
                {this.props.children}
                <IconButton
                    onClick={this.props.onClose}
                    udStyle="ghost"
                    styleName="close-button"
                    data-purpose="close-popup"
                >
                    <CloseIcon size="large" label={gettext('Close')} />
                </IconButton>
            </div>
        );

        return ReactDOM.createPortal(dialog, this.props.container);
    }
}
