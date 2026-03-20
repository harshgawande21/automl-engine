/** Role-based permission checks */

const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    VIEWER: 'viewer',
};

const PERMISSIONS = {
    [ROLES.ADMIN]: ['read', 'write', 'delete', 'manage_users', 'train_model', 'predict', 'configure'],
    [ROLES.USER]: ['read', 'write', 'train_model', 'predict'],
    [ROLES.VIEWER]: ['read'],
};

export function hasPermission(role, permission) {
    const perms = PERMISSIONS[role];
    if (!perms) return false;
    return perms.includes(permission);
}

export function canTrainModel(role) {
    return hasPermission(role, 'train_model');
}

export function canPredict(role) {
    return hasPermission(role, 'predict');
}

export function canManageUsers(role) {
    return hasPermission(role, 'manage_users');
}

export { ROLES };

