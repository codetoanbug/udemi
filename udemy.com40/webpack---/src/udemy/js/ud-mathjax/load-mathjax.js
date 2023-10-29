import {DEFAULT_CONFIG} from './constants';

let mathjaxLib = null;

export default async function loadMathjax(config = {}) {
    if (mathjaxLib) {
        return mathjaxLib;
    }
    // MathJax configuration should be made before loading the library, and the window.MathJax variable
    // is used for MathJax's internal configuration, changes in that variable can corrupt the MathJax
    // configuration once it is loaded
    if (!window.MathJax) {
        window.MathJax = {...DEFAULT_CONFIG, ...config};
    }
    const mathjaxLibModule = await import(/* webpackChunkName: "mathjax" */ 'ud-mathjax');
    mathjaxLib = mathjaxLibModule.default;
    return mathjaxLib;
}
