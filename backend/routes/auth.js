const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectdb');
const User = require("../models/User");
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt=require("bcryptjs");
let JWT_SECRET="The quick brown fox jumps over the lazy dog";
const JWT=require("jsonwebtoken");
const getuserdetails = require('../middleware/getuserdetails');
const getdoctordetails = require('../middleware/getdoctordetails');
const Doctor = require('../models/Doctor');

router.use((req, res, next) => {
    next();
})

// Check whether there exist user if not create one with provided details --No Login required
router.post("/createuser",
    [   
        body('name').trim().notEmpty().isLength({ min: 5 }).escape(),
        body("email").trim().notEmpty().isEmail().escape(),
        body("password").notEmpty().isLength({ min: 8 , max:15 }).escape()
    ], 
    async (req, res) => {
        // Verifying the validations and sanitizers
        let errors=validationResult(req);
        console.log(req.body);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).send(errors);
        }
        // Validations are satisfied and collecting the matched data
        const data=matchedData(req);
        try {
            connectDb();
            // Retrieve a user, if exist with provided email
            let user=await User.findOne({"email":data.email});
            if(user)
            {
                return res.status(400).send({success,message:"User Already exists with this email. Please Login"});
            }
            // Hashing the password
            const securedPassword=await bcrypt.hash(data.password,bcrypt.genSaltSync(10))
            // Creating a new user
            let newuser=await User.create({
                name: data.name,
                email: data.email,
                password: securedPassword
            })
            // Creating a payload for signing the Json web token 
            const payload={
                user:{
                    id:newuser.id
                }
            }
            // Signing the Json web token
            JWT_SECRET="The quick brown fox jumps over the lazy dog"
            const authtoken=JWT.sign(payload,JWT_SECRET);
            success=true;
            res.status(200).send({success,authtoken,message:"Account Created Successfully."});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    
    }
)


// Check whether the user can be logged in or not --No Login required
router.post("/userlogin",
    [
        body("email","Please enter a valid email").trim().notEmpty().isEmail().escape(),
        body("password").notEmpty().isLength({ min: 8 , max:12 }).escape()
    ],
    async (req, res) => {
        // Verifying the validations and sanitizers
        let errors=validationResult(req);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).send(errors);
        }
        // Validations are satisfied and collecting the matched data
        const data=matchedData(req);
        try {
            connectDb();

            // Check whether the user exist with the provided email
            let user=await User.findOne({"email":data.email});
            if(!user)
            {
                return res.status(400).json({success,message:"Please enter vaild credentials."});
            }

            // Check if the password for the user matches
            let isPasswordMatched= await bcrypt.compare(req.body.password,user.password);
            if(!isPasswordMatched){
                return res.status(401).json({success,message:"Please enter vaild credentials."});
            }
             // Creating a payload for signing the Json web token 
            const payload={
                user:{
                    id:user.id
                }
            }
            // Signing the Json web token
            JWT_SECRET="The quick brown fox jumps over the lazy dog"
            const authtoken=JWT.sign(payload,JWT_SECRET);
            success=true;
            res.status(200).send({success,authtoken,message:"Logged in successfully"});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    }
)

// Get the logged in user details from the database
router.post("/getuser",getuserdetails,async(req,res)=>{
    // Getting the user id from the middleware i.e. getuserdetails.js
    let userid=req.user.id;
    connectDb();
    let user=await User.findById(userid).select("-password");
    res.json(user)
})


// Creating a doctor
router.post("/createdoctor",
    [   
        body('name').trim().notEmpty().isLength({ min: 5 }).escape(),
        body("specialist").notEmpty().isLength({min:5}).escape(),
        body("hospital").notEmpty().isLength({min:5}).escape(),
        body("mobile").notEmpty().isLength({min:10}).escape(),
        body("location").notEmpty().isLength({min:5}).escape(),
        body("email").trim().notEmpty().isEmail().escape(),
        body("password").notEmpty().isLength({ min: 8 , max:15 }).escape(),
    ], 
    async (req, res) => {
        // Verifying the validations and sanitizers
        let errors=validationResult(req);
        console.log(req.body);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).send(errors);
        }
        // Validations are satisfied and collecting the matched data
        const data=matchedData(req);
        try {
            connectDb();
            // Retrieve a user, if exist with provided email
            let doctor=await Doctor.findOne({"email":data.email});
            if(doctor)
            {
                return res.status(400).send({success,message:"User Already exists with this email. Please Login"});
            }
            // Hashing the password
            const securedPassword=await bcrypt.hash(data.password,bcrypt.genSaltSync(10))
            // Creating a new user
            let newdoctor=await Doctor.create({
                name: data.name,
                specialist:data.specialist,
                hospital:data.hospital,
                mobile:data.mobile,
                location:data.location,
                email: data.email,
                password: securedPassword
            })
            // Creating a payload for signing the Json web token 
            const payload={
                doctor:{
                    id:newdoctor.id
                }
            }
            // Signing the Json web token
            JWT_SECRET="jumps over the lazy dog The quick brown fox";
            const authtoken=JWT.sign(payload,JWT_SECRET);
            success=true;
            res.status(200).send({success,authtoken,message:"Account Created Successfully."});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    
    }
)


// Check whether the doctor can be logged in or not --No Login required
router.post("/doctorlogin",
    [
        body("email","Please enter a valid email").trim().notEmpty().isEmail().escape(),
        body("password").notEmpty().isLength({ min: 8 , max:12 }).escape()
    ],
    async (req, res) => {
        // Verifying the validations and sanitizers
        let errors=validationResult(req);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).send(errors);
        }
        // Validations are satisfied and collecting the matched data
        const data=matchedData(req);
        try {
            connectDb();

            // Check whether the user exist with the provided email
            let doctor=await Doctor.findOne({"email":data.email});
            if(!doctor)
            {
                return res.status(400).json({success,message:"Please enter vaild credentials."});
            }

            // Check if the password for the user matches
            let isPasswordMatched= await bcrypt.compare(data.password,doctor.password);
            if(!isPasswordMatched){
                return res.status(401).json({success,message:"Please enter vaild credentials."});
            }
             // Creating a payload for signing the Json web token 
            const payload={
                doctor:{
                    id:doctor.id
                }
            }
            // Signing the Json web token
            JWT_SECRET="jumps over the lazy dog The quick brown fox";
            const authtoken=JWT.sign(payload,JWT_SECRET);
            success=true;
            res.status(200).json({success,authtoken,message:"Logged in successfully"});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    }
)

// Get the logged in user details from the database
router.post("/getdoctor",getdoctordetails,async(req,res)=>{
    // Getting the user id from the middleware i.e. getuserdetails.js
    let userid=req.doctor.id;
    connectDb();
    let doctor=await Doctor.findById(userid).select("-password");
    res.json(doctor)
})
module.exports = router