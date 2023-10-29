import {action, observable} from 'mobx';

export default class MathEditorModel {
    @observable isOverlayShown = false;

    /**
     * @param getPos: a function provided by ProseMirror which, when called, returns the
     * absolute position of this math editor. We need this position in order to apply
     * transactions to the corresponding node in the ProseMirror doc.
     * http://prosemirror.net/docs/ref/#view.NodeView
     */
    constructor(getPos) {
        this.getPos = getPos;

        // Needed to execute a MathJax rendering when other math node is selected
        this.typesetHandler = null;
    }

    @action
    setIsOverlayShown(value) {
        this.isOverlayShown = value;
    }
}
