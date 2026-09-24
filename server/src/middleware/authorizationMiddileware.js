
const authorize = (...requiredPermissions) => {
    return (req, res, next) => {

        // Check user authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required!"
            });
        }

        // Check user role
        if (!req.user.role) {
            return res.status(403).json({
                success: false,
                message: "User role is not configured!"
            });
        }

        // Get user's permission codes
        const userPermissions = req.user.role.permissions.map(
            (permission) => permission.code
        );

        // Check required permissions
        const hasPermission = requiredPermissions.every(
            (permission) => userPermissions.includes(permission)
        );

        // Permission denied
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform operation!"
            });
        }

        next();
    };
};

module.exports = { authorize };

