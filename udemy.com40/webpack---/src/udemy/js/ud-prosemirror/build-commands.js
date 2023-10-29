import {
    chainCommands,
    exitCode,
    lift,
    setBlockType,
    toggleMark,
    wrapIn,
} from 'prosemirror-commands';
import {undo, redo} from 'prosemirror-history';
import {Fragment, Slice} from 'prosemirror-model';
import {liftListItem, sinkListItem, splitListItem, wrapInList} from 'prosemirror-schema-list';
import {AllSelection} from 'prosemirror-state';

import {EMPTY_DOC_SIZE} from 'base-components/ungraduated/form/rich-text-editor/constants';

import {
    getTextWithNormalizedNewlines,
    getAnchorSelectionRange,
    getCodeBlockRange,
    isMarkActive,
    isSelectionInCodeBlock,
    parseImageEditor,
    selectBetween,
} from './helpers';

/**
 * Returns a map of (feature, command) pairs.
 * The map should only contain commands for enabled features.
 *
 * http://prosemirror.net/docs/ref/#commands
 * "A command function takes an editor state and optionally a dispatch function that it can
 * use to dispatch a transaction. It should return a boolean that indicates whether it could
 * perform any action. When no dispatch callback is passed, the command should do a 'dry run',
 * determining whether it is applicable, but not actually doing anything."
 *
 * http://prosemirror.net/docs/ref/#keymap
 * The command actually accepts the EditorView as a third argument,
 * but in most cases it isn't needed.
 * "Note that the view argument isn't part of the command protocol, but can be used as an
 * escape hatch if a binding needs to directly interact with the UI."
 *
 * Examples:
 * https://github.com/ProseMirror/prosemirror-commands/blob/1.0.5/src/commands.js
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/1.0.1/src/menu.js
 *
 * @param features: a Set of enabled features
 * @param schema: a ProseMirror Schema
 * @param model: a RichTextEditorModel
 */
export default function buildCommands(features, schema, model) {
    const {marks, nodes} = schema;

    const toggleCodeCommand = toggleCode(toggleMark(marks.code));
    const setParagraphCommand = setParagraph(setBlockType(nodes.paragraph), toggleCodeCommand);
    const wrapBulletListCommand = wrapInList(nodes.bullet_list);
    const wrapOrderedListCommand = wrapInList(nodes.ordered_list);
    const liftListItemCommand = liftListItem(nodes.list_item);

    const commands = {};
    Object.entries({
        // BASE_WYSIWYG_FEATURES
        UNDO: undo,
        REDO: redo,
        UNDO_FORMAT: undoFormat(),
        ADD_HARD_BREAK: addHardBreak(),
        ADD_NON_BREAKING_SPACE: addNonBreakingSpace(),
        TOGGLE_STRONG: toggleMark(marks.strong),
        TOGGLE_EM: toggleMark(marks.em),

        // BLOCK_FORMAT_FEATURES
        SET_PARAGRAPH: setParagraphCommand,
        TOGGLE_BLOCKQUOTE: toggleBlockquote(nodes.blockquote),
        TOGGLE_HEADING: toggle(setBlockType(nodes.heading), setParagraphCommand),

        // ANCHOR_FEATURES
        PROMPT_ANCHOR: promptAnchor(model),
        ADD_ANCHOR: addAnchor(model),
        UNDO_ANCHOR: undoAnchor(model),

        // IMAGE_FEATURES
        PROMPT_IMAGE_UPLOAD: promptImageUpload(model),
        PROMPT_IMAGE_EDIT: promptImageEdit(model),
        ADD_IMAGE: addImage(model),
        EDIT_IMAGE: editImage(model),
        CLICK_IMAGE: clickImage(model),
        RESIZE_IMAGE: resizeImage(model),
        DELETE_FIGURE: deleteFigure(),
        DELETE_IMAGE: deleteImage(model),
        EXIT_FIGURE: exitFigure(),
        ARROW_UP_NEAR_IMAGE: moveCursorNearImage('ArrowUp'),
        ARROW_LEFT_NEAR_IMAGE: moveCursorNearImage('ArrowLeft'),
        ARROW_DOWN_NEAR_IMAGE: moveCursorNearImage('ArrowDown'),
        ARROW_RIGHT_NEAR_IMAGE: moveCursorNearImage('ArrowRight'),

        // LIST_FEATURES
        WRAP_ORDERED_LIST: wrapOrderedListCommand,
        TOGGLE_ORDERED_LIST: toggleList(
            nodes.ordered_list,
            wrapOrderedListCommand,
            liftNearestListItem(liftListItemCommand, nodes.ordered_list),
        ),
        WRAP_BULLET_LIST: wrapBulletListCommand,
        TOGGLE_BULLET_LIST: toggleList(
            nodes.bullet_list,
            wrapBulletListCommand,
            liftNearestListItem(liftListItemCommand, nodes.bullet_list),
        ),
        LIFT_LIST_ITEM: liftListItemCommand,
        SINK_LIST_ITEM: sinkListItem(nodes.list_item),
        SPLIT_LIST_ITEM: splitListItem(nodes.list_item),

        // CODE_FEATURES
        TOGGLE_CODE: toggleCodeCommand,
        CONVERT_TAB_TO_SPACES: convertTabToSpaces(),
        EXIT_FIRST_BLOCK: exitFirstBlock(),
        EXIT_LAST_BLOCK: exitLastBlock(),

        // MATH_FEATURES
        PROMPT_MATH_INSERT: promptMathInsert(model),
        PROMPT_MATH_EDIT: promptMathEdit(model),
        ADD_MATH: addMath(model),
        CLICK_MATH: clickMath(model),

        TOGGLE_HTML_MODE: toggleHTMLMode(model),
    }).forEach(([feature, command]) => {
        if (features.has(feature)) {
            commands[feature] = command;
        }
    });

    return commands;
}

