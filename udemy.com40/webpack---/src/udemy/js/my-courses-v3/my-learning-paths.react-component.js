import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import LearningPathCard from 'organization-home/components/learning-path-card/learning-path-card.react-component';
import {getQueryParams} from 'utils/query-params';
import udLink from 'utils/ud-link';

import EmptyState from './empty-state.react-component';
import MyLearningPathsStore from './my-learning-paths.mobx-store';
import {MyCoursesPagination, getPaginationLabel} from './pagination.react-component';
import {updateSearchParams} from './search-params';

const getLearningPathPaginationLabel = (store) => {
    const template = npgettext(
        'e.g. 1–12 of 24 learning paths',
        '%(first)s–%(last)s of %(total)s learning path',
        '%(first)s–%(last)s of %(total)s learning paths',
        store.count,
    );
    return getPaginationLabel(template, store);
};

@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
export default class MyLearningPaths extends Component {
    static propTypes = {
        isMobileMax: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
        history: PropTypes.object,
        location: PropTypes.object,
    };

    static defaultProps = {
        isMobileMax: null,
        history: window.history,
        location: window.location,
    };

    constructor(props) {
        super(props);
        this.store = new MyLearningPathsStore('learning_paths_tab');
        this.resourceContextMenu = createUFBContextMenu();
    }

    componentDidMount() {
        const searchParams = getQueryParams(this.props.location);
        this.store.currentPage = parseInt(searchParams.p, 10) || 1;
        this.store.loadLearningPaths();
    }

    @autobind
    @action
    onPageChange(page) {
        updateSearchParams({p: `${page}`}, this.props.history);
        this.store.currentPage = page;
        this.store.loadLearningPaths();
    }

    renderCards() {
        return (
            <Provider resourceContextMenu={this.resourceContextMenu}>
                <div className="my-courses__wide-card-grid">
                    {this.store.learningPaths.map((learningPath, index) => (
                        <div key={index}>
                            <LearningPathCard
                                learningPath={learningPath}
                                size={this.props.isMobileMax ? 'small' : 'large'}
                                wrapperClassName="my-learning-paths"
                            />
                        </div>
                    ))}
                </div>
                <MyCoursesPagination store={this.store} onPageChange={this.onPageChange} />
                {getLearningPathPaginationLabel(this.store)}
            </Provider>
        );
    }

    render() {
        if (this.store.learningPaths.length === 0 && !this.store.isLoading) {
            return (
                <EmptyState
                    layout="horizontal"
                    imageProps={{
                        src: udLink.toStorageStaticAsset('learning-path/add-to-path.jpg'),
                        src2x: udLink.toStorageStaticAsset('learning-path/add-to-path-2x.jpg'),
                    }}
                    title={gettext('Learning paths you are enrolled in will appear here')}
                    subtitle={gettext('Discover new learning paths or create your own')}
                    ctaProps={{
                        componentClass: 'a',
                        href: '/learning-paths',
                        children: gettext('Explore learning paths'),
                    }}
                />
            );
        }

        return this.store.isLoading ? <MainContentLoader /> : this.renderCards();
    }
}
