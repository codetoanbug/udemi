import {withI18n} from '@udemy/i18n';
import {withCounter} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import AnchorModal from './anchor-modal.react-component';
import AnchorTooltip from './anchor-tooltip.react-component';
import BaseEditor from './base-editor.react-component';
import {ANCHOR_FEATURES, IMAGE_FEATURES, THEMES, MATH_FEATURES} from './constants';
import {hasAllFeatures, getAnchorTooltipTrigger} from './helpers';
import HTMLMode from './html-mode.react-component';
import ImageEditModal from './image-edit-modal.react-component';
import ImageEditorNodeView from './image-editor-node-view';
import ImageUploadErrorAlert from './image-upload-error-alert.react-component';
import ImageUploadModal from './image-upload-modal.react-component';
import ImageUploadProgressBar from './image-upload-progress-bar.react-component';
import MathEditorNodeView from './math-editor-node-view';
import MathModal from './math-modal.react-component';
import MenuBar from './menu-bar.react-component';
import RichTextEditorModel from './rich-text-editor.mobx-model';
import '../rich-text-viewer/rich-text-scaffolding.global.less';
import './rich-text-editor.global.less';

// <NamedInput /> and <TextCounterInput /> are separated from <RichTextEditor /> so that
// we don't re-render <RichTextEditor /> every time `model.editorValue` changes.

const NamedInput = observer(({model, name}) => {
    return <input name={name} type="hidden" className="rt-hidden" value={model.editorValue} />;
});

const TextCounter = withCounter(({count}) => {
    return (
        <span
            className={classNames('rt-counter', {'rt-counter-error': count < 0})}
            data-purpose="form-control-counter"
        >
            {count}
        </span>
    );
});

const TextCounterInput = observer(({model, maxLength}) => {
    return <TextCounter value={model.editorValueTextContent} maxLength={maxLength} />;
});

@observer
class RichTextEditor extends Component {
    static THEMES = THEMES;

    static propTypes = {
        theme: PropTypes.oneOf(Object.values(THEMES)).isRequired,
        value: PropTypes.string,
        autoFocus: PropTypes.bool,
        contentEditable: PropTypes.bool, // If false, text is not editable
        maxLength: PropTypes.number, // Used with withCounter
        minHeight: PropTypes.string, // e.g. '40px'
        name: PropTypes.string, // Form field name, needed for native browser form submit
        onBlur: PropTypes.func, // Called after the editor has blurred
        onFocus: PropTypes.func, // Called after the editor has focused
        onInit: PropTypes.func, // Called once the editor has initialized
        onKeyDown: PropTypes.func, // Called after a key is pressed
        onValueChange: PropTypes.func, // Called every time editor value changes
        placeholder: PropTypes.string,
        toolbarFixed: PropTypes.bool, // If true, MenuBar is sticky
        withCounter: PropTypes.bool, // Adds HTML char counter to the MenuBar
        menuBarPosition: PropTypes.oneOf(['top', 'bottom']),
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    static defaultProps = {
        value: '',
        autoFocus: false,
        contentEditable: true,
        maxLength: null,
        minHeight: '70px',
        name: null,
        onBlur: noop,
        onFocus: noop,
        onInit: noop,
        onKeyDown: noop,
        onValueChange: noop,
        placeholder: '',
        toolbarFixed: true,
        withCounter: false,
        menuBarPosition: 'top',
    };

    constructor(props, context) {
        super(props, context);
        this.model = new RichTextEditorModel({theme: this.props.theme}, {gettext: props.gettext});

        this.anchorClickTarget = null;
        this.focusTrappingDialogProps = {findTriggerNode: () => this.view};
    }

    componentDidMount() {
        this.model.loadEditorLib();
        if (hasAllFeatures(this.model.features, MATH_FEATURES)) {
            this.model.loadMathjaxLib();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            this.model.isEditorRendered &&
            nextProps.value !== this.props.value &&
            nextProps.value !== this.model.editorValue
        ) {
            const doc = this.model.serializer.toInternalValue(nextProps.value);
            this.model.editorLib.helpers.overrideDoc(this.view, doc);
        }
    }

    componentWillUnmount() {
        // This noops the `focus` method that we expose to parent components via the `onInit`
        // callback. In terms of garbage collection, this shouldn't be necessary because
        // BaseEditor calls `this.view.destroy()`. We didn't use an observable because we didn't
        // want unnecessary re-rendering to be triggered on unmount.
        this.view = null;
    }

    @autobind
    getEditorProps() {
        const _this = this;
        const fromDOMSerializer = this.model.serializer.fromDOMSerializer;
        return {
            state: this.model.editorState,
            dispatchTransaction: this.dispatchTransaction,
            clipboardTextParser: fromDOMSerializer.parseClipboardText,
            domParser: fromDOMSerializer,
            transformPastedHTML: fromDOMSerializer.transformPastedHTML,
            handleClick: this.handleClick,
            handleDOMEvents: {
                // We can't use the `handleDrop` prop because it's only called when parsing
                // text from the clipboard. We want it to be called when the user drops an image.
                drop: this.handleDrop,

                blur() {
                    _this.model.setEditorFocus(false);
                    return _this.props.onBlur();
                },
                focus() {
                    _this.model.setEditorFocus(true);
                    return _this.props.onFocus();
                },
            },
            handleKeyDown(view, event) {
                return _this.props.onKeyDown(event);
            },
            nodeViews: {
                image(node, view, getPos) {
                    return new ImageEditorNodeView(
                        node,
                        view,
                        getPos,
                        _this.model,
                        _this.doCommand,
                    );
                },
                math_block(node, view, getPos) {
                    return new MathEditorNodeView(
                        node,
                        view,
                        getPos,
                        _this.model,
                        _this.doCommand,
                        false,
                    );
                },
                math_inline(node, view, getPos) {
                    return new MathEditorNodeView(
                        node,
                        view,
                        getPos,
                        _this.model,
                        _this.doCommand,
                        true,
                    );
                },
            },
        };
    }

    @autobind
    onEditorWillMount() {
        // It's important to do this right before the <BaseEditor /> has mounted, not earlier,
        // because this.props.value might have changed between the time we mount this component and
        // the time the <BaseEditor /> has mounted.
        this.model.initializeEditorState(this.props.value, this.props.autoFocus);
    }

    @autobind
    onEditorDidMount(view) {
        const _this = this;
        this.view = view;
        this.model.setEditorRenderedTrue();
        if (this.props.autoFocus) {
            this.model.editorLib.helpers.setCursorAndFocus(this.view);
        }
        this.props.onInit({
            focus() {
                // We check whether `this.view` exists in case the method is called after
                // the editor has unmounted.
                if (_this.view) {
                    _this.model.editorLib.helpers.setCursorAndFocus(_this.view);
                }
            },
            blur() {
                _this.view && _this.view.dom.blur();
            },
        });
    }

    @autobind
    dispatchTransaction(transaction) {
        if (!this.props.contentEditable) {
            return;
        }
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);
        const prevEditorValue = this.model.editorValue;
        this.model.syncWithEditor(newState, transaction, this.view.focused);
        if (prevEditorValue !== this.model.editorValue) {
            // Comparing editorValue is more accurate than using transaction.docChanged.
            // Sometimes the docs can be copies of each other, in which case transaction.docChanged
            // is true, but there's no actual change.
            this.props.onValueChange(this.model.editorValue);
            if (hasAllFeatures(this.model.features, IMAGE_FEATURES)) {
                this.doCommand('DELETE_FIGURE', {focusOnEditor: false});
            }
        }
    }

