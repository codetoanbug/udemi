const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

export default function escapeRegex(str) {
    return str && reHasRegExpChar.test(str) ? str.replace(reRegExpChar, '\\$&') : str;
}
