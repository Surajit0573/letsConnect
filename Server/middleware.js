if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
  }
const jwt = require('jsonwebtoken');
const ExpressError = require("./utils/ExpressError.js");
const {userSchema,profileSchema } = require("./schemaValidation.js");
const jwtSecret=process.env.JWT_SECRET;
const User = require("./models/user.js");

module.exports.varifyJWT= async(req,res,next)=>{
    if (!req.cookies.token) {
        return res.status(401).json({ message: "You are not logged in", ok: false, redirect:'/login' });
    }
    const token = req.cookies.token;
    if (!token||token.length==0) {
        return res.status(401).json({ message: "You are not logged in", ok: false,redirect:'/login' });
    }
    try {
        const decoded = jwt.verify(token,jwtSecret);
        const user =await User.findById(decoded.id);
        const isVerified = user.verify;
        if(!isVerified){
            return res.status(401).json({message:"Your Email is not verified",ok:false,redirect:'/login'})
        }
        res.payload = decoded;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ message:"Something went Wrong in varification", ok: false,redirect:null});
    }
}

module.exports.verifyEmail= async(req,res,next)=>{
    if (!req.cookies.token) {
        return res.status(401).json({ message: "You have to signup first", ok: false, redirect:'/signup' });
    }
    const token = req.cookies.token;
    if (!token||token.length==0) {
        return res.status(401).json({ message: "You have to signup first", ok: false,redirect:'/signup' });
    }
    try {
        const decoded = jwt.verify(token,jwtSecret);
        const user =await User.findById(decoded.id);
        const isVerified = user.verify;
        if(isVerified){
            return res.status(401).json({message:"this email is already registered",ok:false,redirect:'/login'});
        }
        res.payload = decoded;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ message:"Something went Wrong in varification", ok: false,redirect:null});
    }
}


//User Schema Validation
module.exports.validateuser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        console.error(error);
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Profile Schema Validation
module.exports.validateprofile = (req, res, next) => {
    let { error } = profileSchema.validate(req.body);
    if (error) {
        console.error(error);
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};