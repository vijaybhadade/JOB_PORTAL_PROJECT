//fetch current user information
const getCurrentUser = async (req, res, next) => {
  try {
    //user information of currentUser
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        permission: user.role.permissions.map((permission) => permission.code),
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

//fetch all users

const getUsers= async (req, res, next) => {
  try {
    const users = await require("../models/User")
      .find()
      .populate("role", "name")
      .select("firstName lastName email phone role isActive createAt")
      .sort({
        createAt: -1,
      });
    res.status(200).json({
      succuss: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


module.exports= {getCurrentUser,getUsers};