function toggle(doToggle, undoToggle) {
    return (state, dispatch, view) => {
        const canDoToggle = doToggle(state, dispatch, view);
        if (canDoToggle) {
            return true;
        }
        return undoToggle(state, dispatch, view);
    };
}

function toggleList(listType, wrapCommand, liftCommand) {
    // We prefer lift over wrap when multiple nodes are selected because otherwise
    // wrap creates new lists indefinitely rather than undoing the existing list.
    // We prefer wrap over lift otherwise because it allows us to create bullet lists inside
    // ordered lists.
    const toggleWrapFirst = toggle(wrapCommand, liftCommand);
    const toggleLiftFirst = toggle(liftCommand, wrapCommand);
    return (state, dispatch, view) => {
        const ref = state.selection;
        let childCount = 0;
        if (ref.from < ref.to) {
            state.doc.nodesBetween(ref.from, ref.to, () => {
                childCount += 1;
                // We only care whether there are multiple nodes selected, so we can stop
                // looking after we've found at least two nodes.
                return childCount <= 1;
            });
        }
        if (childCount > 1) {
            return toggleLiftFirst(state, dispatch, view);
        }
        return toggleWrapFirst(state, dispatch, view);
    };
}

/**
 * This implements the behavior of `document.execCommand('removeFormat');` on Chrome.
 */
function undoFormat() {
    const markNames = ['strong', 'em', 'code'];
    return (state, dispatch) => {
        if (dispatch) {
            const ref = state.selection;
            let tr = state.tr;
            markNames.forEach((markName) => {
                const markType = state.schema.marks[markName];
                if (markType) {
                    tr = tr.removeMark(ref.from, ref.to, markType);
                }
            });
            dispatch(tr);
        }
        return true;
    };
}

function changeAllSelectionToTextSelection(state, dispatch) {
    const ref = state.selection;
    let $from = ref.$from;
    let $to = ref.$to;
    if (ref instanceof AllSelection && state.doc.content.size > EMPTY_DOC_SIZE) {
        // blockRange doesn't work with AllSelection, but it does on a TextSelection
        // that includes the entire doc.
        $from = state.doc.resolve(1);
        $to = state.doc.resolve(state.doc.content.size - 1);
        if (dispatch) {
            dispatch(selectBetween(state.tr, state.doc, $from.pos, $to.pos));
        }
        return true;
    }
    return false;
}

function setParagraph(setBlockTypeParagraphCommand, toggleCodeCommand) {
    return (state, dispatch, view) => {
        const blockquoteType = state.schema.nodes.blockquote;
        const codeBlockType = state.schema.nodes.code_block;
        if (changeAllSelectionToTextSelection(state, dispatch)) {
            state = view.state;
        }
        const ref = state.selection;

        // If blockquotes are enabled and the selected text is inside a blockquote,
        // remove the blockquote.
        if (blockquoteType) {
            const inBlockquote = !!ref.$from.blockRange(ref.$to, (node) => {
                return node.type === blockquoteType;
            });
            if (inBlockquote) {
                const canLiftFromBlockquote = lift(state, dispatch);
                if (canLiftFromBlockquote) {
                    state = view.state;
                }
            }
        }

        // If code blocks are enabled and the selected text is inside a code block,
        // remove the code block.
        if (codeBlockType) {
            const codeBlockRange = getCodeBlockRange(state.doc, ref);
            if (codeBlockRange) {
                if (dispatch) {
                    const codeBlockEndPos = codeBlockRange.pos + codeBlockRange.node.nodeSize - 1;
                    dispatch(
                        selectBetween(state.tr, state.doc, codeBlockRange.pos, codeBlockEndPos),
                    );
                    state = view.state;
                }
                const canUndoCodeBlock = toggleCodeCommand(state, dispatch, view);
                if (canUndoCodeBlock) {
                    state = view.state;
                }
            }
        }

        return setBlockTypeParagraphCommand(state, dispatch);
    };
}

