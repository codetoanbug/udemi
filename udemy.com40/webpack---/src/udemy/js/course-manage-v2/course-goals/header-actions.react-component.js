import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@observer
export default class HeaderActions extends Component {
    static propTypes = {
        store: PropTypes.shape({
            dirty: PropTypes.bool.isRequired,
            isValid: PropTypes.bool.isRequired,
            saveLists: PropTypes.func.isRequired,
        }).isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        onSaveComplete: () => true,
    };

    @autobind
    onSave() {
        this.props.store.saveLists().then(this.props.onSaveComplete);
    }

    render() {
        const {dirty} = this.props.store;
        const disabled = !dirty;
        return (
            <Button udStyle="white-solid" size="small" disabled={disabled} onClick={this.onSave}>
                {gettext('Save')}
            </Button>
        );
    }
}
