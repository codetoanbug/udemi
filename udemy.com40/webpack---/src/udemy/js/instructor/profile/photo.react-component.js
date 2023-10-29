import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import ImageUploadPreviewWithCrop from 'base-components/ungraduated/form/image-upload-preview-with-crop/image-upload-preview-with-crop.react-component';
import {allowedImageExtensionsList} from 'utils/s3-upload-configuration';

import OneColumn from '../layout/one-column.react-component';
import ProfileStore from './profile.mobx-store';
import './photo.less';

@withRouter
@observer
export default class Photo extends Component {
    static propTypes = {
        store: PropTypes.object,
        window: PropTypes.object,
        location: PropTypes.object.isRequired,
    };

    static defaultProps = {
        store: null,
        window,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new ProfileStore(props.window);
    }

    componentDidMount() {
        this.store.getUserProfilePhoto();
    }

    @autobind
    async onSubmit(event) {
        event.preventDefault();
        const currentPathName = this.props.location.pathname;
        await this.store.updateUserImage();
        if (this.props.location.pathname === currentPathName) {
            this.props.window.location.reload();
        }
    }

    render() {
        const store = this.store;

        return (
            <OneColumn>
                <form onSubmit={this.onSubmit} data-purpose="profile-photo-form">
                    <FormGroup label={gettext('Image preview')}>
                        <div className="ud-text-xs" styleName="help-block">
                            {gettext('Minimum 200x200 pixels, Maximum 6000x6000 pixels')}
                        </div>
                        {store.userImage && (
                            <ImageUploadPreviewWithCrop
                                imageUrl={store.userImage}
                                minHeight={200}
                                minWidth={200}
                                aspect={1}
                                allowedExtensions={allowedImageExtensionsList}
                                onCrop={store.setUserImage}
                                onUploadCompleted={store.setUploadedImageKey}
                                uploadLabel={gettext('Upload image')}
                                fieldName="image_file"
                                disabled={!store.allowChangeUserProfile}
                            />
                        )}
                    </FormGroup>
                    <FooterButtons alignment="left">
                        <Button
                            data-purpose="profile-photo-submit-button"
                            disabled={!store.canSubmit || store.isSubmitting}
                            type="submit"
                        >
                            {gettext('Save')}
                        </Button>
                    </FooterButtons>
                </form>
            </OneColumn>
        );
    }
}