function toggleBlockquote(blockquoteType) {
    const wrapInBlockquoteCommand = wrapIn(blockquoteType);
    return (state, dispatch, view) => {
        if (changeAllSelectionToTextSelection(state, dispatch)) {
            state = view.state;
        }
        const ref = state.selection;
        const inBlockquote = !!ref.$from.blockRange(ref.$to, (node) => {
            return node.type === blockquoteType;
        });
        if (inBlockquote) {
            return lift(state, dispatch);
        }
        return wrapInBlockquoteCommand(state, dispatch);
    };
}

function addHardBreak() {
    return chainCommands(exitCode, (state, dispatch) => {
        if (dispatch) {
            const br = state.schema.nodes.hard_break.create();
            dispatch(state.tr.replaceSelectionWith(br));
        }
        return true;
    });
}

function addNonBreakingSpace() {
    return (state, dispatch) => {
        if (dispatch) {
            dispatch(state.tr.insertText('\xa0'));
        }
        return true;
    };
}

function promptAnchor(model) {
    return (state, dispatch) => {
        if (dispatch) {
            if (model.anchorForm.isEditing) {
                // If editing an anchor, select the anchor text so that the
                // addAnchor command can replace the text.
                const range = getAnchorSelectionRange(state);
                dispatch(selectBetween(state.tr, state.doc, range.from, range.to));
            }
            model.openAnchorModal(state);
        }
        return true;
    };
}

function addAnchor(model) {
    return (state, dispatch) => {
        const form = model.anchorForm;
        const isValid = form.isValid({commit: !!dispatch});
        if (!isValid) {
            return false;
        }
        if (dispatch) {
            const anchorMarkType = state.schema.marks.link;
            const marks = [anchorMarkType.create({href: form.data.href})];
            Object.values(state.schema.marks)
                .filter((markType) => {
                    return markType !== anchorMarkType && isMarkActive(state, markType);
                })
                .forEach((markType) => {
                    marks.push(markType.create());
                });
            const anchor = state.schema.text(form.data.text, marks);
            dispatch(state.tr.replaceSelectionWith(anchor, false));
            model.closeModal();
        }
        return true;
    };
}

function undoAnchor(model) {
    return (state, dispatch) => {
        if (dispatch) {
            const range = getAnchorSelectionRange(state);
            const anchorType = state.schema.marks.link;
            dispatch(state.tr.removeMark(range.from, range.to, anchorType));
            model.hideAnchorTooltip();
        }
        return true;
    };
}

/**
 * The default liftListItem works by finding an ancestor list node which includes the selection.
 * This doesn't work in some cases, most notably when we select all.
 * This command tries to handle these cases by retrying the default liftListItem on the nearest
 * list node contained in the selection.
 */
function liftNearestListItem(liftListItem, listNodeType) {
    return (state, dispatch) => {
        const canLift = liftListItem(state, dispatch);
        if (canLift) {
            return true;
        }
        const ref = state.selection;
        let firstList = null;
        let liStart = null;
        let liEnd = null;
        state.doc.nodesBetween(ref.from, ref.to, (node, pos) => {
            if (node.type === listNodeType && !firstList) {
                // Found the first list in the selection.
                firstList = node;

                // In order for the lift command to work, we need to select the content inside
                // the list, rather than the list itself, hence the "+ 1" when setting `liStart`.
                liStart = pos + 1;
                liEnd = pos + firstList.content.size;
            }
            // Keep looking until we've found the first list.
            return !firstList;
        });

        if (firstList && liStart < liEnd) {
            // We found a non-empty list. Retry the lift command.
            state = state.apply(selectBetween(state.tr, state.doc, liStart, liEnd));
            return liftListItem(state, dispatch);
        }
        // We didn't find a list. Lift is not possible.
        return false;
    };
}

