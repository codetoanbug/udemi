import {DOMParser, DOMSerializer, Slice} from 'prosemirror-model';
import {AllSelection, TextSelection} from 'prosemirror-state';

import {EMPTY_DOC_SIZE} from 'base-components/ungraduated/form/rich-text-editor/constants';
import {getDetachedDoc} from 'base-components/ungraduated/form/rich-text-editor/helpers';

function createCustomParser(schema, mode) {
    const parser = DOMParser.fromSchema(schema);

    /**
     * This method is used by ProseMirror to parse copy-pasted HTML.
     * We extend it to implement the equivalent of the
     * { tag: 'br', context: 'doc/' } rule in the schema. That rule only applies when
     * parsing a full document, not a slice.
     */
    parser.parseSlice = function parseSlice(dom, options) {
        const slice = DOMParser.prototype.parseSlice.call(this, dom, options);
        let fragment = slice.content;
        slice.content.forEach((node, offset, index) => {
            if (node.type === schema.nodes.hard_break) {
                const paragraph = schema.nodes.paragraph.create();
                fragment = fragment.replaceChild(index, paragraph);
            }
        });
        return Slice.maxOpen(fragment);
    };

    /**
     * This does the same as the default `clipboardTextParser`,
     * except it preserves newlines in text. A newline becomes <p></p>.
     * https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextParser
     */
    parser.parseClipboardText = function parseClipboardText(text, $context) {
        const dom = getDetachedDoc().createElement('div');
        text.split(/\r\n?|\n/).forEach((block) => {
            const p = getDetachedDoc().createElement('p');
            p.textContent = block;
            dom.appendChild(p);
        });
        return parser.parseSlice(dom, {preserveWhitespace: true, context: $context});
    };

    /**
     * IDEs such as Visual Studio Code and PyCharm paste HTML rather than raw text
     * when syntax highlighting is enabled. This can result in some edge cases:
     * - VSCode pastes <div style="white-space: pre">, which we convert to <pre>.
     * - PyCharm includes <br> inside <pre>, which we normalize as a newline.
     */
    parser.transformPastedHTML = function transformPastedHTML(html) {
        const container = getDetachedDoc().createElement('div');
        container.innerHTML = html;
        if (mode === 'PLAIN_TEXT') {
            // Normalize all newlines. Render each line in a <p>.
            const text = getTextWithNormalizedNewlinesFromDOMNode(container);
            container.innerHTML = text
                .split('\n')
                .map((line) => {
                    const paragraph = getDetachedDoc().createElement('p');
                    paragraph.style.whiteSpace = 'pre';
                    paragraph.textContent = line;
                    return paragraph.outerHTML;
                })
                .join('');
        } else {
            const isCodeEnabled = !!schema.nodes.code_block;
            const replaceWithPre = (domNode, text) => {
                const pre = getDetachedDoc().createElement('pre');
                pre.textContent = text;
                domNode.parentNode.replaceChild(pre, domNode);
            };
            const replaceWithParagraph = (domNode, text) => {
                const parentNode = domNode.parentNode;
                text.split('\n').forEach((line) => {
                    const paragraph = getDetachedDoc().createElement('p');
                    paragraph.style.whiteSpace = 'pre';
                    paragraph.textContent = line;
                    parentNode.insertBefore(paragraph, domNode);
                });
                parentNode.removeChild(domNode);
            };
            Array.from(container.querySelectorAll('pre')).forEach((pre) => {
                // Normalize newlines in <pre>.
                const text = getTextWithNormalizedNewlinesFromDOMNode(pre);
                pre.textContent = text;

                if (!isCodeEnabled) {
                    replaceWithParagraph(pre, text);
                }
            });
            Array.from(container.querySelectorAll('div'))
                .filter((div) => div.style.whiteSpace === 'pre')
                .forEach((div) => {
                    const text = getTextWithNormalizedNewlinesFromDOMNode(div);
                    isCodeEnabled ? replaceWithPre(div, text) : replaceWithParagraph(div, text);
                });
        }
        return container.innerHTML;
    };

    return parser;
}

