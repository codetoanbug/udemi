import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button, Link} from '@udemy/react-core-components';
import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isBadgingCertPrepEnabled} from 'open-badges/common/utils/utils';
import serverOrClient from 'utils/server-or-client';

import LearningPathStore from '../../learning-path.mobx-store';
import styles from './info-panel.less';

export const SavingIndicator = ({isSaved}) => isSaved && <span>{gettext('Saved')}</span>;

SavingIndicator.propTypes = {
    isSaved: PropTypes.bool.isRequired,
};

export const EnrolledIndicator = () => (
    <div
        className={classNames('ud-text-bold', styles['enrolled-text'])}
        data-purpose="enrolled-text"
    >
        <TickIcon color="inherit" size="medium" label={false} />
        {gettext('Enrolled')}
    </div>
);

export const EnrollButton = observer(({learningPathStore}) => {
    const {addEnrollmentToPath, isUserEnrolled, isUserEditor} = learningPathStore.learningPath;

    const certificateEnrollmentToastBody = (certification) => {
        return (
            <>
                <div>
                    <div className="ud-text-sm">
                        {interpolate(
                            gettext(
                                'The learning path has been added to your %(certificationName)s preparation.',
                            ),
                            {
                                certificationName: certification.name,
                            },
                            true,
                        )}
                    </div>
                </div>

                <Link
                    to={`/home/my-courses/certifications${serverOrClient.global.location.search}`}
                >
                    {gettext('View certification preparation')}
                </Link>
            </>
        );
    };

    const showCertificationToast = async () => {
        const certifications = await learningPathStore.fetchCertifications();
        if (certifications.length === 0) {
            return;
        }
        const firstCertification = certifications[0];

        const toastProps = {
            autoDismiss: true,
            autoDismissTimeout: 5000,
            toastKey: learningPathStore.learningPath.id,
        };
        toasterStore.addAlertBannerToast(
            {
                udStyle: 'information',
                title: gettext('Udemy path added to your certification preparation'),
                body: certificateEnrollmentToastBody(firstCertification),
                showCta: false,
            },
            toastProps,
        );
    };

    const handleClick = () => {
        addEnrollmentToPath({uiRegion: 'path_enroll_button'});
        if (isBadgingCertPrepEnabled()) {
            showCertificationToast();
        }
    };

    return isUserEnrolled || isUserEditor ? null : (
        <Button
            udStyle="secondary"
            onClick={handleClick}
            size="medium"
            data-purpose="enroll-button"
        >
            {gettext('Enroll')}
        </Button>
    );
});

EnrollButton.propTypes = {
    learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
};

@inject('learningPathStore', 'actionCallbacks', 'resourceContextMenu')
@observer
export default class Actions extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        actionCallbacks: PropTypes.shape({
            handleDoneEditingClick: PropTypes.func,
        }),
        resourceContextMenu: PropTypes.object,
    };

    static defaultProps = {
        actionCallbacks: {},
        resourceContextMenu: {},
    };

    renderEditMode() {
        const {actionCallbacks, learningPathStore} = this.props;
        const {isSaved, isSaving, showNewLearningPathPageUIEnabled} = learningPathStore;
        return (
            <div
                className={classNames({
                    [styles.actions]: !showNewLearningPathPageUIEnabled,
                    [styles['actions-v2']]: showNewLearningPathPageUIEnabled,
                })}
            >
                <SavingIndicator isSaved={isSaved} />
                <Button
                    size="medium"
                    onClick={actionCallbacks.handleDoneEditingClick}
                    disabled={isSaving}
                    data-purpose="done-button"
                >
                    {isSaving ? gettext('Saving ...') : gettext('Done')}
                </Button>
                {this.renderActionsContextMenu()}
            </div>
        );
    }

    renderActionsContextMenu() {
        const props = {placement: 'top-end'};

        const contextMenu = this.props.resourceContextMenu.getLearningPathContextMenu(
            this.props.learningPathStore.learningPath,
            this.props.learningPathStore.isMobileViewportSize ? props : {},
        );

        return <div>{contextMenu}</div>;
    }

    renderViewMode() {
        const {
            learningPath,
            isMobileViewportSize,
            showNewLearningPathPageUIEnabled,
        } = this.props.learningPathStore;

        const {isUserEditor, isUserEnrolled} = learningPath;
        const shouldShowEnrolledIndicator =
            isUserEnrolled &&
            (!isMobileViewportSize || !isUserEditor || showNewLearningPathPageUIEnabled);

        return (
            <div
                className={classNames({
                    [styles.actions]: !showNewLearningPathPageUIEnabled,
                    [styles['actions-v2']]: showNewLearningPathPageUIEnabled,
                })}
            >
                {shouldShowEnrolledIndicator && <EnrolledIndicator />}
                {isUserEditor ? (
                    <Button
                        componentClass={Link}
                        to={learningPath.editUrl}
                        data-purpose="edit-learning-path"
                        size="medium"
                    >
                        {gettext('Edit')}
                    </Button>
                ) : (
                    <EnrollButton learningPathStore={this.props.learningPathStore} />
                )}
                {this.renderActionsContextMenu()}
            </div>
        );
    }

    render() {
        return this.props.learningPathStore.isEditModeEnabled
            ? this.renderEditMode()
            : this.renderViewMode();
    }
}