function promptImageUpload(model) {
    return (state, dispatch) => {
        if (dispatch) {
            model.openImageUploadModal(state);
        }
        return true;
    };
}

function promptImageEdit(model) {
    return (state, dispatch) => {
        if (dispatch) {
            model.openImageEditModal(state);
        }
        return true;
    };
}

function addImage(model) {
    return (state, dispatch) => {
        if (dispatch) {
            const figureType = state.schema.nodes.figure;
            const imageType = state.schema.nodes.image;
            const uploader = model.imageUploader;
            const figures = [];

            // We allow multiple files to be uploaded at once, so it's possible some uploads
            // succeeded while others failed. We add images for the successful uploads,
            // i.e. files that have urls, and show an error message for the failed uploads.
            uploader.files
                .filter((file) => !!file.url)
                .forEach((file) => {
                    const image = imageType.createAndFill({
                        src: file.url,
                    });
                    const figure = figureType.create({}, [image], []);
                    figures.push(figure);
                });

            const slice = new Slice(Fragment.from(figures), 0, 0);
            dispatch(state.tr.replaceSelection(slice));
            uploader.resetFiles();
            if (!uploader.hasError) {
                model.closeModal();
            }
        }
        return true;
    };
}

function editImage(model) {
    function updateImageAttrs(schema, image, form) {
        const newImageMarks = [];
        if (form.data.href) {
            newImageMarks.push(schema.mark(schema.marks.link, {href: form.data.href}));
        }
        return schema.nodes.image.createAndFill(
            {
                ...image.attrs,
                alt: form.data.alt,
            },
            image.content,
            newImageMarks,
        );
    }
    return (state, dispatch) => {
        const imageEditorModel = model.activeImageEditor;
        if (!imageEditorModel) {
            return false;
        }
        const form = model.imageEditForm;
        const isValid = form.isValid({commit: !!dispatch});
        if (!isValid) {
            return false;
        }
        if (dispatch) {
            let tr = state.tr;
            const pos = imageEditorModel.getPos();
            const {figure, image, caption, captionPos} = parseImageEditor(state, pos);
            const endPos = pos + image.nodeSize;

            // Part 1: Update the image alt and href.
            const newImage = updateImageAttrs(state.schema, image, form);
            tr = tr.replaceWith(pos, endPos, newImage);

            // Part 2: Update the caption text.
            let cursorPos;
            if (form.data.caption) {
                // Caption text exists.
                const figcaptionMark = state.schema.mark(state.schema.marks.figcaption);
                const newCaption = state.schema.text(form.data.caption, [figcaptionMark]);
                if (figure) {
                    // The image is already in a figure.
                    if (caption) {
                        // There's already a caption. Replace it with the new caption.
                        tr = tr.replaceWith(captionPos, captionPos + caption.nodeSize, newCaption);
                    } else {
                        // There's no existing caption. Insert the new caption after the image.
                        tr = tr.insert(endPos, newCaption);
                    }
                    // Position the cursor at the end of the caption text.
                    cursorPos = endPos + newCaption.nodeSize;
                } else {
                    // The image is not in a figure. The schema only allows caption inside
                    // figure. Hence, create a figure to wrap the image and the caption.
                    const content = [newImage, newCaption];
                    const newFigure = state.schema.nodes.figure.create({}, content, []);
                    tr = tr.replaceWith(pos, endPos, newFigure);

                    // Position the cursor at the end of the caption text.
                    // The doc increases by 2 due to inserting the figure.
                    cursorPos = endPos + newCaption.nodeSize + 2;
                }

                tr = selectBetween(tr, tr.doc, cursorPos, cursorPos);
            } else if (caption) {
                // There's no caption text. Delete existing caption text if it exists.
                tr = tr.delete(captionPos, captionPos + caption.nodeSize);
                // Position the cursor after the image.
                cursorPos = endPos;

                tr = selectBetween(tr, tr.doc, cursorPos, cursorPos);
            } else {
                // Position the cursor after the image.
                cursorPos = endPos;

                tr = selectBetween(tr, tr.doc, cursorPos, cursorPos);
            }

            dispatch(tr);
            model.closeModal();
        }
        return true;
    };
}

