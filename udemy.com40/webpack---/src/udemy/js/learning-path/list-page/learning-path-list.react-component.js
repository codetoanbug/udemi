import {Pagination} from '@udemy/react-navigation-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import LearningPathStore from '../learning-path.mobx-store';
import LearningPathCard from './learning-path-card.react-component';
import ListPageStore from './list-page.mobx-store';

import './list-page.less';

@inject('learningPathStore', 'listPageStore')
@withRouter
@observer
export default class LearningPathList extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    @autobind
    onPageSelected(page) {
        this.props.listPageStore.updateSearchQuery({page});

        this.props.history.push({
            pathname: this.props.location.path,
            search: this.props.listPageStore.urlSearchString,
        });
    }

    render() {
        const {
            paths,
            isLoadingList,
            isChangingPage,
            numPages,
            currentPage,
        } = this.props.listPageStore;

        const {isMobileViewportSize} = this.props.learningPathStore;

        if (isChangingPage && isLoadingList) {
            return <MainContentLoader size="xlarge" />;
        }

        return (
            <>
                <div styleName="path-list-container">
                    <div styleName={classNames('path-cards-list', {loading: isLoadingList})}>
                        {paths.map((path) => (
                            <LearningPathCard
                                learningPath={path}
                                key={path.id}
                                isMobileViewportSize={isMobileViewportSize}
                            />
                        ))}
                    </div>
                    {!isChangingPage && isLoadingList && (
                        <div styleName="loader" data-purpose="loading-list">
                            <MainContentLoader size="xlarge" />
                        </div>
                    )}
                </div>
                <Pagination
                    styleName="pagination"
                    pageCount={numPages}
                    activePage={currentPage}
                    onPageChange={this.onPageSelected}
                />
            </>
        );
    }
}
