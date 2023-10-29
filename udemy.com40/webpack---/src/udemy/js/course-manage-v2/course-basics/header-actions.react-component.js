import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

@observer
export default class HeaderActions extends Component {
    static propTypes = {
        previewUrl: PropTypes.string,
        isSaveEnabled: PropTypes.bool.isRequired,
        saveForm: PropTypes.func.isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        previewUrl: null,
        onSaveComplete: noop,
    };

    @autobind
    onSave() {
        this.props.saveForm().then(this.props.onSaveComplete);
    }

    render() {
        const {isSaveEnabled, previewUrl} = this.props;
        return (
            <>
                {previewUrl ? (
                    <Button
                        componentClass="a"
                        udStyle="white-outline"
                        size="small"
                        href={this.props.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Preview')}
                    </Button>
                ) : null}
                <Button
                    udStyle="white-solid"
                    size="small"
                    disabled={!isSaveEnabled}
                    onClick={this.onSave}
                >
                    {gettext('Save')}
                </Button>
            </>
        );
    }
}
