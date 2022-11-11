import { check, validationResult } from "express-validator";

const registerValidations = () => [
    check('first_name').trim().exists().isLength({min: 2}).withMessage("Invalid First Name"),
    check('last_name').trim().exists().isLength({min: 2}).withMessage("Invalid Last Name"),
    check('email').trim().exists().isEmail().withMessage("Invalid Email Address"),
    check('password').exists().isLength({min: 4}).withMessage("Password must be between 4-16 characters"),
    check('password')
        .custom(async (password, {req}) => { if(password !== req.body.confirm_password) throw new Error() })
        .withMessage("Password and Confirm Password doesnt match"),
];

const loginValidations = () => [
    check('email').trim().exists().isEmail().withMessage("Invalid Email Address"),
    check('password').exists().isLength({min: 4}).withMessage("Password must be between 4-16 characters")
];

const filterValidations = (req, res, next) => {
    let result = validationResult(req);
    if(result.errors.length){
        let error = result.errors.map(err => { return err.msg });
        res.json({status: false, result: {}, error});
    }
    else{
        next();
    }
}

module.exports = {
    register: [registerValidations(), filterValidations],
    login: [loginValidations(), filterValidations]
};