function resizeImage(model) {
    return (state, dispatch) => {
        const imageEditorModel = model.activeImageEditor;
        if (!imageEditorModel) {
            return false;
        }
        const form = model.imageEditForm;
        const isValid = form.isValid({commit: !!dispatch});
        if (!isValid) {
            return false;
        }
        if (dispatch) {
            const pos = imageEditorModel.getPos();
            const image = state.doc.nodeAt(pos);
            const endPos = pos + image.nodeSize;
            const newImage = state.schema.nodes.image.createAndFill(
                {
                    ...image.attrs,
                    width: model.imageEditForm.data.width,
                    height: model.imageEditForm.data.height,
                },
                image.content,
                image.marks,
            );
            let tr = state.tr.replaceWith(pos, endPos, newImage);
            tr = selectBetween(tr, tr.doc, endPos, endPos);
            dispatch(tr);
        }
        return true;
    };
}

function clickImage(model) {
    return (state, dispatch) => {
        const imageEditorModel = model.activeImageEditor;
        if (!imageEditorModel) {
            return false;
        }
        if (dispatch) {
            // Move the cursor after the image so that it can be deleted easily.
            const pos = imageEditorModel.getPos();
            const endPos = pos + 1;
            dispatch(selectBetween(state.tr, state.doc, endPos, endPos));
        }
        return true;
    };
}

function deleteFigure() {
    return (state, dispatch) => {
        // Replace <figure> with <p> if it doesn't contain any <img>.
        // This happens e.g. when the user uses hotkeys to delete an <img>.
        const figureType = state.schema.nodes.figure;
        const imageType = state.schema.nodes.image;
        const ref = state.selection;
        const parent = ref.$from.parent;
        if (parent.type === figureType && parent === ref.$to.parent) {
            // We're inside a <figure>.
            let hasImage = false;
            parent.descendants((node) => {
                if (node.type === imageType) {
                    hasImage = true;
                }
                return !hasImage;
            });
            if (!hasImage) {
                // The <figure> does not contain any <img>.
                const parentPos = ref.$from.pos - ref.$from.parentOffset - 1;
                const parentEndPos = parentPos + parent.nodeSize;
                if (dispatch) {
                    const paragraphType = state.schema.nodes.paragraph;
                    const figcaptionType = state.schema.marks.figcaption;
                    let tr = state.tr.setBlockType(parentPos, parentEndPos, paragraphType, {});
                    tr = tr.removeMark(parentPos, parentEndPos, figcaptionType);
                    dispatch(tr);
                }
                return true;
            }
        }
        return false;
    };
}

function deleteImage(model) {
    return (state, dispatch) => {
        const imageEditorModel = model.activeImageEditor;
        if (!imageEditorModel) {
            return false;
        }
        if (dispatch) {
            const pos = imageEditorModel.getPos();
            const image = state.doc.nodeAt(pos);
            const endPos = pos + image.nodeSize;
            const $pos = state.doc.resolve(pos);
            const parent = $pos.parent;
            let tr = state.tr;

            // Set the cursor to right before where the deleted node used to be.
            let cursorPos;

            if (parent.type === state.schema.nodes.figure) {
                // The <img> is inside a <figure />. Delete the <figure />.
                const parentPos = pos - $pos.parentOffset;
                const parentEndPos = parentPos + parent.content.size;
                tr = tr.deleteRange(parentPos, parentEndPos);
                cursorPos = parentPos - 1;
            } else {
                // The image is not in a <figure />. This can occur if the image is
                // copy-pasted into the editor, rather than inserted via the image uploader.
                tr = tr.deleteRange(pos, endPos);
                cursorPos = pos - 1;
            }

            dispatch(selectBetween(tr, tr.doc, cursorPos, cursorPos));
            model.closeModal();
        }
        return true;
    };
}

/**
 * Exits <figure> tag via Enter. There are two cases:
 * 1. The cursor is at the beginning of the <figure>. By default, Enter doesn't do anything in
 *    this case. This command inserts an empty paragraph above the <figure>.
 * 2. The cursor is somewhere in the last node of the <figure>. By default, Enter somehow
 *    cuts the content after the cursor. This command moves the content after the cursor
 *    to a paragraph after the <figure>.
 */