    showAnchorTooltip(target, state) {
        this.anchorClickTarget = target;
        this.model.showAnchorTooltip(state);
    }

    @autobind
    hideAnchorTooltip() {
        this.anchorClickTarget = null;
        this.model.hideAnchorTooltip();
    }

    @autobind
    handleClick(view, pos, event) {
        // If click target is not an anchor target, tooltip is hidden.
        // If click target is the active anchor target, tooltip is toggled.
        // If click target is an inactive anchor target, tooltip is shown.
        const anchorClickTarget = getAnchorTooltipTrigger(event.target, view.dom);
        if (
            anchorClickTarget &&
            (this.anchorClickTarget !== anchorClickTarget || !this.model.isAnchorTooltipShown)
        ) {
            this.showAnchorTooltip(anchorClickTarget, view.state);
        } else {
            this.hideAnchorTooltip();
        }
    }

    @autobind
    handleDrop(view, event) {
        event.preventDefault();
        const hasImageFeatures = hasAllFeatures(this.model.features, IMAGE_FEATURES);
        if (event.dataTransfer && event.dataTransfer.files && hasImageFeatures) {
            const files = [...event.dataTransfer.files];
            this.model.imageUploader.uploadAndInsertImages(files, this.doCommand);
        }
    }

    /**
     * Specify focusOnEditor: false if you don't want to focus on the editor after completing
     * the command. E.g. we do this when we're opening a modal.
     * Specify focusBeforeCommand: true if you want to focus on the editor before completing
     * the command. E.g. we do this when we're inserting a link or an image. This works around
     * a bug on Firefox where the arrow keys get stuck after inserting content if the editor
     * is not focused. If we focus after completing the command, we get a different bug on Safari
     * where the cursor moves to the start of the content.
     */
    @autobind
    doCommand(feature, options) {
        options = {focusOnEditor: true, focusBeforeCommand: false, ...options};
        if (!this.view || !this.props.contentEditable || !this.model.isEditorRendered) {
            return;
        }
        const command = this.model.commands[feature];
        const view = this.view;
        if (options.focusOnEditor && options.focusBeforeCommand) {
            view.focus();
        }
        command(view.state, view.dispatch, view);
        if (options.focusOnEditor && !options.focusBeforeCommand) {
            view.focus();
        }
    }

