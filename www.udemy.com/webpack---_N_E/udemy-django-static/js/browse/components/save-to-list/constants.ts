// Custom Javascript events used for coordinating between components that add/remove items from Lists
export const enum ListEvents {
    ADD = 'addToList',
    REMOVE = 'removeFromList',
    CREATE = 'createNewList',
}

export const MAX_TITLE_CHARACTER_LIMIT = 60;
export const MIN_TITLE_CHARACTER_LIMIT = 1;