function createCustomSerializer(schema) {
    const serializer = DOMSerializer.fromSchema(schema);

    serializer.serializeNode = function serializeNode(node, options = {}) {
        if (node.type.name === 'code_block') {
            return DOMSerializer.prototype.serializeNode.call(this, node, {
                ...options,
                skipPreserveWhitespaceHack: true,
            });
        }
        if (node.isText && !options.skipPreserveWhitespaceHack) {
            node = applyHackToPreserveWhitespace(node);
        }
        const dom = DOMSerializer.prototype.serializeNode.call(this, node, options);
        if (node.type.name === 'paragraph' && node.childCount === 0) {
            return applyHackToPreserveEmptyLines(dom);
        }
        return dom;
    };

    return serializer;
}

export class RichTextSerializer {
    constructor(schema, parseOptions) {
        this.fromDOMSerializer = createCustomParser(schema, this.mode);
        this.toDOMSerializer = createCustomSerializer(schema);
        this.parseOptions = parseOptions;
    }

    get mode() {
        return 'RICH_TEXT';
    }

    /**
     * @param html, an HTML string
     * @returns a ProseMirror Node
     */
    toInternalValue(html) {
        const div = getDetachedDoc().createElement('div');
        div.innerHTML = html;
        return this.fromDOMSerializer.parse(div, this.parseOptions);
    }

    /**
     * This is the inverse of `toInternalValue`.
     */
    toText(doc) {
        if (doc.content.size <= EMPTY_DOC_SIZE) {
            return '';
        }
        const fragment = this.toDOMSerializer.serializeFragment(doc.content);
        const div = getDetachedDoc().createElement('div');
        div.appendChild(fragment);
        Array.from(div.querySelectorAll('a[id^="rt-link--"]')).forEach((a) => {
            a.removeAttribute('id');
        });

        return div.innerHTML;
    }
}

export class PlainTextSerializer extends RichTextSerializer {
    get mode() {
        return 'PLAIN_TEXT';
    }

    toText(doc) {
        if (doc.content.size <= EMPTY_DOC_SIZE) {
            return '';
        }
        const fragment = this.toDOMSerializer.serializeFragment(doc.content);
        const lines = [];
        for (let i = 0; i < fragment.childNodes.length; i++) {
            const child = fragment.childNodes[i];
            lines.push(child.textContent);
        }
        return lines.join('\n');
    }
}

export function overrideDoc(view, doc) {
    view.dispatch(view.state.tr.replaceWith(0, view.state.doc.content.size, doc));
    view.dom.scrollTop = view.dom.scrollHeight;
}

export function selectBetween(tr, doc, fromPos, toPos) {
    let selection;
    if (fromPos === 0 && toPos === doc.content.size) {
        selection = new AllSelection(doc);
    } else {
        const $from = doc.resolve(fromPos);
        const $to = fromPos === toPos ? $from : doc.resolve(toPos);
        selection = TextSelection.between($from, $to);
    }
    return tr.setSelection(selection);
}

export function setCursorAndFocus(view, pos = null) {
    if (pos === null) {
        pos = view.state.doc.content.size;
        view.dom.scrollTop = view.dom.scrollHeight;
    }
    view.dispatch(selectBetween(view.state.tr, view.state.doc, pos, pos).scrollIntoView());
    view.focus();
}

export function isMarkActive(state, markType) {
    // https://github.com/ProseMirror/prosemirror-example-setup/blob/1.0.1/src/menu.js#L57
    const ref = state.selection;
    if (ref.empty) {
        // MarkType.prototype.isInSet returns undefined when set is empty.
        return !!markType.isInSet(state.storedMarks || ref.$from.marks());
    }

    // Unlike state.doc.rangeHasMark, which returns whether *some* portion of the range has the
    // specified mark, this returns whether the *entire* portion has the mark.
    let entireRangeHasMark = true;
    let textSelected = false;
    state.doc.nodesBetween(ref.from, ref.to, (node) => {
        if (node.isText) {
            textSelected = true;
            if (!markType.isInSet(node.marks)) {
                entireRangeHasMark = false;
            }
        }
        return entireRangeHasMark;
    });
    return textSelected && entireRangeHasMark;
}

