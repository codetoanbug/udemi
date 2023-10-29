export function findFocusables(container: HTMLElement) {
    // List of elements that are considered "focusable" by a keyboard
    const focusableQuery = 'button,input,select,textarea,a[href],[tabindex]';
    let focusables = Array.from(container.querySelectorAll(focusableQuery));

    // attributes we use to prune out elements that make a focusable element moot
    const unfocusableQuery = '[disabled],[aria-disabled="true"],[tabindex="-1"]';
    const unfocusables = Array.from(container.querySelectorAll(unfocusableQuery));

    unfocusables.forEach((unfocusable) => {
        focusables = focusables.filter((focusable) => !unfocusable.contains(focusable));
    });

    return focusables as HTMLElement[];
}
