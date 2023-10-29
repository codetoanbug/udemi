import DownloadableResourceIcon from '@udemy/icons/dist/downloadable-resource.ud-icon';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {ConfirmModal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import SupplementaryAsset from './supplementary-asset.react-component';
import './lecture-editor.less';

const SupplementaryAssetsSection = observer(
    ({curriculumItem, assets, title, icon, purpose, hideContentSummary}) => {
        if (assets.length === 0) {
            return null;
        }
        return (
            <div styleName="edit-content-row supplementary-asset-row" data-purpose={purpose}>
                <h4 className="ud-heading-sm">{title}</h4>
                {assets.map((asset) => {
                    return (
                        <SupplementaryAsset
                            key={asset.id}
                            curriculumItem={curriculumItem}
                            asset={asset}
                            icon={icon}
                            hideContentSummary={hideContentSummary}
                        />
                    );
                })}
            </div>
        );
    },
);

@observer
export default class SupplementaryAssetsEditor extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
    };

    @autobind
    onDeleteSupplementaryAssetConfirm() {
        this.props.curriculumItem.deleteSupplementaryAsset().catch(handleUnexpectedAPIError);
    }

    render() {
        if (this.props.curriculumItem.supplementary_assets.length === 0) {
            return null;
        }
        const classified = this.props.curriculumItem.classifiedSupplementaryAssets;
        return (
            <>
                <SupplementaryAssetsSection
                    curriculumItem={this.props.curriculumItem}
                    assets={classified.interactive}
                    purpose="source-code-section"
                    title={gettext('Source Code')}
                    icon={<DownloadableResourceIcon label={false} size="xsmall" />}
                />
                <SupplementaryAssetsSection
                    curriculumItem={this.props.curriculumItem}
                    assets={classified.downloadable}
                    purpose="downloadable-files-section"
                    title={gettext('Downloadable materials')}
                    icon={<DownloadableResourceIcon label={false} size="xsmall" />}
                />
                <SupplementaryAssetsSection
                    curriculumItem={this.props.curriculumItem}
                    assets={classified.external}
                    purpose="external-links-section"
                    hideContentSummary={true}
                    title={gettext('External Resources')}
                    icon={<OpenInNewIcon label={false} size="xsmall" />}
                />
                <ConfirmModal
                    onCancel={this.props.curriculumItem.closeDeleteSupplementaryAssetConfirmation}
                    onConfirm={this.onDeleteSupplementaryAssetConfirm}
                    isOpen={this.props.curriculumItem.toBeDeletedSupplementaryAssetId !== null}
                >
                    {gettext(
                        'You are about to remove a resource. Are you sure you want to continue?',
                    )}
                </ConfirmModal>
            </>
        );
    }
}