/**
 * Returns the selection range for an anchor.
 * The main difference from simply checking state.selection is that when nothing is selected,
 * the selection defaults to the anchor containing the cursor.
 */
export function getAnchorSelectionRange(state) {
    const ref = state.selection;
    if (ref.empty) {
        const $cursor = ref.$cursor;
        const cursorPos = $cursor.pos;
        const parentFromPos = cursorPos - $cursor.parentOffset;
        const parentToPos = parentFromPos + $cursor.parent.content.size;

        let foundRange = null;
        state.doc.nodesBetween(parentFromPos, parentToPos, (node, pos) => {
            if (state.schema.marks.link.isInSet(node.marks)) {
                const fromPos = pos;
                const toPos = pos + node.nodeSize;
                if (foundRange && foundRange.to === fromPos) {
                    // Found two adjacent nodes that are both in an anchor.
                    // Extend the foundRange.
                    // E.g. <a><strong>test</strong> test</a>
                    foundRange.to = toPos;
                } else if (cursorPos >= fromPos && cursorPos <= toPos) {
                    foundRange = {from: fromPos, to: toPos};
                }
            }
        });

        if (foundRange) {
            return foundRange;
        }
    }
    return {from: ref.from, to: ref.to};
}

/**
 * Parses the selection for anchor marks.
 * Returns whether the selection contains an anchor,
 * and the text and href of the first selected anchor.
 */
export function parseAnchorForm(state, options = {parseFormData: true}) {
    const range = getAnchorSelectionRange(state);
    const hasAnchor = state.doc.rangeHasMark(range.from, range.to, state.schema.marks.link);
    const parsed = {
        text: '',
        href: '',
        hasAnchor,
    };
    if (options.parseFormData) {
        parsed.text = state.doc.textBetween(range.from, range.to);
        if (hasAnchor) {
            let firstAnchor = null;
            state.doc.nodesBetween(range.from, range.to, (node) => {
                if (!firstAnchor) {
                    firstAnchor = node.marks.find((mark) => mark.type === state.schema.marks.link);
                }
                return !firstAnchor;
            });

            if (firstAnchor) {
                parsed.href = firstAnchor.attrs.href || '';
            }
        }
    }
    return parsed;
}

/**
 * Parses the nodes in the image editor.
 * See build-schema.js for the structure of the image editor.
 * Returns the figure, image, and caption, their absolute positions, and the link.
 */
export function parseImageEditor(state, imagePos) {
    const $imagePos = state.doc.resolve(imagePos);
    const image = $imagePos.nodeAfter;
    const link = image.marks.find((mark) => mark.type === state.schema.marks.link);
    const parent = $imagePos.parent;
    const parentPos = imagePos - $imagePos.parentOffset - 1;
    const figure = parent.type === state.schema.nodes.figure ? parent : null;
    const figurePos = figure ? parentPos : null;
    const nextSiblingPos = imagePos + image.nodeSize;
    const nextSibling = state.doc.nodeAt(nextSiblingPos);
    let caption = null;
    let captionPos = null;
    if (nextSibling && nextSibling.isText) {
        const isCaption = nextSibling.marks.some((mark) => {
            return mark.type === state.schema.marks.figcaption;
        });
        if (isCaption) {
            caption = nextSibling;
            captionPos = nextSiblingPos;
        }
    }
    return {
        image,
        imagePos,
        link,
        figure,
        figurePos,
        caption,
        captionPos,
    };
}

export function getCodeBlockRange(doc, selection) {
    let $from = selection.$from;
    let $to = selection.$to;
    if (selection instanceof AllSelection && doc.content.size > EMPTY_DOC_SIZE) {
        // blockRange doesn't work with AllSelection, but it does on a TextSelection
        // that includes the entire doc.
        $from = doc.resolve(1);
        $to = doc.resolve(doc.content.size - 1);
    }
    const range = $from.blockRange($to);
    if (range.$from.parent.type.spec.code) {
        return {
            node: range.$from.parent,
            pos: range.$from.pos - range.$from.parentOffset - 1,
        };
    }
    return null;
}

