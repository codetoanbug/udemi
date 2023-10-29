/**
 * Initialize DOMPurify either in the browser or when using isomorphic rendering.
 */

import createDOMPurify from 'dompurify';

import {JSDOM} from './iso-jsdom';

// I'm pretty sure static/src/udemy/js/test/require-isocomponents.spec.js is lying about whether
// serverOrClient.isClient is true, so I'm going to see whether JSDOM is defined. It's
// undefined on the client side.
const domPurifyWindow = typeof JSDOM !== 'undefined' ? new JSDOM('').window : window;

// Because this depends on the state of global variables, only import it in a
// context where you can control the state of this object; i.e., don't
// import/export within an index module.
export const DOMPurify = createDOMPurify(domPurifyWindow);
