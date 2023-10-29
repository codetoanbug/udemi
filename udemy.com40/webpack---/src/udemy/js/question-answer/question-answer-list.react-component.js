import Observer from '@researchgate/react-intersection-observer';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import EmptyState from 'instructor/common/empty-state.react-component';
import ExitableSearchBar from 'instructor/common/exitable-search-bar.react-component';
import UserCommunicationCard from 'instructor/common/user-communication-card.react-component';
import udLink from 'utils/ud-link';

import {UNREAD} from './constants';
import './question-answer-list.less';

@inject('store')
@observer
export default class QuestionAnswerThreadList extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        showFeaturedQuestionsBadge: PropTypes.bool.isRequired,
    };

    @autobind
    onUnreadClick(event, thread) {
        this.props.store.toggleRead(thread);
        event.preventDefault();
    }

    @autobind
    onEnterViewPort(event) {
        window.setTimeout(() => {
            if (event.isIntersecting && !this.props.store.isThreadListLoading) {
                this.props.store.loadMoreThreads();
            }
        }, 0);
    }

    render() {
        const {store, showFeaturedQuestionsBadge} = this.props;

        let emptyState = null;
        if (store.isThreadListLoading) {
            if (store.filteredThreads.length === 0) {
                emptyState = <Loader block={true} size="large" styleName="loader" />;
            }
        } else if (!store.isThreadDetailLoading && store.filteredThreads.length === 0) {
            if (store.filters[UNREAD]) {
                emptyState = (
                    <div styleName="empty-state">
                        <EmptyState
                            src={udLink.toStorageStaticAsset('communication/empty-mailbox-v2.jpg')}
                            src2x={udLink.toStorageStaticAsset(
                                'communication/empty-mailbox-2x-v2.jpg',
                            )}
                            headerText={gettext('No unread items')}
                            subText={gettext('You’re all caught up')}
                        />
                    </div>
                );
            } else {
                emptyState = (
                    <div styleName="empty-state">
                        <EmptyState
                            src={udLink.toStorageStaticAsset('communication/empty-search.jpg')}
                            src2x={udLink.toStorageStaticAsset('communication/empty-search-2x.jpg')}
                            headerText={gettext('No results')}
                            subText={gettext('Try a different filter or search')}
                        />
                    </div>
                );
            }
        }

        return (
            <div styleName="thread-list-container">
                <ExitableSearchBar searchThreads={store.searchThreads} />
                <div styleName="thread-list">
                    {store.filteredThreads.map((thread) => {
                        let content = thread.last_reply ? thread.last_reply.body : '';
                        if (
                            thread.last_reply &&
                            thread.last_reply.user &&
                            thread.last_reply.user.id !== thread.user.id
                        ) {
                            content = `${thread.last_reply.user.name}: ${content}`;
                        }
                        const created = thread.last_reply
                                ? thread.last_reply.created
                                : thread.created,
                            user = thread.user,
                            response = {content, created, user};
                        return (
                            <UserCommunicationCard
                                key={thread.id}
                                to={`${store.baseUrl}/${thread.id}/detail?course=${thread.course.id}`}
                                thread={thread}
                                headline={thread.title}
                                isSelected={thread == store.selectedThread}
                                response={response}
                                onUnreadClick={this.onUnreadClick}
                                showFeaturedQuestionBadge={showFeaturedQuestionsBadge}
                            />
                        );
                    })}
                    {store.filteredThreads.length > 0 && store.hasMoreThreads && (
                        <Observer onChange={this.onEnterViewPort}>
                            <Loader block={true} size="large" styleName="loader" />
                        </Observer>
                    )}
                    {emptyState}
                </div>
            </div>
        );
    }
}
