import autobind from 'autobind-decorator';
import {action, computed, observable, extendObservable} from 'mobx';

import loadMathjax from 'ud-mathjax/load-mathjax';
import handleImportError from 'utils/handle-import-error';

import {AnchorFormModel} from './anchor-form.mobx-model';
import {ANCHOR_FEATURES, EMPTY_DOC_SIZE, TEXT_ONLY_FEATURES} from './constants';
import {getFeaturesForTheme, hasAllFeatures, htmlToText} from './helpers';
import ImageEditFormModel from './image-edit-form.mobx-model';
import ImageEditorModel from './image-editor.mobx-model';
import ImageUploaderModel from './image-uploader.mobx-model';
import MathEditorModel from './math-editor.mobx-model';
import MathFormModel from './math-form.mobx-model';

let _editorLib = null; // Dynamically loaded ud-prosemirror module.
let _mathjaxLib = null; // Dynamically loaded mathjax module.

export function resetEditorLibForTesting() {
    _editorLib = null;
}

export default class RichTextEditorModel {
    constructor({theme}, {gettext}) {
        this.gettext = gettext;

        // Note that although some properties, e.g. `editorValue`, can
        // be @computed from `editorState`, we choose to store them as separate observables
        // to avoid unnecessary recomputations when the editorState changes. For example,
        // the editorState changes whenever the selection changes, but `editorValue` only needs
        // to be recomputed when the text changes.
        extendObservable(
            this,
            {
                _activeImageEditorId: null,
                _activeMathEditorId: null,
                _imageEditors: {},
                _mathEditor: {},
                activeFormats: {
                    TOGGLE_STRONG: false,
                    TOGGLE_EM: false,
                },
                anchorForm: new AnchorFormModel({gettext: this.gettext}),
                commands: {},
                editorState: null,
                editorValue: '',
                features: getFeaturesForTheme(theme),
                isEditorFocused: false,
                _hasEditorFocusedAtLeastOnce: false,
                htmlMode: extendObservable(
                    {},
                    {
                        // This is true if the editor text changed between the time that HTMLMode was
                        // most recently shown and the time that it was most recently hidden.
                        docChanged: false,
                        show: false,
                        editorState: null,
                        serializer: null,
                    },
                    {editorState: observable.ref, serializer: observable.ref},
                ),
                imageEditForm: new ImageEditFormModel({gettext: this.gettext}),
                imageUploader: new ImageUploaderModel(theme, {gettext: this.gettext}),
                mathForm: new MathFormModel(theme),
                isAnchorTooltipShown: false,
                isEditorLibLoaded: !!_editorLib,
                isEditorRendered: false,
                isMathjaxLibLoaded: !!_mathjaxLib,
                isResizingImage: false,
                activeModal: null,
                serializer: null,
                showPlaceholder: true,
            },
            {
                _imageEditors: observable.ref,
                anchorForm: observable.ref,
                commands: observable.ref,
                editorState: observable.ref,
                editorValue: observable.ref,
                features: observable.ref,
                imageEditForm: observable.ref,
                imageUploader: observable.ref,
                serializer: observable.ref,
            },
        );
    }

    @computed
    get editorValueTextContent() {
        return htmlToText(this.editorValue);
    }

    get editorLib() {
        return _editorLib;
    }

    get mathjaxLib() {
        return _mathjaxLib;
    }

    @autobind
    @action
    _setEditorLib(lib) {
        _editorLib = lib;
        this.isEditorLibLoaded = true;
        return lib;
    }

    @autobind
    @action
    _setMathjaxLib(lib) {
        _mathjaxLib = lib;
        this.isMathjaxLibLoaded = true;
        return lib;
    }

    loadEditorLib() {
        return import(/* webpackChunkName: "ud-prosemirror" */ 'ud-prosemirror')
            .then(this._setEditorLib)
            .catch(handleImportError);
    }

    loadMathjaxLib() {
        return loadMathjax().then(this._setMathjaxLib).catch(handleImportError);
    }

    @action
    initializeEditorState(editorValue, autoFocus) {
        const schema = this.editorLib.buildSchema(this.features);
        this.commands = this.editorLib.buildCommands(this.features, schema, this);
        const plugins = this.editorLib.buildPlugins(schema, this.commands);
        this.serializer = new this.editorLib.helpers.RichTextSerializer(schema, {
            preserveWhitespace: 'full',
        });
        const doc = this.serializer.toInternalValue(editorValue);
        const state = this.editorLib.EditorState.create({doc, schema, plugins});
        this.syncWithEditor(state, null, autoFocus);
    }

    @action
    initializeHTMLModeEditorState() {
        const schema = this.editorLib.buildSchema(TEXT_ONLY_FEATURES);
        const commands = this.editorLib.buildCommands(TEXT_ONLY_FEATURES, schema, this);
        const plugins = this.editorLib.buildPlugins(schema, commands);
        this.htmlMode.serializer = new this.editorLib.helpers.PlainTextSerializer(schema, {
            preserveWhitespace: 'full',
        });
        this.syncWithHTMLModeEditor(this.editorLib.EditorState.create({schema, plugins}), null);
    }

    @action
    setEditorRenderedTrue() {
        this.isEditorRendered = true;
    }

    @autobind
    @action
    showAnchorTooltip(state) {
        this._syncAnchorFormWithEditor(state);
        this.isAnchorTooltipShown = true;
    }

    @autobind
    @action
    hideAnchorTooltip() {
        this.isAnchorTooltipShown = false;
    }

    @autobind
    @action
    setIsResizingImage(value) {
        this.isResizingImage = value;
    }