function exitFigure() {
    return (state, dispatch) => {
        const $cursor = state.selection.$cursor;
        const figureType = state.schema.nodes.figure;
        if (!$cursor || !$cursor.parent || $cursor.parent.type !== figureType) {
            return false;
        }
        // The cursor is inside a <figure>.
        const imageType = state.schema.nodes.image;
        const figcaptionType = state.schema.marks.figcaption;
        const figure = $cursor.parent;
        const figurePos = $cursor.pos - $cursor.parentOffset - 1;
        const figureEndPos = figurePos + figure.nodeSize;
        let $imagePos = null;
        state.doc.nodesBetween(figurePos, figureEndPos, (node, pos) => {
            if (node.type === imageType) {
                $imagePos = state.doc.resolve(pos);
            }
            return !$imagePos;
        });
        if (!$imagePos) {
            return false;
        }
        const nodeBeforeImageEndPos = $imagePos.pos;
        const nodeAfterImagePos = $imagePos.pos + $imagePos.nodeAfter.nodeSize;
        let sliceStart, sliceEnd, insertPos, newCursorPos;
        if (figurePos <= $cursor.pos && $cursor.pos <= nodeBeforeImageEndPos) {
            // The cursor is before the <img>. Move the stuff before the cursor
            // to a new paragraph before the <figure>. Position the cursor at the end of
            // the new paragraph.
            sliceStart = figurePos + 1;
            sliceEnd = $cursor.pos;
            insertPos = figurePos;
            newCursorPos = insertPos + (sliceEnd - sliceStart) + 1;
        } else if (nodeAfterImagePos <= $cursor.pos && $cursor.pos <= figureEndPos) {
            // The cursor is after the <img>. Move the stuff after the cursor
            // to a new paragraph after the <figure>. Position the cursor at the start of
            // the new paragraph.
            sliceStart = $cursor.pos;
            sliceEnd = figureEndPos - 1;
            insertPos = $cursor.pos + 1;
            newCursorPos = insertPos;
        } else {
            return false;
        }
        if (dispatch) {
            const fragment = state.doc.slice(sliceStart, sliceEnd);
            const paragraph = state.schema.nodes.paragraph.create({}, fragment.content);
            let tr = state.tr.delete(sliceStart, sliceEnd);
            tr = tr.insert(insertPos, paragraph);
            tr = tr.removeMark(insertPos, insertPos + paragraph.nodeSize, figcaptionType);
            tr = selectBetween(tr, tr.doc, newCursorPos, newCursorPos);
            dispatch(tr);
        }
        return true;
    };
}

/**
 * By default, arrow key behavior is determined by the browser's implementation of contenteditable.
 * There are some glitches in the browser implementation when the cursor is right before or right
 * after an <img>, due to the fact that ProseMirror makes it contenteditable="false".
 * - (Chrome/Mac) Cursor before <img> -> ArrowDown -> page scrolls down
 * - (Chrome/Mac) Cursor before <img> -> Cmd+ArrowRight -> Cmd+ArrowLeft -> ArrowUp ->
 *   page scrolls up
 * This command attempts to fix such glitches.
 * By returning true, these commands in effect call event.preventDefault().
 * http://prosemirror.net/docs/ref/#view.EditorProps
 *     The various event-handling functions may all return true to indicate that they handled
 *     the given event. The view will then take care to call preventDefault on the event,
 *     except with handleDOMEvents, where the handler itself is responsible for that.
 * @param arrowKey: one of 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
 */
function moveCursorNearImage(arrowKey) {
    return (state, dispatch) => {
        const $cursor = state.selection.$cursor;
        const imageType = state.schema.nodes.image;
        if (!$cursor) {
            return false;
        }
        const {pos, parent, parentOffset, nodeBefore, nodeAfter} = $cursor;
        const isCursorBeforeImage = !!nodeAfter && nodeAfter.type === imageType;
        const isCursorAfterImage = !!nodeBefore && nodeBefore.type === imageType;
        if (!isCursorBeforeImage && !isCursorAfterImage) {
            return false;
        }
        const $parentPos = state.doc.resolve(Math.max(pos - parentOffset - 1, 0));
        let newPos = null;
        if (arrowKey === 'ArrowUp') {
            if ($parentPos.nodeBefore) {
                newPos = $parentPos.pos - 1; // End of the parent's previous sibling.
            } else if (nodeBefore) {
                newPos = $parentPos.pos; // Start of the parent.
            }
        } else if (isCursorBeforeImage && arrowKey === 'ArrowLeft') {
            if (nodeBefore) {
                newPos = pos - 1; // Left by one character.
            } else if ($parentPos.nodeBefore) {
                newPos = $parentPos.pos - 1; // End of the parent's previous sibling.
            }
        } else if (isCursorAfterImage && arrowKey === 'ArrowLeft') {
            newPos = pos - 1; // Before the <img>.
        } else if (arrowKey === 'ArrowDown') {
            if ($parentPos.nodeAfter) {
                newPos = $parentPos.pos + parent.nodeSize; // Start of the parent's next sibling.
            }
        } else if (isCursorAfterImage && arrowKey === 'ArrowRight') {
            if (nodeAfter) {
                newPos = pos + 1; // Right by one character.
            } else if ($parentPos.nodeAfter) {
                newPos = $parentPos.pos + parent.nodeSize; // Start of the parent's next sibling.
            }
        } else if (isCursorBeforeImage && arrowKey === 'ArrowRight') {
            newPos = pos + 1; // After the <img>.
        }
        if (dispatch && newPos !== null && newPos !== pos) {
            dispatch(selectBetween(state.tr, state.doc, newPos, newPos));
        }
        return true;
    };
}