    @autobind
    onHideHTMLMode() {
        if (this.model.htmlMode.docChanged) {
            const doc = this.model.serializer.toInternalValue(this.model.editorValue);
            this.model.editorLib.helpers.overrideDoc(this.view, doc);
        }
        this.model.editorLib.helpers.setCursorAndFocus(this.view);
    }

    @autobind
    getAnchorClickTarget() {
        return this.anchorClickTarget;
    }

    @autobind
    setWrapperRef(ref) {
        this.wrapperRef = ref;
    }

    renderCounter() {
        if (!this.props.withCounter) {
            return null;
        }
        return <TextCounterInput model={this.model} maxLength={this.props.maxLength} />;
    }

    render() {
        const {
            contentEditable,
            minHeight,
            placeholder,
            name,
            menuBarPosition,
            onValueChange,
            toolbarFixed,
        } = this.props;
        const hasAnchorFeatures = hasAllFeatures(this.model.features, ANCHOR_FEATURES);
        const hasImageFeatures = hasAllFeatures(this.model.features, IMAGE_FEATURES);
        const hasMathFeatures = hasAllFeatures(this.model.features, MATH_FEATURES);
        const hasHTMLMode = this.model.features.has('TOGGLE_HTML_MODE');
        const menuBar = (
            <div
                className={classNames('rt-menu-bar-container', {
                    'rt-menu-bar-container-sticky': toolbarFixed && menuBarPosition !== 'bottom',
                })}
                data-purpose="menu-bar-container"
            >
                <MenuBar
                    contentEditable={contentEditable}
                    counter={this.renderCounter()}
                    doCommand={this.doCommand}
                    menuBarPosition={menuBarPosition}
                    model={this.model}
                />
                {this.model.isEditorLibLoaded && hasImageFeatures ? (
                    <ImageUploadProgressBar model={this.model} hideWhenActiveModal={true} />
                ) : null}
                {this.model.isEditorLibLoaded && hasImageFeatures ? (
                    <ImageUploadErrorAlert model={this.model} hideWhenActiveModal={true} />
                ) : null}
            </div>
        );
        const baseEditor = this.model.isEditorLibLoaded ? (
            <BaseEditor
                model={this.model}
                contentEditable={contentEditable}
                minHeight={minHeight}
                placeholder={placeholder}
                getEditorProps={this.getEditorProps}
                onWillMount={this.onEditorWillMount}
                onDidMount={this.onEditorDidMount}
                editorMode="WYSIWYG"
                dataPurpose="wysiwyg-mode"
            />
        ) : (
            <div
                className="rt-editor rt-editor--wysiwyg-mode"
                data-purpose="placeholder-wysiwyg-mode"
            >
                <div className="ProseMirror" style={{minHeight}}>
                    <Loader block={true} size="large" />
                </div>
            </div>
        );
        return (
            <Provider focusTrappingDialogProps={this.focusTrappingDialogProps}>
                <div
                    ref={this.setWrapperRef}
                    className={classNames('udlite-in-udheavy rt-editor-container', {
                        'rt-editor-focused': this.model.isEditorFocused,
                    })}
                >
                    {menuBarPosition === 'bottom' ? baseEditor : menuBar}
                    {menuBarPosition === 'bottom' ? menuBar : baseEditor}
                    {this.model.isEditorLibLoaded && hasHTMLMode ? (
                        <HTMLMode
                            model={this.model}
                            contentEditable={contentEditable}
                            minHeight={minHeight}
                            placeholder={placeholder}
                            onHide={this.onHideHTMLMode}
                            onValueChange={onValueChange}
                        />
                    ) : null}
                    {name ? <NamedInput model={this.model} name={name} /> : null}
                    {this.model.isEditorLibLoaded && hasAnchorFeatures ? (
                        <AnchorModal doCommand={this.doCommand} model={this.model} />
                    ) : null}
                    {this.model.isEditorLibLoaded && hasAnchorFeatures && !isMobileBrowser ? (
                        <AnchorTooltip
                            getTarget={this.getAnchorClickTarget}
                            doCommand={this.doCommand}
                            model={this.model}
                            onHide={this.hideAnchorTooltip}
                        />
                    ) : null}
                    {this.model.isEditorLibLoaded && hasImageFeatures ? (
                        <ImageUploadModal doCommand={this.doCommand} model={this.model} />
                    ) : null}
                    {this.model.isEditorLibLoaded && hasImageFeatures ? (
                        <ImageEditModal
                            doCommand={this.doCommand}
                            hasAnchorFeatures={hasAnchorFeatures}
                            model={this.model}
                        />
                    ) : null}
                    {this.model.isEditorLibLoaded && hasMathFeatures ? (
                        <MathModal doCommand={this.doCommand} model={this.model} />
                    ) : null}
                </div>
            </Provider>
        );
    }
}

export default Object.assign(withI18n(RichTextEditor), {
    THEMES: RichTextEditor.THEMES,
});
