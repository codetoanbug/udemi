import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {assetStatuses} from '../../../asset-library/constants';
import ItemIconButton from '../item-icon-button.react-component';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import './supplementary-asset.less';

@observer
export default class SupplementaryAsset extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        asset: PropTypes.object.isRequired,
        icon: PropTypes.node.isRequired,
        hideContentSummary: PropTypes.bool,
    };

    static defaultProps = {
        hideContentSummary: false,
    };

    @autobind
    onConfirmAndDelete() {
        this.props.curriculumItem.openDeleteSupplementaryAssetConfirmation(this.props.asset.id);
    }

    render() {
        const {curriculumItem, asset, icon, hideContentSummary} = this.props;
        return (
            <div className="ud-text-sm" styleName="supplementary-asset">
                {icon}
                <div styleName="flex">
                    <div styleName="ellipsis">
                        {asset.title}
                        {asset.status !== assetStatuses.processing &&
                            !hideContentSummary &&
                            ` (${asset.content_summary})`}
                        {asset.status === assetStatuses.processing && ` (${gettext('Processing')})`}
                        {asset.status === assetStatuses.failed && ` (${gettext('Broken')})`}
                    </div>
                </div>
                <ItemIconButton
                    iconType="delete"
                    alwaysShow={true}
                    data-purpose="delete-supplementary-asset-btn"
                    disabled={curriculumItem.isSaving}
                    onClick={this.onConfirmAndDelete}
                />
            </div>
        );
    }
}