function convertTabToSpaces() {
    return (state, dispatch) => {
        const ref = state.selection;
        if (isSelectionInCodeBlock(state.doc, ref) && dispatch) {
            dispatch(state.tr.insertText('    '));
            return true;
        }
        return false;
    };
}

/**
 * "Block" refers to code block or blockquote in this context.
 * If the cursor is at the start of a block, and that block is at the start of the doc,
 * exit it by creating a paragraph above it.
 */
function exitFirstBlock() {
    return (state, dispatch) => {
        const blockTypes = [state.schema.nodes.blockquote, state.schema.nodes.code_block];
        const $cursor = state.selection.$cursor;
        const firstChild = state.doc.firstChild;
        if (
            $cursor &&
            $cursor.pos - $cursor.depth === 0 &&
            firstChild &&
            blockTypes.includes(firstChild.type)
        ) {
            if (dispatch) {
                const insertPos = 0;
                const paragraph = state.schema.nodes.paragraph.create();
                const tr = state.tr.insert(insertPos, paragraph);
                dispatch(selectBetween(tr, tr.doc, insertPos + 1, insertPos + 1));
            }
            return true;
        }
        return false;
    };
}

/**
 * "Block" refers to code block or blockquote in this context.
 * If the cursor is at the end of a block, and that block is at the end of the doc,
 * exit it by creating a paragraph below it.
 */
function exitLastBlock() {
    return (state, dispatch) => {
        const blockTypes = [state.schema.nodes.blockquote, state.schema.nodes.code_block];
        const $cursor = state.selection.$cursor;
        const lastChild = state.doc.lastChild;
        const endOfDoc = state.doc.content.size;
        if (
            $cursor &&
            $cursor.pos + $cursor.depth === endOfDoc &&
            lastChild &&
            blockTypes.includes(lastChild.type)
        ) {
            if (dispatch) {
                const insertPos = endOfDoc;
                const paragraph = state.schema.nodes.paragraph.create();
                const tr = state.tr.insert(insertPos, paragraph);
                dispatch(selectBetween(tr, tr.doc, insertPos + 1, insertPos + 1));
            }
            return true;
        }
        return false;
    };
}

/**
 * ProseMirror has toggleMark to toggle code mark (<code />), and setBlockType to
 * set code block node (<pre />). This command merges the two. If one node is selected,
 * it toggles code mark. If multiple nodes are selected, it merges them into a single code
 * block node (as opposed to setBlockType, which applies to each node separately).
 */
