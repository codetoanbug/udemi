import React from 'react';
import ReactDOM from 'react-dom';

import MathEditor from './math-editor.react-component';

/**
 * This class implements the ProseMirror NodeView interface.
 * http://prosemirror.net/docs/ref/#view.NodeView
 * It renders an <MathEditor /> inside math elements.
 */
export default class MathEditorNodeView {
    constructor(node, view, getPos, model, doCommand, isInline) {
        // This generates the HTML that is rendered in the editor, while
        // math_block.toDOM and math_inline.toDOM in the schema generates the HTML that we save to the backend.
        this.dom = document.createElement('div');
        if (isInline) {
            this.dom.style.display = 'inline-block';
        }
        this.dom.setAttribute('data-purpose', 'math-editor-node-view');
        const component = (
            <MathEditor
                node={node}
                getPos={getPos}
                model={model}
                doCommand={doCommand}
                isInline={isInline}
            />
        );
        ReactDOM.render(component, this.dom);
    }

    ignoreMutation() {
        return true;
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.dom);
        this.dom = null;
    }
}
