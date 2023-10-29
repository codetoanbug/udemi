import {Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {toLocaleDateString} from 'utils/date';

import './changelog-modal.less';

@inject('practiceTestStore', 'fullscreenStore')
@observer
export default class ChangelogModal extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    @autobind
    renderChangelogEntry(entry) {
        return (
            <div key={entry.number} styleName="changelog-entry" data-purpose="changelog-entry">
                <div className="ud-text-sm" styleName="version">
                    {interpolate(
                        gettext('Version %(versionNumber)s - %(date)s'),
                        {
                            versionNumber: entry.number,
                            date: toLocaleDateString(new Date(entry.date), {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        },
                        true,
                    )}
                </div>
                {entry.text}
            </div>
        );
    }

    render() {
        const modal = this.props.practiceTestStore.changelogModal;
        return (
            <Modal
                isOpen={modal.isOpen}
                onClose={this.props.practiceTestStore.hideChangelogModal}
                title={gettext('Updates')}
                getContainer={this.getOverlayContainer}
            >
                {modal.changelog.map(this.renderChangelogEntry)}
            </Modal>
        );
    }
}