function toggleCode(toggleCodeMark) {
    return (state, dispatch, view) => {
        const ref = state.selection;
        const codeBlockType = state.schema.nodes.code_block;
        const inCodeBlock = isSelectionInCodeBlock(state.doc, ref);
        const slice = state.doc.slice(ref.from, ref.to);
        const text = getTextWithNormalizedNewlines(slice.content, state.schema);
        const lines = text.split('\n');
        if (!inCodeBlock && lines.length <= 1) {
            // If we're not in a code block node, and there is only one line,
            // just toggle code marks.
            const isToggleCodeMarkPossible = toggleCodeMark(state, dispatch, view);
            if (isToggleCodeMarkPossible && dispatch) {
                // Instructors think they're stuck when <code> is at the end of
                // the doc, as it's not obvious <code> can be toggled by clicking the menu button.
                // Work around this by automatically adding a space at the end.
                const wasDocEmpty = state.doc.content.size === EMPTY_DOC_SIZE;
                state = view.state;
                const docEndPos = state.doc.content.size - 1;
                if (
                    !wasDocEmpty &&
                    ref.to >= docEndPos &&
                    isMarkActive(state, state.schema.marks.code)
                ) {
                    dispatch(state.tr.insert(docEndPos, state.schema.text(' ', [])));
                }
            }
            return isToggleCodeMarkPossible;
        }
        const paragraphType = state.schema.nodes.paragraph;
        const brType = state.schema.nodes.hard_break;
        let content;
        if (inCodeBlock) {
            // If we're in a code block node, undo it by replacing each line with a paragraph.
            content = lines.map((text) => {
                const textNode = text ? state.schema.text(text) : null;
                return paragraphType.create({}, textNode);
            });
        } else {
            // Otherwise, we're outside of a code block node, and multiple nodes are selected.
            // Merge them into a single code block.
            const textNode = text ? state.schema.text(text) : null;
            content = [codeBlockType.create({}, textNode)];
        }
        const contentSize = content.reduce((acc, val) => acc + val.content.size, 0);
        if (contentSize === 0) {
            return false;
        }
        if (dispatch) {
            let tr = state.tr.replaceWith(ref.from, ref.to, content);

            // The replaceWith transaction creates empty space before and after the content.
            // We remove these empty spaces.
            const emptyBlockRanges = [];
            let searchState = 'BEFORE_CONTENT';
            tr.doc.nodesBetween(tr.mapping.map(ref.from), tr.mapping.map(ref.to), (node, pos) => {
                if (searchState === 'BEFORE_CONTENT' && node === content[0]) {
                    searchState = 'IN_CONTENT';
                }
                if (node.isBlock) {
                    if (node.content.size === 0 && searchState !== 'IN_CONTENT') {
                        // There's an empty <p> either before or after the content.
                        emptyBlockRanges.push([pos, pos + node.nodeSize]);
                    } else if (
                        node.content.size > 0 &&
                        node.firstChild.type === brType &&
                        searchState === 'AFTER_CONTENT'
                    ) {
                        // There's an extra <br> after the content.
                        const brPos = pos + 1;
                        const brEndPos = brPos + node.firstChild.nodeSize;
                        emptyBlockRanges.push([brPos, brEndPos]);
                    } else if (
                        node.content.size > 0 &&
                        node.lastChild.type === brType &&
                        searchState === 'BEFORE_CONTENT'
                    ) {
                        // There's an extra <br> before the content.
                        const brPos = pos + node.content.size;
                        const brEndPos = brPos + node.lastChild.nodeSize;
                        emptyBlockRanges.push([brPos, brEndPos]);
                    }
                }
                if (searchState === 'IN_CONTENT' && node === content[content.length - 1]) {
                    searchState = 'AFTER_CONTENT';
                }
            });

            // The ranges are reversed so that deleting a range doesn't mess up the positions
            // of the yet-to-be-deleted ranges.
            emptyBlockRanges.reverse().forEach(([rangeStart, rangeEnd]) => {
                tr = tr.deleteRange(rangeStart, rangeEnd);
            });

            // Select the content.
            const newFromPos = tr.mapping.map(ref.from) + 1;
            const newToPos = tr.mapping.map(ref.to) - 1;
            tr = selectBetween(tr, tr.doc, newFromPos, newToPos);

            dispatch(tr);
        }
        return true;
    };
}

function promptMathInsert(model) {
    return (state, dispatch) => {
        if (dispatch) {
            model.mathForm.setMathRepresentation('');
            model.mathForm.setIsInline(false);
            model.mathForm.setIsEditing(false);
            model.openMathModal(state);
        }
        return true;
    };
}

function promptMathEdit(model) {
    return (state, dispatch) => {
        if (dispatch) {
            model.mathForm.setIsEditing(true);
            model.openMathModal(state);
        }
        return true;
    };
}

function addMath(model) {
    return (state, dispatch) => {
        if (dispatch) {
            const activeMathEditor = model.activeMathEditor;
            const {mathRepresentation, isInline} = model.mathForm;
            const mathType = isInline
                ? state.schema.nodes.math_inline
                : state.schema.nodes.math_block;
            const math = mathType.create({}, [state.schema.text(mathRepresentation)], []);
            if (activeMathEditor) {
                const pos = activeMathEditor.getPos();
                const endPos = pos + state.doc.resolve(pos).nodeAfter.nodeSize;
                dispatch(state.tr.replaceWith(pos, endPos, math));
            } else {
                dispatch(state.tr.replaceSelectionWith(math));
            }
            model.closeModal();
        }
        return true;
    };
}

function clickMath(model) {
    return (state, dispatch) => {
        const activeMathEditor = model.activeMathEditor;
        if (!activeMathEditor) {
            return false;
        }
        if (dispatch) {
            // Move the cursor after the math so that it can be deleted easily.
            const pos = activeMathEditor.getPos();
            const endPos = pos + 1;
            dispatch(selectBetween(state.tr, state.doc, endPos, endPos));
        }
        return true;
    };
}

function toggleHTMLMode(model) {
    return (state, dispatch) => {
        if (dispatch) {
            model.toggleHTMLMode();
        }
        return true;
    };
}
