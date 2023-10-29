import {action, observable} from 'mobx';

export default class ImageEditorModel {
    @observable isOverlayShown = false;

    /**
     * @param getPos: a function provided by ProseMirror which, when called, returns the
     * absolute position of this image editor. We need this position in order to apply
     * transactions to the corresponding node in the ProseMirror doc.
     * http://prosemirror.net/docs/ref/#view.NodeView
     */
    constructor(getPos) {
        this.getPos = getPos;
    }

    @action
    setIsOverlayShown(value) {
        this.isOverlayShown = value;
    }
}
