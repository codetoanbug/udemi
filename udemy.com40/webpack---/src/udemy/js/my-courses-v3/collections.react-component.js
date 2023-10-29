import {LocalizedHtml} from '@udemy/i18n';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {UI_REGION} from 'browse/ui-regions';

import CollectionCardList from './collection-card-list.react-component';
import CollectionsStore from './collections.mobx-store';
import EmptyState from './empty-state.react-component';
import MyCoursesSubscriptionContext from './my-courses-subscription-context';
import {MyCoursesPagination, getPaginationLabel} from './pagination.react-component';
import {updateSearchParams} from './search-params';
import './collections.less';

const getListPaginationLabel = (store) => {
    const template = npgettext(
        'e.g. 1–12 of 24 lists',
        '%(first)s–%(last)s of %(total)s list',
        '%(first)s–%(last)s of %(total)s lists',
        store.count,
    );
    return getPaginationLabel(template, store);
};

@observer
export default class Collections extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        uiRegion: PropTypes.string,
    };

    static defaultProps = {
        uiRegion: UI_REGION.COLLECTIONS,
    };

    constructor(props) {
        super(props);
        this.store = new CollectionsStore(props.location, props.history);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.loadPage();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            this.loadPage();
            this.ref.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }

    @action
    loadPage() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.store.currentPage = parseInt(searchParams.get('p'), 10) || 1;
        this.store.loadCollectionsWithCourses();
    }

    @autobind
    onPageChange(page) {
        updateSearchParams({p: `${page}`}, this.props.history);
    }

    renderCollectionCardList() {
        return this.store.collections.map((collection) => (
            <CollectionCardList
                key={collection.id}
                store={this.store}
                collection={collection}
                uiRegion={this.props.uiRegion}
            />
        ));
    }

    renderPaginatedCollections() {
        return (
            <>
                {this.store.showZeroState ? (
                    <CollectionsZeroState />
                ) : (
                    this.renderCollectionCardList()
                )}
                <MyCoursesPagination store={this.store} onPageChange={this.onPageChange} />
                {getListPaginationLabel(this.store)}
            </>
        );
    }

    render() {
        return (
            <div ref={this.ref}>
                {this.store.isLoading ? <MainContentLoader /> : this.renderPaginatedCollections()}
            </div>
        );
    }
}

const CollectionsZeroState = () => {
    const {consumerSubscriptionActive} = React.useContext(MyCoursesSubscriptionContext);

    return (
        <EmptyState
            layout="vertical"
            title={gettext('Organize and access your courses faster!')}
            subtitle={
                !consumerSubscriptionActive && (
                    <p className="ud-text-with-links">
                        <LocalizedHtml
                            dataPurpose="no-collections-link"
                            html={gettext(
                                '<a class="link">Go to the All Courses tab</a> to create a list.',
                            )}
                            interpolate={{
                                link: <a href="/home/my-courses" className="ud-text-bold" />,
                            }}
                        />
                    </p>
                )
            }
        />
    );
};
