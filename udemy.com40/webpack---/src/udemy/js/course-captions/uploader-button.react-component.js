import {getUniqueId} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CAPTION_EXTENSIONS_FORMATTED} from 'caption/constants';

import './captions-form.less';

export default class UploaderButton extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };

    id = getUniqueId('uploader');

    @autobind
    handleChange(event) {
        const file = event.target.files[0];
        file && this.props.onChange(file);
        // In the previous line, check that file is present before calling handler, since on IE the
        // following line causes this method to be called again (without a file).
        event.target.value = '';
    }

    render() {
        const {onChange, ...props} = this.props;
        return (
            <>
                <input
                    accept={CAPTION_EXTENSIONS_FORMATTED.join(',')}
                    onChange={this.handleChange}
                    type="file"
                    name={this.id}
                    id={this.id}
                    styleName="uploader"
                    className="ud-sr-only"
                    data-purpose="upload-caption"
                />
                <Button {...props} componentClass="label" htmlFor={this.id} />
            </>
        );
    }
}
