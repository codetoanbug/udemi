export default function userHasPermission(user, permissionCode) {
    if (!user.organization_permissions) {
        return false;
    }

    return user.organization_permissions
        .map((permission) => {
            return permission.permission;
        })
        .includes(permissionCode);
}
