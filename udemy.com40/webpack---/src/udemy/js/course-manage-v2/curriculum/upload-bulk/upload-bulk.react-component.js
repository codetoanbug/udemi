import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import FilePicker from 'utils/ud-filepicker';

@inject('store')
export default class UploadBulk extends Component {
    static propTypes = {
        acceptAudio: PropTypes.bool,
        acceptPresentation: PropTypes.bool,
        store: PropTypes.object.isRequired,
    };

    static defaultProps = {
        acceptAudio: false,
        acceptPresentation: false,
    };

    constructor(props) {
        super(props);
        this.filePicker = new FilePicker(this.props.store.filePickerParams);
        this.filePicker.allowMultiple();
        this.filePicker.allowVideo();

        if (props.acceptAudio) {
            this.filePicker.allowAudio();
        }
        if (props.acceptPresentation) {
            this.filePicker.allowPresentation();
        }
        this.filePicker.allowSupplementaryFiles();
    }

    @autobind
    handleClick() {
        this.filePicker.pickAndStore();
    }

    render() {
        const isCourseVersionEnabled = this.props.store.pageStore.isCourseVersionEnabled;
        return (
            <>
                {!isCourseVersionEnabled && (
                    <Button udStyle="secondary" onClick={this.handleClick}>
                        {gettext('Bulk Uploader')}
                    </Button>
                )}
                {isCourseVersionEnabled && (
                    <Button
                        className="ud-link-neutral ud-link-underline"
                        udStyle="ghost"
                        onClick={this.handleClick}
                    >
                        {gettext('Bulk Uploader')}
                    </Button>
                )}
            </>
        );
    }
}
