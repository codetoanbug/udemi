import React from 'react';
import ReactDOM from 'react-dom';

import ImageEditor from './image-editor.react-component';

/**
 * This class implements the ProseMirror NodeView interface.
 * http://prosemirror.net/docs/ref/#view.NodeView
 * It renders an <ImageEditor /> inside the contenteditable which edits `img` elements.
 */
export default class ImageEditorNodeView {
    constructor(node, view, getPos, model, doCommand) {
        // This generates the HTML that is rendered in the editor, while
        // image.toDOM in the schema generates the HTML that we save to the backend.
        this.dom = document.createElement('div');
        this.dom.style.display = 'inline-block';
        this.dom.setAttribute('data-purpose', 'image-editor-node-view');
        const component = (
            <ImageEditor node={node} getPos={getPos} model={model} doCommand={doCommand} />
        );
        ReactDOM.render(component, this.dom);
    }

    ignoreMutation() {
        return true;
    }

    stopEvent(event) {
        // Ignore all events except drag-and-drop events.
        // We allow the user to upload images by dropping them into the editor.
        // If we ignore drag-and-drop events, and the user drops an image on top
        // of another image, then the upload doesn't work.
        const type = event.type.toLowerCase();
        return !(type.startsWith('drag') || type.startsWith('drop'));
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.dom);
        this.dom = null;
    }
}
