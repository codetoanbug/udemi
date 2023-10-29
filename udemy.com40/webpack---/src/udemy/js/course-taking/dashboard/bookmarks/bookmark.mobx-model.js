import {action, computed, observable} from 'mobx';
import uuidv4 from 'uuid/v4';

import {APIModel} from 'utils/mobx';

import {MAX_BODY_LENGTH} from './constants';

export default class Bookmark extends APIModel {
    @observable id;
    @observable body = '';

    get apiDataMap() {
        return {
            id: 'id',
            isSocialBookmark: {
                source: 'type',
                map: (type) => type === 'social_bookmark',
                defaultValue: false,
            },
            position: {
                source: 'position',
                map: (position) => Math.floor(position),
            },
            created: 'created',
            lectureId: {
                source: 'lecture',
                map: (lecture) => lecture.id,
            },
            lectureDisplayTitle: {
                source: 'lecture',
                map: (lecture) =>
                    interpolate(
                        gettext('%(itemNumber)s. %(itemName)s'),
                        {itemNumber: lecture.object_index, itemName: lecture.title},
                        true,
                    ),
            },
            body: 'body',
            numNotes: 'num_notes',
            originalBody: {
                source: 'body',
                defaultValue: '',
            },
        };
    }

    constructor(...args) {
        super(...args);
        // `id` may get updated (a new bookmark starts with ID -1 and then gets set when saved),
        // but we need a unique reference for React to keep track of the different bookmarks without
        // rerendering.
        this.key = uuidv4();
    }

    @action
    changeBody(newValue) {
        this.body = newValue;
    }

    @action
    syncOriginalBody() {
        this.originalBody = this.body;
    }

    @action
    reset() {
        this.body = this.originalBody;
    }

    @computed
    get remainingChars() {
        return Math.max(MAX_BODY_LENGTH - this.body.length, 0);
    }

    @computed
    get hasBodyText() {
        // Return whether the body HTML has text content. Do not count whitespace as text.
        return this.body.replace(/\s|&nbsp;/g, '').replace(/<[^>]+>/g, '').length > 0;
    }

    @computed
    get isDirty() {
        return this.body !== this.originalBody || this.id === -1;
    }
}
