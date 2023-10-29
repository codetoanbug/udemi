import {useI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import PeopleIcon from '@udemy/icons/dist/people.ud-icon';
import {Avatar, AvatarUser, DEFAULT_SRC_KEY, IconButton} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {ORGANIZATION_GROUP_CLASS} from 'organization-common/constants';

import styles from './user-and-group-pill.less';

export interface Entity extends AvatarUser {
    _class: string;
    num_users?: number;
    title?: string;
    email?: string;
}

export interface UserAndGroupPillProps {
    displayEmails?: boolean;
    onClose?: (obj: Entity) => void;
    entity: Entity;
    srcKey?: 'image_75x75' | 'image_125_H' | 'image_200_H';
    isSuggestionItem?: boolean;
}

const UserAndGroupPill = React.forwardRef<HTMLDivElement, UserAndGroupPillProps>(
    (
        {
            entity,
            onClose,
            displayEmails = false,
            srcKey = DEFAULT_SRC_KEY,
            isSuggestionItem = false,
        },
        ref,
    ) => {
        const {gettext} = useI18n();
        const isGroup = entity._class === ORGANIZATION_GROUP_CLASS;
        return (
            <div
                ref={ref}
                data-purpose={`user-and-group-pill-${entity._class}`}
                key={entity.id}
                className={classNames(
                    'user-and-group-pill',
                    styles.wrapper,
                    isGroup ? styles['wrapper-group'] : '',
                    isSuggestionItem ? styles['is-suggestion-item'] : '',
                )}
            >
                {
                    <Avatar
                        alt="DISPLAY_NAME"
                        size="small"
                        user={{
                            ...entity,
                            display_name: isGroup ? entity.title : entity.display_name,
                        }}
                        srcKey={srcKey}
                        className={isGroup ? 'ud-avatar-group' : ''}
                        lazy={false}
                        {...(isGroup
                            ? {
                                  icon: <PeopleIcon color="inherit" label={false} />,
                              }
                            : {})}
                    />
                }
                <div
                    className={classNames(styles['user-info'], {
                        [styles['no-close-button']]: !onClose,
                    })}
                >
                    <div data-purpose="display-name" className={`ud-heading-sm`}>
                        {isGroup
                            ? entity.title
                            : displayEmails && entity.email
                            ? entity.email
                            : entity.display_name}
                        {isGroup && (
                            <span
                                className={styles['user-info-count']}
                            >{` (${entity.num_users})`}</span>
                        )}
                    </div>
                </div>
                {!!onClose && (
                    <IconButton
                        data-purpose="close-button"
                        onClick={() => onClose?.(entity)}
                        udStyle="ghost"
                        size="small"
                    >
                        <CloseIcon
                            label={gettext('remove')}
                            color={`${isGroup ? 'info' : 'neutral'}`}
                        />
                    </IconButton>
                )}
            </div>
        );
    },
);

UserAndGroupPill.displayName = 'UserAndGroupPill';

// eslint-disable-next-line import/no-default-export
export default UserAndGroupPill;
