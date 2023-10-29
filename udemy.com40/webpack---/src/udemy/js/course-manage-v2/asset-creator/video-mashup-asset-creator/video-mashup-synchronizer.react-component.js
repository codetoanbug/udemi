import {Button} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {FormGroup, TextArea} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {showErrorToast} from 'instructor/toasts';

import VideoMashupAssetCreatorModel from '../video-mashup-asset-creator.mobx-model';
import VideoPreviewer from './video-previewer.react-component';
import './video-mashup-asset-creator.less';

@observer
export default class VideoMashupSynchronizer extends Component {
    static propTypes = {
        creator: PropTypes.instanceOf(VideoMashupAssetCreatorModel).isRequired,
        isSaving: PropTypes.bool.isRequired,
        onSave: PropTypes.func.isRequired,
    };

    @autobind
    onEdit(event) {
        this.props.creator.setSlideTimestamps(event.target.value);
    }

    @autobind
    onConfirmAndPreview() {
        const {parsedSlideTimestamps, numSlides} = this.props.creator;
        if (parsedSlideTimestamps.length === 0) {
            showErrorToast(gettext('Incorrect syndication data!'));
        } else if (parsedSlideTimestamps.length < numSlides) {
            this.props.creator.setShowPreviewConfirmation(true);
        } else {
            this.onPreviewConfirm();
        }
    }

    @autobind
    onPreviewConfirm() {
        this.props.creator.setShowPreviewConfirmation(false);
        this.props.creator.preview().catch(handleUnexpectedAPIError);
    }

    @autobind
    onPreviewCancel() {
        this.props.creator.setShowPreviewConfirmation(false);
    }

    @autobind
    onSave() {
        this.props.creator.save((asset) => this.props.onSave(asset.id), handleUnexpectedAPIError);
    }

    render() {
        if (!this.props.creator.isPreviewable) {
            return (
                <div data-purpose="synchronizer-placeholder" styleName="synchronizer-placeholder">
                    <span styleName="ellipsis">
                        {gettext('Please pick a video & presentation first')}
                    </span>
                </div>
            );
        }
        if (this.props.creator.previewAsset) {
            return (
                <div data-purpose="preview-box">
                    <VideoPreviewer asset={this.props.creator.previewAsset} />
                    <div styleName="action-buttons">
                        <Button
                            size="small"
                            data-purpose="confirm-preview"
                            disabled={this.props.creator.isSaving || this.props.isSaving}
                            onClick={this.onSave}
                        >
                            {gettext('Save')}
                        </Button>
                        <Button
                            className="ud-link-neutral"
                            udStyle="ghost"
                            size="small"
                            data-purpose="cancel-preview"
                            onClick={this.props.creator.cancelPreview}
                        >
                            {gettext('Change')}
                        </Button>
                    </div>
                </div>
            );
        }
        return (
            <div styleName="synchronizer" data-purpose="synchronizer">
                <h4 className="ud-text-bold">
                    {gettext('Please write what time each slide is supposed to appear')}
                </h4>
                <p>
                    {gettext(
                        'You can separate columns by comma, tab or space. Time in seconds can be ' +
                            'input both as an absolute number (125) or hh:mm:ss format (2:05)',
                    )}
                </p>
                <pre>{gettext('Slide, Time (sec)')}</pre>
                <FormGroup
                    label={gettext('Slide, Time (sec)')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <TextArea
                        rows="10"
                        data-purpose="synchronizer-textarea"
                        value={this.props.creator.slideTimestamps}
                        onChange={this.onEdit}
                    />
                </FormGroup>
                <h4 className="ud-text-bold">{gettext('Sample:')}</h4>
                <pre>{`1, 0
2, 65
3, 213
4, 274
5, 302
6, 420
7, 507
8, 545
9, 705
10, 848`}</pre>
                <div styleName="center-action-button">
                    <Button
                        disabled={this.props.creator.isLoadingPreview}
                        data-purpose="confirm-preview"
                        onClick={this.onConfirmAndPreview}
                    >
                        {gettext('Continue & Preview')}
                    </Button>
                </div>
                <ConfirmModal
                    onCancel={this.onPreviewCancel}
                    onConfirm={this.onPreviewConfirm}
                    isOpen={this.props.creator.showPreviewConfirmation}
                >
                    {ninterpolate(
                        'Only %(current)s slide of %(total)s slides in the presentation have been used in the mashup.',
                        'Only %(current)s slides of %(total)s slides in the presentation have been used in the mashup.',
                        this.props.creator.parsedSlideTimestamps.length,
                        {
                            current: this.props.creator.parsedSlideTimestamps.length,
                            total: this.props.creator.numSlides,
                        },
                    )}
                </ConfirmModal>
            </div>
        );
    }
}
