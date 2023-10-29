import {Dropdown} from '@udemy/react-menu-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import '../learning-filter.less';

@observer
export default class CategoryFilter extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        setNewParam: PropTypes.func.isRequired,
        block: PropTypes.bool,
    };

    static defaultProps = {
        block: false,
    };

    @autobind
    selectFilter(filter) {
        this.props.setNewParam('category_filter', filter);
    }

    render() {
        const {block, store} = this.props;
        return (
            <Dropdown
                useDrawer={false}
                placement="bottom-start"
                menuWidth={block ? 'fullWidth' : 'large'}
                menuMaxHeight={block ? '38vh' : `${pxToRem(390)}rem`}
                trigger={
                    <Dropdown.Button size="medium" styleName="filter-dropdown-btn">
                        {store.categoryTitle}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu styleName="filter-dropdown-menu">
                    <Dropdown.MenuItem onClick={() => this.selectFilter('favorited')}>
                        {gettext('Favorites')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
                <Dropdown.Menu styleName="filter-dropdown-menu">
                    <Dropdown.MenuItem onClick={() => this.selectFilter('all')}>
                        {gettext('All Categories')}
                    </Dropdown.MenuItem>
                    {store.categories.map(({id, title}) => (
                        <Dropdown.MenuItem
                            key={id}
                            onClick={() => this.selectFilter(id)}
                            data-purpose={`category-item-${id}`}
                        >
                            {title}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
                <Dropdown.Menu styleName="filter-dropdown-menu">
                    <Dropdown.MenuItem onClick={() => this.selectFilter('archived')}>
                        {gettext('Archived')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
