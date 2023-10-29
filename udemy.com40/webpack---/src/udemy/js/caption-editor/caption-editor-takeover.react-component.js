import {getUniqueId} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import {FocusTrappingDialog, Modal} from '@udemy/react-dialog-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons, MinimalHeader} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import S3Uploader from 'caption/s3-uploader';
import {noop} from 'utils/noop';
import {isRequiredUnless} from 'utils/ud-prop-types';

import AnimatedSaveButton from './animated-save-button.react-component';
import CaptionEditStore from './caption-edit.mobx-store';
import CaptionEditor from './caption-editor.react-component';
import ErrorModal from './error-modal.react-component';

import './caption-editor.less';

// eslint-disable-next-line react/prop-types
const CloseEditorModal = ({isOpen, isSaving, onDiscard, onCancel, onSave}) => (
    <Modal
        isOpen={isOpen}
        onClose={onCancel}
        requireExplicitAction={true}
        title={gettext(
            'You have unsaved edits made to this caption file. If you quit you will lose these changes.',
        )}
    >
        <FooterButtons>
            <div styleName="modal-footer-buttons">
                <div styleName="modal-footer-left-buttons">
                    <Button onClick={onDiscard} udStyle="ghost">
                        <span styleName="discard">{gettext('Discard changes')}</span>
                    </Button>
                    <Button onClick={onCancel} udStyle="ghost">
                        {gettext('Cancel')}
                    </Button>
                </div>
                <Button onClick={onSave} disabled={isSaving}>
                    {gettext('Save and Publish')}
                </Button>
            </div>
        </FooterButtons>
    </Modal>
);

export const LoadingOverlay = () => (
    <div styleName="editor-loading-state" data-purpose="initialising-editor">
        <MainContentLoader />
    </div>
);

@observer
export default class CaptionEditorTakeover extends React.Component {
    static propTypes = {
        captionEditStore: PropTypes.object,
        courseId: PropTypes.number.isRequired,
        assetId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        uploader: isRequiredUnless('captionEditStore')(PropTypes.instanceOf(S3Uploader)).isRequired,
        onSaveBtnClick: PropTypes.func,
        onExitBtnClick: PropTypes.func,
        onExit: isRequiredUnless('captionEditStore')(PropTypes.func).isRequired,
        onCaptionCreated: PropTypes.func,
        videoCaptionLocaleId: PropTypes.string,
        transcriptLocaleId: isRequiredUnless('captionEditStore')(PropTypes.string).isRequired,
        actionButtons: PropTypes.node,
        onPlayerReady: PropTypes.func,
        addControlledCloseFn: PropTypes.func,
    };

    static defaultProps = {
        captionEditStore: null,
        onSaveBtnClick: noop,
        onExitBtnClick: noop,
        onCaptionCreated: noop,
        videoCaptionLocaleId: '',
        actionButtons: null,
        onPlayerReady: noop,
        addControlledCloseFn: noop,
    };

    constructor(props) {
        super(props);
        this.dialogRef = React.createRef();
        this.labelledById = getUniqueId('caption-editor');
        this.store =
            props.captionEditStore ||
            new CaptionEditStore(
                props.courseId,
                props.assetId,
                props.videoCaptionLocaleId || props.transcriptLocaleId,
                props.transcriptLocaleId,
                props.uploader,
                props.onCaptionCreated,
                props.onExit,
                props.onPlayerReady,
            );
    }

    componentDidMount() {
        this.onToggleDialog(true);
        window.addEventListener('beforeunload', this.onBrowserExit);
        this.store.initialise();
        this.store.fetchDraftCaptions();
        // Allow consumers of this component a way to safely close the editor.
        this.props.addControlledCloseFn(this.store.exitEditor);
    }

    componentWillUnmount() {
        this.onToggleDialog(false);
        window.removeEventListener('beforeunload', this.onBrowserExit);
    }

    @autobind
    onToggleDialog(isOpen) {
        this.dialogRef.current.onToggle(isOpen);
    }

    @autobind
    onBrowserExit(event) {
        // for a hard exit, we cannot show our fancy modal, but have to rely on what the browser allows us to.
        if (this.store.isDirty) {
            event.returnValue = gettext(
                'You have unsaved edits made to this caption file. If you quit you will lose these changes.',
            );
        }
    }

    @autobind
    onSaveHandler() {
        this.store.saveAsFile();
        this.props.onSaveBtnClick();
    }

    @autobind
    onSaveAndQuitHandler() {
        this.store.saveAsFile().then(this.store.exitEditor);
    }

    @autobind
    onExitHandler() {
        if (this.props.onExitBtnClick() === false) {
            // External controller has prevented close of editor.
            return;
        }
        return this.store.exitEditor();
    }

    get buttons() {
        return (
            <div styleName="takeover-header-buttons">
                {this.props.actionButtons}
                <AnimatedSaveButton
                    onClick={this.onSaveHandler}
                    isSaving={this.store.isSaving}
                    hasError={!!this.store.error}
                    disabled={this.store.isProcessing}
                >
                    {this.store.isProcessing ? gettext('Processing') : gettext('Save & Publish')}
                </AnimatedSaveButton>
                <Button
                    udStyle="ghost"
                    onClick={this.onExitHandler}
                    disabled={this.store.isSaving}
                    data-purpose="editor-exit"
                >
                    {gettext('Quit')}
                </Button>
            </div>
        );
    }

    @autobind
    renderLogo(Component, props) {
        return (
            <div styleName="takeover-logo-wrapper">
                <Component {...props} />
            </div>
        );
    }

    render() {
        const takeover = (
            <Provider store={this.store}>
                <FocusTrappingDialog
                    ref={this.dialogRef}
                    labelledById={this.labelledById}
                    styleName="takeover"
                >
                    <ErrorModal />
                    <CloseEditorModal
                        isOpen={this.store.isExitModalVisible}
                        isSaving={this.store.isSaving}
                        onDiscard={this.store.forceExitEditor}
                        onCancel={this.store.hideCloseEditorModal}
                        onSave={this.onSaveAndQuitHandler}
                    />
                    <MinimalHeader renderLogo={this.renderLogo}>
                        <div styleName="flex takeover-title">
                            <h2 id={this.labelledById} className="ud-text-lg">
                                {this.props.title}
                            </h2>
                        </div>
                        {this.buttons}
                    </MinimalHeader>
                    <div styleName="flex takeover-content">
                        {this.store.isLoading && <LoadingOverlay />}
                        {!this.store.isAssetLoading && <CaptionEditor />}
                    </div>
                </FocusTrappingDialog>
            </Provider>
        );
        return ReactDOM.createPortal(takeover, document.body);
    }
}
