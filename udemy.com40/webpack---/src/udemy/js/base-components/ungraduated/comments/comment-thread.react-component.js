import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from 'utils/noop';

import Comment from './comment.react-component';
import CommentsStore from './comments.mobx-store';
import './comment.less';

@observer
class CommentThread extends React.Component {
    static propTypes = {
        commentsStore: PropTypes.object,
        resourceUrl: PropTypes.string.isRequired,
        className: PropTypes.string,
        commentThread: PropTypes.object,
        autoLoad: PropTypes.bool,
        canReply: PropTypes.bool,
        isReversed: PropTypes.bool,
        richTextTheme: Comment.propTypes.richTextTheme,
        textToHTML: Comment.propTypes.textToHTML,
        createCommentCallback: PropTypes.func,
        editCommentCallback: PropTypes.func,
        deleteCommentCallback: PropTypes.func,
        newCommentPlaceholder: PropTypes.string,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
        // eslint-disable-next-line react/require-default-props
        interpolate: PropTypes.func,
    };

    static defaultProps = {
        commentsStore: undefined,
        className: '',
        commentThread: undefined,
        autoLoad: false,
        canReply: true,
        isReversed: false,
        richTextTheme: Comment.defaultProps.richTextTheme,
        textToHTML: Comment.defaultProps.textToHTML,
        createCommentCallback: noop,
        editCommentCallback: noop,
        deleteCommentCallback: noop,
        newCommentPlaceholder: Comment.defaultProps.placeholder,
    };

    constructor(props) {
        super(props);
        this.store =
            props.commentsStore ||
            new CommentsStore(
                this.props.resourceUrl,
                this.props.commentThread,
                this.props.createCommentCallback,
                this.props.editCommentCallback,
                this.props.deleteCommentCallback,
                {gettext: props.gettext},
            );
    }

    componentDidMount() {
        // It is possible for a commentThread on an object to be None/undefined, so make sure it's set
        if (this.props.autoLoad && this.props.commentThread) {
            this.store.loadComments();
        }
    }

    render() {
        const {gettext, interpolate} = this.props;
        const showShowComments =
            !!this.store.numComments && this.store.comments.length === 0 && !this.store.isLoading;
        const showLoadMore = this.store.hasNextPage && !showShowComments && !this.store.isLoading;
        const replyEdit = this.props.canReply && (
            <Comment
                key="new-comment"
                data-purpose="new-comment"
                comment={this.store.newComment}
                richTextTheme={this.props.richTextTheme}
                textToHTML={this.props.textToHTML}
                placeholder={this.props.newCommentPlaceholder}
            />
        );
        const comments = (this.props.isReversed
            ? this.store.comments.slice(0).reverse()
            : this.store.comments
        ).map((comment) => (
            <Comment
                key={comment.id}
                comment={comment}
                richTextTheme={this.props.richTextTheme}
                textToHTML={this.props.textToHTML}
            />
        ));
        const showComments = showShowComments && (
            <Button
                className="ud-link-neutral ud-link-underline"
                styleName="more-btn"
                udStyle="link"
                data-purpose="show-comments-link"
                onClick={this.store.loadComments}
            >
                {interpolate(
                    gettext('Show comments (%(numComments)s)'),
                    {numComments: this.store.numComments},
                    true,
                )}
            </Button>
        );
        const loadMore = showLoadMore && (
            <Button
                className="ud-link-neutral ud-link-underline"
                styleName="more-btn"
                udStyle="link"
                data-purpose="load-more-link"
                onClick={this.store.loadComments}
            >
                {interpolate(
                    this.props.isReversed
                        ? gettext('Load earlier (%(remainingComments)s)')
                        : gettext('Load more (%(remainingComments)s)'),
                    {
                        remainingComments: this.store.numComments - this.store.comments.length,
                    },
                    true,
                )}
            </Button>
        );
        const isLoading = this.store.isLoading && (
            <Loader block={true} size="medium" styleName="loader" />
        );
        const children = this.props.isReversed
            ? [loadMore, showComments, isLoading, comments, replyEdit]
            : [replyEdit, comments, showComments, loadMore, isLoading];

        return (
            <div className={classNames(this.props.className, 'udlite-in-udheavy')}>
                {children.map((child, index) => {
                    return <React.Fragment key={index}>{child}</React.Fragment>;
                })}
            </div>
        );
    }
}

export default withI18n(CommentThread);
