import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import {ORGANIZATION_HAS_USER_STATUS} from 'organization-manage-users/constants';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

import * as constants from './constants';

const udConfig = getConfigData();

export default class PathEditorsStore extends AutosuggestStore {
    constructor(path) {
        super();
        this.path = path;
        this.setPathOwner(this.path.owner);
        this.setEditableEditors(this.path.editors);
        this.sortEditors();
        this.usersApiUrl = `/organizations/${udConfig.brand.organization.id}/users/autocomplete/`;
    }

    @observable pathOwner;
    @observable editableEditors;
    @observable editorsUpdates = {added: [], removed: [], featured_editor: undefined};

    @action
    setPathOwner(user) {
        this.pathOwner = {...user};
    }

    @action
    setEditableEditors(editors) {
        this.editableEditors = [...editors];
    }

    @computed
    get areEditorUpdatesAvailable() {
        return (
            this.editorsUpdates.added.length ||
            this.editorsUpdates.removed.length ||
            this.editorsUpdates.featured_editor
        );
    }

    @action
    setEditorsUpdatesAdded(user) {
        // Keep editorsUpdates 'added' and 'removed' arrays up to date when users are added or removed
        // i.e. adding a user - we need to check if they are already in the 'removed' array and delete them from
        // there if so.
        if (this.editorsUpdates.removed.some((editorId) => editorId === user.id)) {
            this.editorsUpdates.removed.remove(user.id);
        } else {
            this.editorsUpdates.added.push(user.id);
        }
    }

    @action
    setEditorsUpdatesRemoved(user) {
        // Keep editorsUpdates 'added' and 'removed' arrays up to date when users are added or removed
        // i.e. removing a user - we need to check if they are already in the 'added' array and delete them from
        // there if so.
        if (this.editorsUpdates.added.some((editorId) => editorId === user.id)) {
            this.editorsUpdates.added.remove(user.id);
        } else {
            this.editorsUpdates.removed.push(user.id);
        }
    }

    @action
    setEditorsUpdatesFeatured(user) {
        if (user.id === this.path.owner.id) {
            this.editorsUpdates.featured_editor = undefined;
        } else {
            this.editorsUpdates.featured_editor = user;
        }
    }

    @autobind
    @action
    removePathEditor(user) {
        this.editableEditors.splice(this.editableEditors.indexOf(user), 1);
        this.setEditorsUpdatesRemoved(user);
    }

    @autobind
    @action
    makeEditorFeatured(user) {
        this.pathOwner = user;
        this.sortEditors();
        this.setEditorsUpdatesFeatured(user);
    }

    @action
    sortEditors() {
        // Sorting to keep the Featured editor first and other editors below in alphabetical order
        this.editableEditors = this.editableEditors
            .slice()
            .sort((editorA, editorB) => {
                return editorA.display_name.localeCompare(editorB.display_name);
            })
            .sort((editorA, editorB) => {
                const ownerId = this.pathOwner.id;
                return editorA.id === ownerId ? -1 : editorB.id === ownerId ? 1 : 0;
            });
    }

    @autobind
    @action
    selectUser(user) {
        this.editableEditors.push(user);
        this.sortEditors();
        this.setEditorsUpdatesAdded(user);
        this.clearInputValue();
    }

    @autobind
    @action
    discardEditorsUpdates() {
        this.editorsUpdates.added = [];
        this.editorsUpdates.removed = [];
        this.editorsUpdates.featured_editor = undefined;
    }

    @action
    async loadSuggestions({q, signal}) {
        const response = await udApi.get(this.usersApiUrl, {
            signal,
            params: {
                page: constants.PAGE,
                page_size: constants.PAGE_SIZE,
                search: q,
                status: `${ORGANIZATION_HAS_USER_STATUS.active},${ORGANIZATION_HAS_USER_STATUS.pending}`,
                'fields[user]': constants.USER_FIELDS,
            },
        });
        this.setSuggestions(response.data.results || []);
        this.cachedSuggestions[q] = this.suggestions;
    }
}
