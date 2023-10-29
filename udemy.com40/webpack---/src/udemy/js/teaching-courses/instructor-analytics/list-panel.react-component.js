import {Pagination} from '@udemy/react-navigation-components';
import {pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';

import InfoTooltip from './info-tooltip.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './instructor-analytics.less';
import styles from './list-panel.less';
/* eslint-enable no-unused-vars,import/order */

@observer
export default class ListPanel extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.object.isRequired,
        hasTooltip: PropTypes.bool,
        tooltipCopy: PropTypes.string,
        listItemClass: PropTypes.func.isRequired,
        emptyMessage: PropTypes.node,
        minContentHeight: PropTypes.number,
    };

    static defaultProps = {
        hasTooltip: false,
        tooltipCopy: null,
        emptyMessage: null,
        minContentHeight: 0,
    };

    renderPanelHeader() {
        const {title, hasTooltip, tooltipCopy} = this.props;
        return (
            <div styleName="baseStyles.panel-header">
                <WrapWithText
                    componentClass="h3"
                    className="ud-heading-md"
                    text={title}
                    graphic={hasTooltip && <InfoTooltip>{tooltipCopy}</InfoTooltip>}
                />
            </div>
        );
    }

    render() {
        const {content, listItemClass: ListItem, emptyMessage, minContentHeight} = this.props;
        let panelContent;
        if (content.activePageData.length === 0 && emptyMessage) {
            panelContent = emptyMessage;
        } else {
            const start = content.startIndex + 1;
            const olPadding = start < 10 ? 24 : 10 + 10 * `${start}`.length;
            panelContent = (
                <ol start={start} style={{paddingLeft: `${pxToRem(olPadding)}rem`}}>
                    {content.activePageData.map((itemData, index) => (
                        <li key={index} styleName="styles.list-item">
                            <ListItem itemData={itemData} />
                        </li>
                    ))}
                </ol>
            );
        }

        return (
            <div styleName="styles.flex">
                <div styleName="baseStyles.panel styles.list-panel">
                    {this.renderPanelHeader()}
                    <div
                        styleName={classNames('styles.flex', {
                            'styles.center': panelContent === emptyMessage,
                        })}
                        style={{minHeight: `${pxToRem(minContentHeight)}rem`}}
                    >
                        {panelContent}
                    </div>
                    <Pagination
                        pageCount={content.numPages}
                        activePage={content.activePage}
                        onPageChange={content.goToPage}
                        styleName="baseStyles.pagination"
                    />
                </div>
            </div>
        );
    }
}
