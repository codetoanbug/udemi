import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ASSET_TYPE} from 'asset/constants';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import requires from '../../registry/requires';
import TextViewer from './text-viewer.react-component';
import './text-viewer.less';

@requires('lectureViewStore')
@observer
export default class UnavailableViewer extends React.Component {
    static propTypes = {
        lectureViewStore: PropTypes.object.isRequired,
    };

    @observable isCompleting = false;

    @autobind
    @action
    completeLecture() {
        const {lecture} = this.props.lectureViewStore;
        this.isCompleting = true;
        const isDownloaded = [ASSET_TYPE.EBOOK, ASSET_TYPE.FILE].includes(lecture.asset.type);
        lecture.markAsComplete(isDownloaded).then(
            action(() => {
                this.isCompleting = false;
            }),
        );
        this.props.lectureViewStore.fireLectureCompletedEvent();
    }

    renderActionText() {
        const {lecture} = this.props.lectureViewStore;
        if (!lecture.asset) {
            // We're in the instructor preview for a lecture with no asset added yet.
            return gettext('Attention: This part of the course has nothing to show right now.');
        }
        if (lecture.isMissingAsset) {
            if (lecture.asset.type === ASSET_TYPE.UPCOMING) {
                return gettext('The instructor has not added content to this lecture.');
            }
            return gettext(
                'The instructor is updating content for this lecture. Please try again later or contact your instructor if this screen persists.',
            );
        }
        if (lecture.description) {
            return '';
        }
        const assetActions = {
            [ASSET_TYPE.IFRAME]: gettext(
                'Visit and review the website provided by your instructor for this lecture.',
            ),
            [ASSET_TYPE.IMPORT_CONTENT]: gettext(
                'Visit and review the website provided by your instructor for this lecture.',
            ),
            [ASSET_TYPE.EBOOK]: gettext(
                'Download and review the PDF provided by your instructor for this lecture.',
            ),
            [ASSET_TYPE.FILE]: gettext(
                'Download and review the file provided by your instructor for this lecture.',
            ),
        };
        return assetActions[lecture.asset.type] || '';
    }

    renderActionButton() {
        const {lecture} = this.props.lectureViewStore;
        const {asset} = lecture;
        if (!asset) {
            return null;
        }
        const linkProps = {
            disabled: this.isCompleting,
        };
        if ([ASSET_TYPE.EBOOK, ASSET_TYPE.FILE].includes(asset.type)) {
            linkProps.href = asset.downloadUrl;
        } else if (lecture.isMissingAsset) {
            if (lecture.isCompleted) {
                linkProps.disabled = true;
            }
        } else if (asset.externalUrl) {
            linkProps.href = asset.externalUrl;
        }
        let buttonLabel;
        if (lecture.isMissingAsset) {
            buttonLabel = lecture.isCompleted
                ? gettext('Marked as complete')
                : gettext('Mark as complete');
        } else {
            const labelMapping = {
                [ASSET_TYPE.EBOOK]: gettext('Download PDF'),
                [ASSET_TYPE.FILE]: gettext('Download file'),
                [ASSET_TYPE.IFRAME]: gettext('Open in new window'),
                [ASSET_TYPE.IMPORT_CONTENT]: gettext('Open in new window'),
            };
            buttonLabel = labelMapping[asset.type];
        }
        return (
            <Button
                udStyle="secondary"
                data-purpose="action-button"
                {...linkProps}
                componentClass={linkProps.href ? 'a' : 'button'}
                target={linkProps.href ? '_blank' : null}
                rel={linkProps.href ? 'noopener noreferrer' : null}
                onClick={this.completeLecture}
                styleName="action-button"
            >
                {buttonLabel}
            </Button>
        );
    }

    render() {
        const {lecture} = this.props.lectureViewStore;
        const actionText = this.renderActionText();
        return (
            <TextViewer>
                {lecture.description && (
                    <div
                        styleName="description"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'unavailable-viewer:description',
                            html: lecture.description,
                            dataPurpose: 'description',
                        })}
                    />
                )}
                {actionText && (
                    <div styleName="description" data-purpose="action-text">
                        {actionText}
                    </div>
                )}
                {this.renderActionButton()}
            </TextViewer>
        );
    }
}
