import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ListPageStore from './list-page.mobx-store';

import './list-page.less';

@inject('listPageStore')
@observer
export default class ListPageHeader extends Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
    };

    render() {
        const {listTitle, listDescription} = this.props.listPageStore;

        return (
            <>
                <div styleName="list-page-header">
                    <h2 className="ud-heading-xl" styleName="list-title">
                        {listTitle}
                    </h2>
                    <div>{this.props.children}</div>
                </div>
                {listDescription && (
                    <div
                        className="ud-text-md"
                        styleName="list-description"
                        data-purpose="list-description"
                    >
                        {listDescription}
                    </div>
                )}
            </>
        );
    }
}
