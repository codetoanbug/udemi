import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {isChecked} from '@udemy/react-checked-state-components';
import {IconButton, Button, Image} from '@udemy/react-core-components';
import {
    FocusTrappingDialog,
    FullPageOverlay,
    EXIT_ANIMATION_DURATION_MS,
} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import CheckedStateCheckbox from 'base-components/checked-state/checked-state-checkbox.react-component';

import './open-full-size-image.less';

const LargerImageIcon = () => {
    const {gettext} = useI18n();

    return <SearchIcon label={gettext('Larger image')} size="large" />;
};

const FullSizeImageTitle = () => {
    const {gettext} = useI18n();

    return <>{gettext('Full size image')}</>;
};

const CloseButtonIcon = () => {
    const {gettext} = useI18n();

    return <CloseIcon label={gettext('close modal')} />;
};

@observer
export default class OpenFullSizeImage extends Component {
    static propTypes = {
        alt: PropTypes.string,
        src: PropTypes.string.isRequired,
        href: PropTypes.string,
    };

    static defaultProps = {
        alt: '',
        href: null,
    };

    @observable isModalOpen = false;
    @observable shouldRenderClosedModal = false;

    @autobind
    @action
    onToggleModal(isOpen) {
        this.isModalOpen = isOpen;
        this.shouldRenderClosedModal = true;
        if (!isOpen) {
            setTimeout(
                action(() => {
                    this.shouldRenderClosedModal = false;
                }),
                EXIT_ANIMATION_DURATION_MS,
            );
        }
    }

    @autobind
    @action
    onClickTrigger(event) {
        // In some cases this component is rendered inside an anchor. We want to prevent the
        // anchor href when clicking on the open-full-size-image modal trigger.
        event.preventDefault();

        // To preserve FullPageOverlay animation, modal must be initially invisible, then shown.
        // `isModalOpen` will change to true once the modal is mounted.
        this.isModalOpen = false;
        this.shouldRenderClosedModal = true;
    }

    render() {
        const {alt, src, href} = this.props;
        const image = <Image src={src} alt={alt} lazy={false} height="unset" width="unset" />;
        const imageLink = href && (
            <a href={href} rel="nofollow noopener noreferrer" target="_blank">
                {image}
            </a>
        );

        return (
            <div styleName="wrapper" data-purpose="open-full-size-image">
                {image}
                <Button udStyle="link" styleName="backdrop" onClick={this.onClickTrigger}>
                    <LargerImageIcon />
                </Button>
                {(this.isModalOpen || this.shouldRenderClosedModal) && (
                    <FullSizeImageModal isOpen={this.isModalOpen} onToggle={this.onToggleModal}>
                        {imageLink || image}
                    </FullSizeImageModal>
                )}
            </div>
        );
    }
}

class FullSizeImageModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onToggle: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.onChange(true);
    }

    containerRef = React.createRef();
    dialogRef = React.createRef();
    id = getUniqueId('full-size-image-modal');
    labelledById = getUniqueId('full-size-image-modal-title');

    @autobind
    onChange(isOpen) {
        this.dialogRef.current.onToggle(isOpen, this.containerRef.current);
        this.props.onToggle(isOpen);
    }

    render() {
        const modal = (
            <div ref={this.containerRef} styleName="dialog-container">
                <CheckedStateCheckbox
                    id={this.id}
                    className="ud-full-page-overlay-checkbox"
                    closeOnEscape={true}
                    checked={this.props.isOpen}
                    onChange={(event) => this.onChange(isChecked(event))}
                />
                <div className="ud-full-page-overlay-container" styleName="dialog-scroll-wrapper">
                    <FullPageOverlay cssToggleId={this.id} styleName="dialog-overlay" />
                    <FocusTrappingDialog
                        ref={this.dialogRef}
                        labelledById={this.labelledById}
                        styleName="dialog"
                    >
                        <FocusTrappingDialog.Title id={this.labelledById} show={false}>
                            <FullSizeImageTitle />
                        </FocusTrappingDialog.Title>
                        {this.props.children}
                        <IconButton
                            cssToggleId={this.id}
                            udStyle="ghost"
                            styleName="dialog-close-button"
                        >
                            <CloseButtonIcon />
                        </IconButton>
                    </FocusTrappingDialog>
                </div>
            </div>
        );

        return ReactDOM.createPortal(modal, document.body);
    }
}
