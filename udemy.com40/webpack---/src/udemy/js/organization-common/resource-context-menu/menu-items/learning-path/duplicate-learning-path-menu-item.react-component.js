import DuplicateIcon from '@udemy/icons/dist/duplicate.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {ToasterStore} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class DuplicateLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    duplicateConfirmationModal() {
        return (
            <Modal
                isOpen={this.props.learningPath.isDuplicateConfirmationModalOpen}
                onClose={this.props.learningPath.closeDuplicateConfirmationModal}
                title={gettext('This may take a little while')}
            >
                {this.props.learningPath.duplicatePathResponseMessage}
                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={this.props.learningPath.closeDuplicateConfirmationModal}
                    >
                        {gettext('Close')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }

    @autobind
    handleClick() {
        trackClickAction(this.props.resourceContext, 'Duplicate', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
        this.props.learningPath.duplicate().catch((e) => {
            ToasterStore.addAlertBannerToast(
                {
                    udStyle: 'error',
                    title: e.message,
                    showCta: false,
                },
                {
                    autoDismiss: true,
                    autoDismissTimeout: 5000,
                },
            );
        });
    }

    render() {
        return (
            <div>
                <ContextMenuItem
                    icon={<DuplicateIcon label={false} />}
                    title={gettext('Duplicate')}
                    onClick={this.handleClick}
                />
                {this.duplicateConfirmationModal()}
            </div>
        );
    }
}

DuplicateLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.isOrgLearningPath;
};
