import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import getConfigData from 'utils/get-config-data';

import ExportLecturesLink from './export-lectures-link.react-component';
import UploadBulk from './upload-bulk/upload-bulk.react-component';

const udConfig = getConfigData();

@observer
export default class CurriculumHeader extends Component {
    static propTypes = {
        exportLecturesUrl: PropTypes.string,
        pageStore: PropTypes.object.isRequired,
    };

    static defaultProps = {
        exportLecturesUrl: undefined,
    };

    @autobind
    async onClickPublish() {
        await this.props.pageStore.publishChanges();
    }

    renderActionButtons() {
        const isUFB = udConfig.brand.has_organization;
        const exportLecturesUrl = this.props.exportLecturesUrl;
        const isCourseVersionEnabled = this.props.pageStore.isCourseVersionEnabled;
        return (
            <>
                {exportLecturesUrl ? <ExportLecturesLink popupUrl={exportLecturesUrl} /> : null}
                {!isCourseVersionEnabled && (
                    <UploadBulk acceptAudio={isUFB} acceptPresentation={isUFB} />
                )}
                {isCourseVersionEnabled && (
                    <>
                        <Button className="ud-link-neutral ud-link-underline" udStyle="ghost">
                            {gettext('Preview changes')}
                        </Button>
                        <Button onClick={this.onClickPublish}>{gettext('Publish changes')}</Button>
                    </>
                )}
            </>
        );
    }

    render() {
        return (
            <SubHeader title={gettext('Curriculum')} actionButtons={this.renderActionButtons()} />
        );
    }
}
