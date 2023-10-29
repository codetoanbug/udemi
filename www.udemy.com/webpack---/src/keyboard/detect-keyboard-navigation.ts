import {Keys} from './keys';

export function detectKeyboardNavigation(document = window.document) {
    function setKeyboardNavigationOff() {
        document.body.classList.remove('ud-keyboard-navigation-in-use');
        document.body.addEventListener('keydown', setKeyboardNavigationOn);
        document.body.removeEventListener('mousedown', setKeyboardNavigationOff);
    }

    function setKeyboardNavigationOn(event: KeyboardEvent) {
        if (event.keyCode === Keys.TAB) {
            document.body.classList.add('ud-keyboard-navigation-in-use');
            document.body.removeEventListener('keydown', setKeyboardNavigationOn);
            document.body.addEventListener('mousedown', setKeyboardNavigationOff);
        }
    }

    setKeyboardNavigationOff();
}
