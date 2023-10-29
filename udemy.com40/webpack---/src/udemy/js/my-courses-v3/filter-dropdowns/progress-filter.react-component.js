import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import '../learning-filter.less';

@observer
export default class ProgressFilter extends Component {
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
        this.props.setNewParam('progress_filter', filter);
    }

    render() {
        const {block, store} = this.props;
        return (
            <Dropdown
                useDrawer={false}
                placement="bottom-start"
                menuWidth={block ? 'fullWidth' : 'medium'}
                menuMaxHeight={block ? '38vh' : undefined}
                trigger={
                    <Dropdown.Button size="medium" styleName="filter-dropdown-btn">
                        {store.progressTitle}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu styleName="filter-dropdown-menu">
                    {store.progressFilters.map(({status}) => (
                        <Dropdown.MenuItem
                            key={status}
                            onClick={() => this.selectFilter(status)}
                            data-purpose={`progress-item-${status}`}
                        >
                            {store.progressOptions[status].title}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
