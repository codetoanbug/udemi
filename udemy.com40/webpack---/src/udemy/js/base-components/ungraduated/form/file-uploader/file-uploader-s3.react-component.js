import {FileUploader} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import FileUploaderS3Model from './file-uploader-s3.mobx-model';

/**
 * This component renders an FileUploader component and ties it to ud-s3fineuploader.js
 * to upload a file to S3.
 */
@observer
export default class FileUploaderS3 extends Component {
    static propTypes = {
        ...FileUploader.propTypes,
        uploader: PropTypes.instanceOf(FileUploaderS3Model).isRequired,
    };

    static defaultProps = {
        ...FileUploader.defaultProps,
        onChangeSelectedFile: noop,
    };

    @autobind
    handleChangeSelectedFile(event) {
        const {uploader, onChangeSelectedFile} = this.props;
        uploader.onChangeSelectedFile(event);
        onChangeSelectedFile(event);
    }

    render() {
        const {uploader, onChangeSelectedFile, ...props} = this.props;
        return (
            <FileUploader
                {...props}
                onChange={uploader.onFileSelected}
                onChangeSelectedFile={this.handleChangeSelectedFile}
                allowedExtensionsDotted={uploader.allowedExtensionsDotted}
                progressPercentage={uploader.file ? uploader.file.progressPercentage : null}
            />
        );
    }
}
