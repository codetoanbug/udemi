import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {noop} from 'utils/noop';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import CommentModel from './comment.mobx-model';
import {PAGE_SIZE} from './constants';

export default class CommentsStore {
    @observable hasNextPage = false;
    @observable isLoading = false;
    @observable comments = [];
    @observable numComments = 0; // can't be a computed because we don't always load all comments, so we rely on the value from the API
    currentPage = 1;

    createCommentCallback = noop;
    editCommentCallback = noop;
    deleteCommentCallback = noop;

    constructor(
        resourceUrl,
        commentThread,
        createCommentCallback,
        editCommentCallback,
        deleteCommentCallback,
        {gettext},
    ) {
        this.resourceUrl = resourceUrl;
        this.commentThread = commentThread;
        this.createCommentCallback = createCommentCallback;
        this.editCommentCallback = editCommentCallback;
        this.deleteCommentCallback = deleteCommentCallback;
        this.gettext = gettext;

        if (this.commentThread) {
            this.setNumComments(this.commentThread.num_comments);
            if (this.commentThread.comments) {
                this.addComments(this.commentThread.comments);
            }
            if (this.numComments > this.comments.length) {
                this.setHasNextPage(true);
            }
        }

        this.newComment = new CommentModel(this, {user: udMe}, {gettext: this.gettext});
    }

    @autobind
    @action
    loadComments() {
        this.isLoading = true;
        return udApi
            .get(this.resourceUrl, {
                params: {
                    page: this.currentPage,
                    page_size: PAGE_SIZE,
                },
            })
            .then(
                action(({data}) => {
                    // Comments can be created or deleted by other clients, which messes up the
                    // pagination state, and can result in data.results containing comments that
                    // are already in this.comments. We can't assume that this.comments contains
                    // all the comments up to and including the current page. Hence, !!data.next
                    // is more accurate than this.comments.length < this.numComments.
                    this.setHasNextPage(!!data.next);

                    this.setNumComments(data.count);
                    this.addComments(data.results);
                    this.currentPage += 1;
                }),
            )
            .catch((error) => {
                if (error.status === 404) {
                    // Page can go out of bounds if comments are deleted by other clients.
                    this.setHasNextPage(false);
                }
            })
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    @action
    setHasNextPage(value) {
        this.hasNextPage = value;
    }

    @action
    setNumComments(numComments) {
        this.numComments = numComments;
    }

    @action
    addComments(comments) {
        comments.forEach((comment) => {
            if (!this.commentIds.has(comment.id)) {
                this.comments.push(new CommentModel(this, comment, {gettext: this.gettext}));
            }
        });
    }

    createComment(data) {
        return udApi.post(this.resourceUrl, data).then(
            action(({data}) => {
                this.numComments += 1;
                const commentModel = new CommentModel(this, Object.assign({}, data), {
                    gettext: this.gettext,
                });
                this.comments.unshift(commentModel);
                this.createCommentCallback(commentModel);
            }),
        );
    }

    updateComment(commentId, data) {
        return udApi.patch(`${this.resourceUrl}${commentId}/`, data).then(({data}) => {
            const commentModel = new CommentModel(this, Object.assign({}, data), {
                gettext: this.gettext,
            });
            this.editCommentCallback(commentModel);
        });
    }

    deleteComment(commentId) {
        return udApi.delete(`${this.resourceUrl}${commentId}/`).then(
            action(() => {
                this.numComments -= 1;
                this.comments = this.comments.filter((comment) => comment.id !== commentId);

                // Reload comments for the current page.
                // Otherwise we skip however many comments we deleted when we load the next page.
                // E.g. with { pageSize: 3, comments: [1, 2, 3], DB comments: [1, 2, 3, 4, 5, 6] }:
                // If we delete comments: [1], then load the next page, the next page returns
                // comments: [5, 6], skipping comments: [4].
                // By reloading comments for the current page, we get comments: [2, 3, 4]
                // after the deletion, and after loading the next page, we get comments: [2, 3, 4, 5, 6].
                this.currentPage = Math.max(1, this.currentPage - 1);
                this.loadComments();

                this.deleteCommentCallback(commentId);
            }),
        );
    }

    @computed
    get commentIds() {
        return new Set(this.comments.map((c) => c.id));
    }
}
