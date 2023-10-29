import {AutosuggestStore} from '@udemy/react-autosuggest-components';

import Sentry from 'utils/ud-raven';

/**
 * ### DjangoAutosuggestStore
 *
 * @remarks
 * This is a subclass of {@link AutosuggestStore} where we are setting up `Sentry.captureException`
 * out of convenience for consumers.
 *
 * @typeParam TSuggestionDataModel - The data model for an individual suggestion.  Autosuggest allows you to use any
 * sort of data you want for a suggestion, thus we are using a generic to let TypeScript know what to look for.
 * The internal `suggestions` ref is an array of these.
 *
 * @example
 * ```ts
 * import Autosuggest from 'base-components/form/autosuggest/autosuggest.mobx-store';
 * interface FooSuggestion {
 *   name: string
 * }
 *
 * class FooAutosuggestStore extends Autosuggest<FooSuggestion> {}
 * ```
 */
class DjangoAutosuggestStore<TSuggestionDataModel> extends AutosuggestStore<TSuggestionDataModel> {
    constructor() {
        super(Sentry.captureException);
    }
}

// eslint-disable-next-line import/no-default-export
export default DjangoAutosuggestStore;