    registerImageEditor(id, getPos) {
        this._imageEditors[id] = new ImageEditorModel(getPos);
    }

    @action
    unregisterImageEditor(id) {
        delete this._imageEditors[id];
        if (id === this._activeImageEditorId) {
            this._activeImageEditorId = null;
        }
    }

    getImageEditor(id) {
        return this._imageEditors[id];
    }

    get activeImageEditor() {
        return this._imageEditors[this._activeImageEditorId] || null;
    }

    @action
    setActiveImageEditor(id) {
        if (this.activeImageEditor) {
            this.activeImageEditor.setIsOverlayShown(false);
        }
        this._activeImageEditorId = id;
        if (this.activeImageEditor) {
            this.activeImageEditor.setIsOverlayShown(true);
        }
    }

    registerMathEditor(id, getPos, typesetHandler) {
        this._mathEditor[id] = new MathEditorModel(getPos);
        this._mathEditor[id].typesetHandler = typesetHandler;
    }

    @action
    unregisterMathEditor(id) {
        delete this._mathEditor[id];
        if (id === this._activeMathEditorId) {
            this._activeMathEditorId = null;
        }
    }

    getMathEditor(id) {
        return this._mathEditor[id];
    }

    get activeMathEditor() {
        return this._mathEditor[this._activeMathEditorId] || null;
    }

    @action
    setActiveMathEditor(id) {
        if (this.activeMathEditor) {
            this.activeMathEditor.setIsOverlayShown(false);
            this.activeMathEditor.typesetHandler();
        }
        this._activeMathEditorId = id;
        if (this.activeMathEditor) {
            this.activeMathEditor.setIsOverlayShown(true);
        }
    }

    @action
    setEditorFocus(isFocused) {
        this.isEditorFocused = isFocused;
    }

    @autobind
    @action
    syncWithEditor(state, tr, isEditorFocused = false) {
        // This is called very frequently (every time the selection or text changes).

        // There's no transaction for the initial sync right after the editor is initialized.
        const isInitialSync = !tr;

        this.editorState = state;
        if (isEditorFocused) {
            this._hasEditorFocusedAtLeastOnce = true;
        }

        if (isInitialSync || tr.docChanged) {
            this.editorValue = this.serializer.toText(state.doc);
            this.hideAnchorTooltip();
        }

        const hasStoredMarks = (state.storedMarks || []).length > 0;
        this.showPlaceholder = state.doc.content.size <= EMPTY_DOC_SIZE && !hasStoredMarks;

        const {isMarkActive} = this.editorLib.helpers;
        const marks = state.schema.marks;
        Object.assign(this.activeFormats, {
            TOGGLE_STRONG:
                this._hasEditorFocusedAtLeastOnce &&
                this.features.has('TOGGLE_STRONG') &&
                isMarkActive(state, marks.strong),
            TOGGLE_EM:
                this._hasEditorFocusedAtLeastOnce &&
                this.features.has('TOGGLE_EM') &&
                isMarkActive(state, marks.em),
        });

        // We only need to sync this.anchorForm.data when we're about to show the form.
        // We always need to sync this.anchorForm.isEditing because the menu bar shows
        // different text ("Insert link" vs "Edit link").
        this._syncAnchorFormWithEditor(state, {parseFormData: false});
    }

    @autobind
    @action
    _syncAnchorFormWithEditor(state, options = {parseFormData: true}) {
        if (!hasAllFeatures(this.features, ANCHOR_FEATURES)) {
            return;
        }
        const {parseAnchorForm} = this.editorLib.helpers;
        const {text, href, hasAnchor} = parseAnchorForm(state, options);
        if (options.parseFormData) {
            this.anchorForm.reset({data: {text, href}, isEditing: hasAnchor});
        } else {
            this.anchorForm.setIsEditing(hasAnchor);
        }
    }

    @autobind
    @action
    openAnchorModal(state) {
        this.activeModal = 'ANCHOR';
        this._syncAnchorFormWithEditor(state);
        this.hideAnchorTooltip();
    }

    @autobind
    @action
    openImageUploadModal() {
        this.activeModal = 'IMAGE_UPLOAD';
        this.imageUploader.resetFiles();
        this.imageUploader.resetError();
    }

    @autobind
    @action
    openImageEditModal(state) {
        const imageEditor = this.activeImageEditor;
        const {parseImageEditor} = this.editorLib.helpers;
        const {image, link, caption} = parseImageEditor(state, imageEditor.getPos());
        this.imageEditForm.reset({
            data: {
                src: image.attrs.src || '',
                alt: image.attrs.alt || '',
                href: link ? link.attrs.href : '',
                caption: caption ? caption.textContent : '',
            },
        });
        imageEditor.setIsOverlayShown(false);
        this.activeModal = 'IMAGE_EDIT';
    }

    @autobind
    @action
    openMathModal() {
        this.activeModal = 'MATH_MODAL';
    }

    @autobind
    @action
    closeModal() {
        if (this.activeModal === 'IMAGE_UPLOAD') {
            this.imageUploader.resetError();
        }
        this.activeModal = null;
    }

    @autobind
    @action
    toggleHTMLMode() {
        this.htmlMode.show = !this.htmlMode.show;
        if (this.htmlMode.show) {
            this.htmlMode.docChanged = false;
        }
    }

    @autobind
    @action
    syncWithHTMLModeEditor(state, tr) {
        this.htmlMode.editorState = state;
        if (tr && tr.docChanged) {
            this.htmlMode.docChanged = true;
            this.showPlaceholder = state.doc.content.size <= EMPTY_DOC_SIZE;
            this.editorValue = this.htmlMode.serializer.toText(state.doc);
        }
    }
}
