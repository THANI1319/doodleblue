const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access Denied: As a ${req.user.role}, you don't have permission to do this.` 
            });
        }
        next();
    };
};

module.exports = authorizeRole;