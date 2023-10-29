import {getUniqueId} from '@udemy/design-system-utils';
import {Schema} from 'prosemirror-model';

import {
    ANCHOR_FEATURES,
    BLOCK_FORMAT_FEATURES,
    LIST_FEATURES,
    IMAGE_FEATURES,
    HEADING_LEVEL,
    MATH_FEATURES,
} from 'base-components/ungraduated/form/rich-text-editor/constants';
import {
    hasAllFeatures,
    validateHref,
} from 'base-components/ungraduated/form/rich-text-editor/helpers';

import {parseTextDirection} from './helpers';

export default function buildSchema(features) {
    // https://github.com/ProseMirror/prosemirror-schema-basic/blob/1.0.0/src/schema-basic.js
    // https://prosemirror.net/examples/basic/
    return new Schema({marks: buildMarks(features), nodes: buildNodes(features)});
}

function buildMarks(features) {
    // The order that the marks are defined in matters.
    // Marks defined earlier always wrap around marks defined later.
    // https://discuss.prosemirror.net/t/confusing-link-structure/1137/2
    const marks = {};
    extendIfEnabled(features, IMAGE_FEATURES, marks, {
        // Although <figcaption /> seems like it would be a node, it's actually easier to
        // implement as a mark. We want to support two structures:
        //
        // 1. When an image is uploaded, the structure is:
        // <figure>
        //     <a><img /></a>
        //     <figcaption />
        // </figure>
        // where <a /> and <figcaption /> are optional.
        // 2. When an image is copy-pasted, the <img /> might not be inside a <figure />.
        //
        // ProseMirror does not allow mixing inline and block content. If we make <img /> a block,
        // then ProseMirror does not know how to apply anchor marks around it. If we make
        // <figcaption /> inline, then sometimes it renders as a completely empty node. Due to
        // limitations in contenteditable, there's no way to insert text in an empty node
        // (this is typically worked around by inserting a <br /> in otherwise empty nodes).
        figcaption: {
            parseDOM: [{tag: 'figcaption', context: 'figure/'}],
            toDOM() {
                return ['figcaption'];
            },
        },
    });
    extendIfEnabled(features, ANCHOR_FEATURES, marks, {
        link: {
            attrs: {
                href: {},
                title: {default: ''},
            },
            inclusive: false,
            parseDOM: [
                {
                    tag: 'a',
                    getAttrs(dom) {
                        const attrs = {
                            href: dom.getAttribute('href'),
                            title: dom.getAttribute('title'),
                        };
                        const validatedData = {};
                        const error = {};
                        validateHref(attrs.href, validatedData, error, true, gettext);
                        if (error.href) {
                            return false;
                        }
                        return attrs;
                    },
                },
            ],
            toDOM(node) {
                const attrs = withoutEmptyAttrs({
                    ...node.attrs,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    id: node.attrs.id || getUniqueId('rt-link'),
                });
                return ['a', attrs];
            },
        },
    });
    extendIfEnabled(features, 'TOGGLE_CODE', marks, {
        code: {
            parseDOM: [{tag: 'code'}],
            toDOM() {
                return ['code'];
            },
        },
    });
    extendIfEnabled(features, 'TOGGLE_STRONG', marks, {
        strong: {
            parseDOM: [
                {tag: 'strong'},
                {
                    tag: 'b',
                    getAttrs(node) {
                        return node.style.fontWeight !== 'normal';
                    },
                },
                {
                    style: 'font-weight',
                    getAttrs(value) {
                        return /^(bold(er)?|[5-9]\d{2,})$/.test(value);
                    },
                },
            ],
            toDOM() {
                return ['strong'];
            },
        },
    });
    extendIfEnabled(features, 'TOGGLE_EM', marks, {
        em: {
            parseDOM: [{tag: 'i'}, {tag: 'em'}, {style: 'font-style=italic'}],
            toDOM() {
                return ['em'];
            },
        },
    });
    return marks;
}

