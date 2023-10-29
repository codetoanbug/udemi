import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {ToasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';
import udLink from 'utils/ud-link';

import {LEARNING_PATH_ERROR_MESSAGES, LEARNING_PATH_SUCCESS_MESSAGES} from './constants';

@inject('resourceContext')
@observer
export default class EditRequestLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    renderToaster(message, bodyMessage, isErrorToast = false) {
        return ToasterStore.addAlertBannerToast(
            {
                udStyle: isErrorToast ? 'error' : 'success',
                title: message,
                body: bodyMessage,
                showCta: false,
            },
            {
                autoDismiss: true,
                autoDismissTimeout: 5000,
            },
        );
    }

    @autobind
    async handleClick() {
        const {learningPath, window} = this.props;
        trackClickAction(this.props.resourceContext, 'Join as an editor', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });

        try {
            await learningPath.setPathEditorPermissions(true);
            window.location.href = udLink.to(learningPath.editUrl);
            this.renderToaster(
                LEARNING_PATH_SUCCESS_MESSAGES.EDIT_ACCESS_ACCEPTED_TITLE,
                LEARNING_PATH_SUCCESS_MESSAGES.EDIT_ACCESS_ACCEPTED_MESSAGE,
            );
        } catch (e) {
            this.renderToaster(LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_UPDATE_PERMISSION, '', true);
        }
    }

    render() {
        return (
            <ContextMenuItem
                icon={<EditIcon label={false} />}
                title={gettext('Join as an editor')}
                onClick={this.handleClick}
            />
        );
    }
}

EditRequestLearningPathMenuItem.shouldRender = function (props) {
    return props.learningPath.canRequestEditAccess && props.learningPath.isOrgLearningPath;
};
