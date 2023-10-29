const DO_NOT_NEED_TO_HIDE_TAGS = new Set(['script', 'svg']);

/**
 * When a dialog is shown, we want to keep the focus within the dialog.
 * For screen readers, we do this with `aria-modal="true"` on the dialog.
 * Except, that doesn't work on iOS VoiceOver. We also need to add `aria-hidden="true"`
 * to everything except the dialog. This function takes care of that.
 *
 * @param dialogNode: the DOM node representing the dialog. It should have `role="dialog"`.
 * @param isShown: boolean indicating whether the dialog is shown.
 *
 * Ideally, the dialog is a direct child of document.body, as that minimizes the number
 * of DOM changes this function has to do.
 */
export function toggleDialogForScreenReaders(dialogNode: Element, isShown: boolean) {
    dialogNode.setAttribute('aria-modal', isShown.toString());

    // Trace the dialog node to the document root.
    const parentNodes: Element[] = [];
    let currentNode = dialogNode;
    while (currentNode.parentNode && currentNode !== document.body) {
        parentNodes.unshift(currentNode.parentNode as Element);
        currentNode = currentNode.parentNode as Element;
    }

    // Fortunately aria-hidden also applies to descendants, so we just need to walk from
    // document root to dialog node, hiding all direct children that do not contain the
    // dialog and are not the dialog itself.
    for (let i = 0; i < parentNodes.length; i++) {
        currentNode = parentNodes[i];
        const childNodeContainingDialog = parentNodes[i + 1];
        for (let j = 0; j < currentNode.children.length; j++) {
            const childNode = currentNode.children[j];
            if (
                childNode !== childNodeContainingDialog &&
                childNode !== dialogNode &&
                !DO_NOT_NEED_TO_HIDE_TAGS.has(childNode.tagName.toLowerCase())
            ) {
                if (isShown) {
                    if (!childNode.hasAttribute('data-was-aria-hidden')) {
                        // Hopefully we don't have multiple dialogs open at the same time,
                        // but just in case, make sure we only do this once.
                        childNode.setAttribute(
                            'data-was-aria-hidden',
                            childNode.getAttribute('aria-hidden') ?? 'false',
                        );
                    }
                    childNode.setAttribute('aria-hidden', 'true');
                } else {
                    childNode.setAttribute(
                        'aria-hidden',
                        childNode.getAttribute('data-was-aria-hidden') ?? 'false',
                    );
                    childNode.removeAttribute('data-was-aria-hidden');
                }
            }
        }
    }
}
