/**
 * Export JSDOM. This only works on the server. Otherwise, it'll be undefined.
 *
 * The only reason this module exists is to paper over the fact that this is set as a global in
 * static/isomorphic-rendering/bootstrap.js.
 */

import {serverOrClient} from '../env/server-or-client';

// Because this depends on the state of global variables, only import it in a
// context where you can control the state of this object; i.e., don't
// import/export within an index module.
export const JSDOM = serverOrClient.global.JSDOM;
