import {withI18n} from '@udemy/i18n';
import {FormGroup, TextArea} from '@udemy/react-form-components';
import autosize from 'autosize';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';

import ResourceAttachments from './resource-attachments.react-component';
import styles from './resource-preview.less';

@observer
class InternalResourcePreview extends Component {
    static propTypes = {
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        shareData: PropTypes.object.isRequired,
        onChangeMessageCallback: PropTypes.func.isRequired,
        defaultMessage: PropTypes.string.isRequired,
        context: PropTypes.string,
        className: PropTypes.string,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        context: undefined,
        className: '',
    };

    constructor(props) {
        super(props);
        this.textAreaRef = React.createRef();
    }

    componentDidMount() {
        autosize(this.textAreaRef.current);
    }

    render() {
        const {gettext} = this.props;
        return (
            <FormGroup label={gettext('Write a message')} className={styles['message-label']}>
                <div className={classNames(this.props.className, styles['message-wrapper'])}>
                    <TextArea
                        rows="4"
                        className={classNames(
                            'ud-text-input ud-text-input-large ud-text-md',
                            styles.message,
                        )}
                        onChange={this.props.onChangeMessageCallback}
                        defaultValue={this.props.defaultMessage}
                        ref={this.textAreaRef}
                    />
                    <ResourceAttachments
                        resourceType={this.props.resourceType}
                        shareData={this.props.shareData}
                        context={this.props.context}
                    />
                </div>
            </FormGroup>
        );
    }
}

const ResourcePreview = withI18n(InternalResourcePreview);
export default ResourcePreview;
