import {noop} from '@udemy/shared-utils';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {SLACK} from 'organization-common/ufb-social-share/constants';

import {PREVIEW_COMPONENTS, SHARE_TO_SLACK_PREVIEW_COMPONENTS} from './constants';
import styles from './resource-preview.less';

@observer
export default class ResourceAttachments extends Component {
    static propTypes = {
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        shareData: PropTypes.object.isRequired,
        onChangeMessageCallback: PropTypes.func,
        defaultMessage: PropTypes.string,
        displayMessageFieldWrapper: PropTypes.bool,
        context: PropTypes.string,
    };

    static defaultProps = {
        onChangeMessageCallback: noop,
        displayMessageFieldWrapper: true,
        defaultMessage: '',
        context: undefined,
    };

    get previewComponent() {
        if (this.props.context === SLACK) {
            return SHARE_TO_SLACK_PREVIEW_COMPONENTS[this.props.resourceType];
        }
        return PREVIEW_COMPONENTS[this.props.resourceType];
    }

    render() {
        const PreviewComponent = this.previewComponent;
        const attachments = this.props.shareData.map((data, index) => {
            return (
                <div className={styles.attachment} key={index} data-purpose="message-attachment">
                    <div className={styles.attachment__body}>
                        <PreviewComponent data={data} />
                    </div>
                </div>
            );
        });
        return <div className={styles['attachment-wrapper']}>{attachments}</div>;
    }
}
