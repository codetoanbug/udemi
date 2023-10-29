import {useI18n} from '@udemy/i18n';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import CourseCard from 'base-components/course-card/course-card.react-component';
import LearningPathCard from 'organization-home/components/learning-path-card/learning-path-card.react-component';
import ConfirmationModal from 'tapen/experimentation-platform-admin/common/components/confirmation-modal.react-component';

import {CertificationCardProps, CertificationStoreProp} from '../common/types';
import {CertificationCardMenuMobxStore} from './certification-card-menu.mobx-store';
import style from './options-menu.less';

interface CertificationCardMenuProps extends CertificationCardProps {
    cardOptionStore: CertificationCardMenuMobxStore;
    handleOnClose?: () => Promise<void>;
    handleOnConfirm?: () => Promise<void>;
    optionItems?: () => React.ReactNodeArray;
}

const CertificationCardMenuComponent = (
    props: CertificationCardMenuProps & CertificationStoreProp,
) => {
    const {gettext} = useI18n();

    const {cardOptionStore, certificationStore} = props;

    const modalTitle = gettext('Unenroll from all learning content related to this certificate');

    const modalBody = (
        <div className={classNames(style['modal-menu'])} data-purpose={'modal-body'}>
            <div className={classNames('ud-text-sm', style['modal-text'])}>
                {gettext(
                    'By selecting this option, you agree to unenroll from all the learning content related to this certification preparation.',
                )}
            </div>
            <div className={classNames('ud-heading-sm', style['modal-text'])}>
                {gettext('Udemy paths to unenroll:')}
            </div>
            <div className={classNames(style['modal-course-container'])}>
                {cardOptionStore.enrolledLearningPaths.length > 0 ? (
                    cardOptionStore.enrolledLearningPaths.map((learningPath) => {
                        return (
                            <LearningPathCard
                                learningPath={learningPath}
                                size={'small'}
                                className={classNames(style['modal-learning-path-card'])}
                                key={learningPath.id}
                            />
                        );
                    })
                ) : (
                    <div
                        className={classNames('ud-text-sm', style['modal-text'])}
                        data-purpose={'no-paths-text'}
                    >
                        {gettext("You don't have any learning paths enrolled for this certificate")}
                    </div>
                )}
            </div>
            <div className={classNames('ud-heading-sm', style['modal-text'])}>
                {gettext('Courses to unenroll:')}
            </div>
            <div className={classNames(style['modal-course-container'])}>
                {cardOptionStore.enrolledCourseList.length > 0 ? (
                    cardOptionStore.enrolledCourseList.map((course) => {
                        return (
                            <CourseCard
                                className={classNames(style['modal-course-card'])}
                                size={'small'}
                                course={course}
                                key={course.id}
                            />
                        );
                    })
                ) : (
                    <div
                        className={classNames('ud-text-sm', style['modal-text'])}
                        data-purpose={'no-course-text'}
                    >
                        {gettext("You don't have any courses enrolled for this certificate")}
                    </div>
                )}
            </div>
        </div>
    );

    const openUnEnrollmentModal = () => {
        cardOptionStore.fetchEnrolledLearningProductList().then(() => {
            cardOptionStore.openUnEnrollmentModal();
        });
    };

    const handleOnCloseModal = async () => {
        props.handleOnClose
            ? await props.handleOnClose()
            : cardOptionStore.closeUnEnrollmentModal();
    };

    const handleOnConfirmModal = async () => {
        cardOptionStore.setIsLoading(true);
        await cardOptionStore.unEnrollFromLearningProducts();

        cardOptionStore.closeUnEnrollmentModal();
        await certificationStore?.fetchPreparationCertifications();

        props.handleOnConfirm && (await props.handleOnConfirm());
    };

    const defaultOptionItems = () => {
        return [
            <Dropdown.MenuItem
                key="unenroll"
                data-purpose="unenroll-from-course"
                onClick={openUnEnrollmentModal}
                icon={<DeleteIcon size={'small'} label={gettext('Unenroll')} />}
            >
                <div className={classNames('ud-text-xs')}>{gettext('Unenroll')}</div>
            </Dropdown.MenuItem>,
        ];
    };

    const renderBadgingDropdown = () => {
        return (
            <Dropdown.Menu>
                {props.optionItems ? props.optionItems() : defaultOptionItems()}
            </Dropdown.Menu>
        );
    };

    return (
        <>
            <Dropdown
                placement="bottom-end"
                trigger={
                    <IconButton size="small" udStyle="white-solid">
                        <MoreIcon label={gettext('Course options')} />
                    </IconButton>
                }
                data-purpose="badge-options-menu"
            >
                <div className={classNames(style['menu-container'])}>{renderBadgingDropdown()}</div>
            </Dropdown>
            {cardOptionStore.isLoading ? (
                <Modal loading={true} title={''} isOpen={true} />
            ) : (
                <ConfirmationModal
                    onClose={handleOnCloseModal}
                    onConfirm={handleOnConfirmModal}
                    isOpen={cardOptionStore.enrollmentModalStatus}
                    title={modalTitle}
                    acceptText={gettext('Delete and unenroll')}
                    className={classNames(style['modal-menu'])}
                    data-purpose="unenroll-from-course-modal"
                >
                    {modalBody}
                </ConfirmationModal>
            )}
        </>
    );
};

export const CertificationCardOption = observer(CertificationCardMenuComponent);