function buildNodes(features) {
    const nodes = buildTextOnlyNodes();
    extendIfEnabled(features, 'ADD_HARD_BREAK', nodes, {
        hard_break: {
            inline: true,
            group: 'inline',
            selectable: false,
            parseDOM: [
                {
                    tag: 'br',
                    ignore: true,
                    getAttrs(node) {
                        return isEmptyLine(node) ? {} : false;
                    },
                },
                {
                    tag: 'br',
                    getAttrs(node) {
                        return isEmptyLine(node) ? false : {};
                    },
                },
            ],
            toDOM() {
                return ['br'];
            },
        },
    });
    extendIfEnabled(features, BLOCK_FORMAT_FEATURES, nodes, {
        blockquote: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            content: 'block+',
            group: 'block',
            defining: true,
            parseDOM: [
                {
                    tag: 'blockquote',
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                return ['blockquote', withoutEmptyAttrs(node.attrs), 0];
            },
        },
        heading: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            content: 'inline*',
            group: 'block',
            defining: true,
            parseDOM: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((heading) => {
                return {
                    tag: heading,
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                };
            }),
            toDOM(node) {
                return [`h${HEADING_LEVEL}`, withoutEmptyAttrs(node.attrs), 0];
            },
        },
    });
    extendIfEnabled(features, LIST_FEATURES, nodes, {
        ordered_list: {
            attrs: {
                order: {default: 1},
                dir: {default: ''},
            },
            reparseInView: true,
            parseDOM: [
                {
                    tag: 'ol',
                    getAttrs(dom) {
                        return {
                            order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1,
                            dir: parseTextDirection(dom),
                        };
                    },
                },
            ],
            toDOM(node) {
                return [
                    'ol',
                    withoutEmptyAttrs({
                        start: node.attrs.order === 1 ? '' : node.attrs.order,
                        dir: node.attrs.dir,
                    }),
                    0,
                ];
            },
            content: 'list_item+',
            group: 'block',
        },
        bullet_list: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            parseDOM: [
                {
                    tag: 'ul',
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                return ['ul', withoutEmptyAttrs(node.attrs), 0];
            },
            content: 'list_item+',
            group: 'block',
        },
        list_item: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            parseDOM: [
                {
                    tag: 'li',
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                return ['li', withoutEmptyAttrs(node.attrs), 0];
            },
            defining: true,
            content: 'block+',
        },
    });

    extendIfEnabled(features, IMAGE_FEATURES, nodes, {
        figure: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            content: 'inline*',
            group: 'block',
            parseDOM: [
                {
                    tag: 'figure',
                    getAttrs(dom) {
                        if (dom.querySelectorAll('img').length !== 1) {
                            return false;
                        }
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                return ['figure', withoutEmptyAttrs(node.attrs), 0];
            },
        },
        image: {
            inline: true,
            attrs: {
                src: {},
                width: {default: ''},
                height: {default: ''},
                alt: {default: ''},
            },
            draggable: false,
            group: 'inline',
            parseDOM: [
                {
                    tag: 'img',
                    getAttrs(node) {
                        const attrs = {
                            src: node.getAttribute('src'),
                            width: node.getAttribute('width'),
                            height: node.getAttribute('height'),
                            alt: node.getAttribute('alt') || node.getAttribute('title'),
                        };
                        if (!attrs.src) {
                            return false;
                        }
                        return attrs;
                    },
                },
            ],
            toDOM(node) {
                // This generates the HTML that we save to the backend, while
                // ImageEditorNodeView.dom generates the HTML that is rendered in the editor.
                const attrs = withoutEmptyAttrs({
                    ...node.attrs,
                    title: node.attrs.alt,
                });
                return ['img', attrs];
            },
        },
    });
    extendIfEnabled(features, 'TOGGLE_CODE', nodes, {
        code_block: {
            attrs: {dir: {default: ''}},
            reparseInView: true,
            content: 'text*',
            marks: '',
            group: 'block',
            code: true,
            defining: true,
            parseDOM: [
                {
                    tag: 'pre',
                    preserveWhitespace: 'full',
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                const attrs = withoutEmptyAttrs({
                    ...node.attrs,
                    class: 'prettyprint linenums',
                });
                return ['pre', attrs, 0];
            },
        },
    });
    extendIfEnabled(features, MATH_FEATURES, nodes, {
        math_inline: {
            group: 'inline',
            attrs: {'data-ud-math-type': {default: ''}},
            content: 'text*',
            inline: true,
            atom: true,
            parseDOM: [
                {
                    tag: 'span',
                    getAttrs(dom) {
                        return dom.getAttribute('data-ud-math-type') === 'inline' ? {} : false;
                    },
                },
            ],
            toDOM() {
                return ['span', {'data-ud-math-type': 'inline'}, 0];
            },
        },
        math_block: {
            group: 'block',
            attrs: {'data-ud-math-type': {default: ''}},
            content: 'text*',
            atom: true,
            code: true,
            parseDOM: [
                {
                    tag: 'div',
                    getAttrs(dom) {
                        return dom.getAttribute('data-ud-math-type') === 'block' ? {} : false;
                    },
                },
            ],
            toDOM() {
                return ['div', {'data-ud-math-type': 'block'}, 0];
            },
        },
    });
    return nodes;
}

/**
 * This is a minimal configuration for a schema that only supports text. Technically, a text-only
 * schema can be even simpler, as shown in https://prosemirror.net/examples/schema/, but
 * we need to enable paragraphs so that Enter key can be used to create newlines.
 */
function buildTextOnlyNodes() {
    return {
        doc: {
            content: 'block+',
        },
        paragraph: {
            attrs: {dir: {default: ''}},

            // Note: reparseInView is an experimental ProseMirror feature,
            // requested by us in https://github.com/ProseMirror/prosemirror/issues/825.
            // There exist browser extensions and keyboard shortcuts that change text direction,
            // which is convenient when typing in rtl languages such as Arabic.
            //
            // https://www.geeklord.com/2012/06/28/switch-text-direction-from-ltr-to-rtl-and-vice-versa-in-google-chrome/
            // > Press [Right CTRL] + [Right Shift] and the text direction will become RTL.
            // > You can press [Left CTRL] + [Left Shift] keys together to switch it back to LTR.
            // > https://chrome.google.com/webstore/detail/switch-direction/fldkjfjmcadcklboajlnclnfjpdopcce
            //
            // These work by modifying the `direction` style in the DOM. We want to update the
            // corresponding ProseMirror node attrs when these DOM changes happen. Hence, we set
            // `reparseInView: true` on all nodes.
            reparseInView: true,

            content: 'inline*',
            group: 'block',
            parseDOM: [
                {
                    // Match <p style="white-space:pre">. This is used as a fallback when code is
                    // copy-pasted from an IDE but the rich text editor has code blocks disabled.
                    // See transformPastedHTML in ./helpers.js.
                    tag: 'p',
                    preserveWhitespace: 'full',
                    getAttrs(dom) {
                        if ((dom.style.whiteSpace || '').toLowerCase() !== 'pre') {
                            return false;
                        }
                        return {dir: parseTextDirection(dom)};
                    },
                },
                {
                    // Match standard <p>. This rule and the above rule are mutually exclusive.
                    tag: 'p',
                    getAttrs(dom) {
                        if ((dom.style.whiteSpace || '').toLowerCase() === 'pre') {
                            return false;
                        }
                        return {dir: parseTextDirection(dom)};
                    },
                },

                // Parse top-level <br> as <p></p>.
                {
                    tag: 'br',
                    context: 'doc/',
                    getAttrs(dom) {
                        return {dir: parseTextDirection(dom)};
                    },
                },
            ],
            toDOM(node) {
                return ['p', withoutEmptyAttrs(node.attrs), 0];
            },
        },
        text: {
            group: 'inline',
        },
    };
}

function extendIfEnabled(featureSet, featureStringOrSubset, targetObj, ...sourceObjs) {
    if (hasAllFeatures(featureSet, featureStringOrSubset)) {
        Object.assign(targetObj, ...sourceObjs);
    }
}

function isEmptyLine(br) {
    // Returns true if the <br> is the only child of a <p>.
    const parent = br.parentNode;
    return !!(
        parent &&
        parent.tagName &&
        parent.tagName.toLowerCase() === 'p' &&
        parent.childNodes.length === 1
    );
}

function withoutEmptyAttrs(attrs) {
    Object.keys(attrs).forEach((attr) => {
        if (attrs[attr] === '') {
            delete attrs[attr];
        }
    });
    return attrs;
}