export function isSelectionInCodeBlock(doc, selection) {
    return !!getCodeBlockRange(doc, selection);
}

/**
 * Returns the text in the given fragment, with newlines normalized, i.e.
 * <br /> is considered a newline.
 */
export function getTextWithNormalizedNewlines(fragment, schema) {
    const texts = [];
    let hasPrecedingBlock = false;
    fragment.descendants((node) => {
        if (node.isBlock && hasPrecedingBlock) {
            texts.push('\n');
        }
        if (node.isBlock) {
            hasPrecedingBlock = true;
        }
        if (node.isText) {
            texts.push(node.text);
        }
        if (node.type === schema.nodes.hard_break) {
            texts.push('\n');
        }
    });
    return texts.join('');
}

/**
 * This is the similar to getTextWithNormalizedNewlines,
 * but instead of parsing a ProseMirror Fragment, it parses a DOM node.
 */
export function getTextWithNormalizedNewlinesFromDOMNode(node) {
    // Replace <br> with newline.
    node.innerHTML = node.innerHTML.replace(/<br\s*\/?>/g, '\n');

    // Assume text in divs are meant to be on their own line, as divs have display: block.
    Array.from(node.querySelectorAll('div'))
        .filter((div) => {
            // Return divs that don't themselves contain divs, and have something after them.
            return !div.querySelector('div') && !!div.nextSibling;
        })
        .forEach((div) => {
            div.textContent = `${div.textContent}\n`;
        });

    return node.textContent;
}

export function parseTextDirection(dom) {
    const dirStyle = (dom.style.direction || '').toLowerCase().replace('!important', '').trim();
    const dirAttr = (dom.dir || '').toLowerCase();
    const dir = dirStyle || dirAttr;
    return dir === 'rtl' ? 'rtl' : '';
}

/**
 * This is a hack to ensure empty lines, normally represented as <p></p>,
 * render with the height of one line of text. It has the same effect as
 * `min-height: <whatever the line height is>`, which we didn't use because rich text may be
 * viewed in emails (e.g. announcement emails), and white-space isn't supported by all email
 * clients: https://www.campaignmonitor.com/css/box-model/min-height/.
 *
 * The hack works by representing empty lines as <p><br></p>.
 * This approach is consistent with that of our previous rich text editor.
 * Note: the hack is applied to a DOM node rather than a ProseMirror node because the schema
 * for HTML mode doesn't define <br />.
 */
export function applyHackToPreserveEmptyLines(emptyParagraphDOMNode) {
    emptyParagraphDOMNode.appendChild(getDetachedDoc().createElement('br'));
    return emptyParagraphDOMNode;
}

/**
 * This is a hack to ensure browsers preserve whitespace. It has the same effect as
 * `white-space: pre-wrap` CSS, which we didn't use because rich text may be viewed in emails
 * (e.g. announcement emails), and white-space isn't supported by all email clients:
 * https://www.campaignmonitor.com/css/text-fonts/white-space/.
 *
 * The hack works by replacing consecutive spaces with alternating regular spaces and non-breaking
 * spaces. This approach is consistent with that of our previous rich text editor. We could use
 * non-breaking spaces everywhere, but it makes the HTML output longer than it has to be.
 */
export function applyHackToPreserveWhitespace(textNode) {
    const NBSP = '\xa0';
    return textNode.withText(
        textNode.textContent.replace(/ +/g, (spaces) => {
            if (spaces.length === 1) {
                return ' ';
            }

            const alternatingNBSPs = [];
            for (let i = 0; i < spaces.length; i++) {
                if (i % 2 === 0) {
                    alternatingNBSPs.push(NBSP);
                } else {
                    alternatingNBSPs.push(' ');
                }
            }
            return alternatingNBSPs.join('');
        }),
    );
}
