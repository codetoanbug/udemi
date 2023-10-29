import {Avatar, AvatarUser, AvatarProps} from '@udemy/react-core-components';
import React from 'react';

import styles from './avatar-group.module.less';

/** React prop interface for `AvatarGroup` */
export interface AvatarGroupProps {
    /** List of users to display avatars for */
    users: AvatarUser[];
    /**
     * Maximum number of items (users) to display
     *
     * @defaultValue 4 in `AvatarGroup`
     * */
    maxDisplayItems?: number;
    /** Props to customize the  rendered `Avatar` components */
    avatarProps?: Omit<AvatarProps, 'user'>;
}

/**
 * AvatarGroup
 *
 * Displays a group of avatars for a list of users, with an overflow indicator if the number of avatars exceeds the `maxDisplayItems`.
 */
export const AvatarGroup = ({
    users,
    maxDisplayItems = 4,
    avatarProps = {alt: 'DISPLAY_NAME'} as AvatarProps,
}: AvatarGroupProps) => {
    if (users.length === 0) {
        return null;
    }

    return (
        <div className={styles.group}>
            {users.slice(0, maxDisplayItems).map((user) => (
                <div key={user.id} className={styles.wrapper}>
                    <Avatar className={styles.element} user={user} {...avatarProps} />
                </div>
            ))}
            {/* Users beyond display limit are rendered as a single anonymous Avatar */}
            {users.length > maxDisplayItems && (
                <div className={styles.wrapper}>
                    <Avatar
                        className={styles.element}
                        user={{
                            id: 0,
                            image_75x75: 'anonymous',
                            display_name: '',
                            initials: `+${users.length - maxDisplayItems}`,
                        }}
                        {...avatarProps}
                        srcKey={'image_75x75'}
                    />
                </div>
            )}
        </div>
    );
};
