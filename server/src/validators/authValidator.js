const { body, validationResult } = require("express-validator");


//validation register fields

const registerValidation=[
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required!")
        .isLength({min:2,max:20})
        .withMessage("First name must be between 2 and 20 charecter!"),
    
         body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required!")
        .isLength({min:2,max:20})
        .withMessage("Last name must be between 2 and 20 charecter!"),

         body("email")
        .trim()
        .notEmpty()
        .withMessage("Email  is required!")
        .withMessage("First name must be between 2 and 20 charecter!")
        .normalizeEmail(),
        
         body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required!")
        .isLength({min:6,max:20})
        .withMessage("Password must be between 6 and 20 charecter!"),

         body("phone")
        .trim()
        .notEmpty()
        .withMessage("phone number  is required!")
        .isLength({max:13})
        .withMessage("Phone number cannot exceed 13 numbers"),

    ];    

    //login validation fields
    const loginValidation=[
         body("email")
        .trim()
        .notEmpty()
        .withMessage("Email  is required!")
        .withMessage("First name must be between 2 and 20 charecter!")
        .normalizeEmail(),

         body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required!"),
    ];


    //validate request
    const validateRequest=(req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty)
        {
          return res.status(400).json({
            success:false,
            message:"Validation failed",
            errors:errors.array().map((err)=>(
                {
                  field:err.path,
                  message:err.msg
                }
            )),
          });
        }
        next();

    };


    module.exports={
        registerValidation,
        loginValidation,
        validateRequest
    }