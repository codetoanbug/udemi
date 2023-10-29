import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {BlockList} from '@udemy/react-core-components';
import {ShowMore} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import styles from './what-you-will-learn.less';

@isomorphic
@observer
export default class WhatYouWillLearn extends React.Component {
    static propTypes = {
        objectives: PropTypes.array,
        summaryLimit: PropTypes.number,
        titleTypography: PropTypes.oneOf(['ud-heading-lg', 'ud-heading-xl']),
        listLayoutClassName: PropTypes.string,
    };

    static defaultProps = {
        objectives: [],
        summaryLimit: 10,
        titleTypography: 'ud-heading-xl',
        listLayoutClassName: styles['objectives-list-two-column-layout'],
    };

    @observable isShowingMore = false;

    @autobind
    @action
    handleShowMoreToggle() {
        this.isShowingMore = !this.isShowingMore;
    }

    renderObjectives() {
        const objectiveItemClassName = !this.isShowingMore ? styles['objective-item'] : null;
        const {objectives, listLayoutClassName} = this.props;

        return (
            <BlockList
                size="small"
                padding="tight"
                className={classNames(styles['objectives-list'], listLayoutClassName)}
            >
                {objectives.map((objective) => {
                    return (
                        <BlockList.Item
                            data-purpose="objective"
                            key={objective}
                            icon={<TickIcon label={false} />}
                        >
                            <span className={objectiveItemClassName}>{objective}</span>
                        </BlockList.Item>
                    );
                })}
            </BlockList>
        );
    }

    render() {
        const {objectives, summaryLimit, titleTypography} = this.props;
        const hiddenObjectivesCount = objectives.length - summaryLimit;

        if (!objectives.length) {
            return null;
        }

        return (
            <>
                <span id="what-you-will-learn" className="in-page-offset-anchor" />
                <div className="component-margin" styleName="what-will-you-learn">
                    <h2 className={titleTypography} styleName="title">
                        {gettext("What you'll learn")}
                    </h2>
                    {hiddenObjectivesCount > 0 ? (
                        <ShowMore
                            styleName="content-spacing"
                            collapsedHeight={228}
                            withGradient={true}
                            onToggle={this.handleShowMoreToggle}
                        >
                            {this.renderObjectives()}
                        </ShowMore>
                    ) : (
                        <div styleName="content-spacing">{this.renderObjectives()}</div>
                    )}
                </div>
            </>
        );
    }
}
