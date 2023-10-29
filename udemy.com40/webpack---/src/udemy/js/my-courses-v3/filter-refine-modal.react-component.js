import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CategoryFilter from './filter-dropdowns/category-filter.react-component';
import InstructorFilter from './filter-dropdowns/instructor-filter.react-component';
import ProgressFilter from './filter-dropdowns/progress-filter.react-component';
import './learning-filter.less';

@observer
export default class FilterRefineModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        store: PropTypes.object.isRequired,
        reset: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.searchParams = new URLSearchParams(props.location.search);
    }

    @autobind
    setNewParam(key, value) {
        this.searchParams.set(key, value);
        this.searchParams.set('p', 1);
        this.props.store.setState(this.searchParams);
    }

    @autobind
    reset() {
        this.props.reset();
        this.props.onClose();
    }

    @autobind
    apply() {
        this.searchParams.sort();
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: this.searchParams.toString(),
        });
        this.props.onClose();
    }

    render() {
        const {store} = this.props;
        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title={gettext('Filters')}
            >
                <div styleName="modal-dropdowns">
                    <CategoryFilter store={store} setNewParam={this.setNewParam} block={true} />
                    <ProgressFilter store={store} setNewParam={this.setNewParam} block={true} />
                    <InstructorFilter store={store} setNewParam={this.setNewParam} block={true} />
                </div>
                <FooterButtons>
                    <Button udStyle="ghost" disabled={store.isClean} onClick={this.reset}>
                        {gettext('Reset')}
                    </Button>
                    <Button onClick={this.apply}>{gettext('Apply')}</Button>
                </FooterButtons>
            </Modal>
        );
    }
}
