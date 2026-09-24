const allowRoles=(...allow)=>{
    return (req,res,next)=>{
        //check roles user  not valid 
        if(!req.user)
        {
            return res.status(401).json({
                succuss:false,
                message:"Authentication required!"
            });
        }


        //fetch username and role check enter or not
        const userRole=req.user?.name;

        //check user role assign but not permission to perform perticular tast.
        if(!userRole)
        {
            return res.status(403).json({
                succuss:false,
                message:"User role is not configured!"
            })
        }

        //checking role is include in allowsrole then not return response
        if(!allowRoles.includes(userRole))
        {
            return res.status(403).json({
                succuss:false,
                message:"Access denied!"
            }) 
        }
         next();
    };
};

module.exports= {allowRoles};