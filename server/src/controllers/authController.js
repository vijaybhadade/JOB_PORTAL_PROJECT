const authService = require("../services/authService");


const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "Candidate registered successfully",
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser({
            ...req.body,
            userAgent: req.get("user-agent"),
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: "Candidate logged in successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const refresh = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken({
            refreshToken: req.body.refreshToken,
            userAgent: req.get("user-agent"),
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const logout = async (req, res, next) => {
    try {
        await authService.logoutUser({
            refreshToken: req.body.refreshToken,
        });

        res.status(200).json({
            success: true,
            message: "Candidate logged out successfully",
            data: {
                user: null
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
    refresh,
    logout
};