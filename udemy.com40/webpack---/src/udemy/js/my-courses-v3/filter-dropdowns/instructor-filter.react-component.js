import Observer from '@researchgate/react-intersection-observer';
import {Dropdown} from '@udemy/react-menu-components';
import {Loader} from '@udemy/react-reveal-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import '../learning-filter.less';

const keepMenuOpen = () => false;

@observer
export default class InstructorFilter extends Component {
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
        this.props.store.setInstructor(new URLSearchParams(`instructor_filter=${filter}`));
        this.props.setNewParam('instructor_filter', filter);
    }

    @autobind
    @action
    handleChange(event) {
        if (event.isIntersecting) {
            this.props.store.loadInstructors();
        }
    }

    render() {
        const {block, store} = this.props;
        return (
            <Dropdown
                useDrawer={false}
                placement="bottom-start"
                menuWidth={block ? 'fullWidth' : 'large'}
                menuMaxHeight={block ? '38vh' : `${pxToRem(373)}rem`}
                trigger={
                    <Dropdown.Button size="medium" styleName="filter-dropdown-btn">
                        {store.instructorTitle}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu styleName="filter-dropdown-menu" data-purpose="instructor-menu">
                    {store.instructors.map(({id, title}, idx) => {
                        const item = (
                            <Dropdown.MenuItem
                                key={id}
                                onClick={() => this.selectFilter(id)}
                                data-purpose={`instructor-item-${id}`}
                            >
                                {title}
                            </Dropdown.MenuItem>
                        );
                        if (idx === store.instructors.length - 1) {
                            return (
                                <Observer key={item.key} onChange={this.handleChange}>
                                    {item}
                                </Observer>
                            );
                        }
                        return item;
                    })}
                    {store.instructorsLoading && (
                        <Dropdown.MenuItem componentClass="div" onClick={keepMenuOpen}>
                            <Loader block={true} />
                        </Dropdown.MenuItem>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
