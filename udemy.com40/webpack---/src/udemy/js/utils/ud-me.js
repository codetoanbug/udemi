import createUDProxy from 'utils/create-ud-proxy';

import {USER_ROLES} from '../organization-common/constants';

const udMe = createUDProxy('me', 'meProperties');

transformUDMe();

export default udMe;

export function transformUDMe() {
    if (UD.me && !UD.me.isLoading && UD.me.organization) {
        Object.assign(UD.me.organization, {
            isOwner: UD.me.organization.role === USER_ROLES.OWNER,
            isAdmin: UD.me.organization.role === USER_ROLES.ADMIN,
            isGroupAdmin: UD.me.organization.role === USER_ROLES.GROUP_ADMIN,
            isStudent: UD.me.organization.role === USER_ROLES.STUDENT,
            hasPermission: (permissionCode) => {
                if (!UD.me.organization.permissions) {
                    return false;
                }

                return udMe.organization.permissions
                    .map((permission) => {
                        return permission.permission;
                    })
                    .includes(permissionCode);
            },
        });
    }
}
