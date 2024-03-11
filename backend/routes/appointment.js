const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectdb');
const Appointment = require("../models/Appointment");
const getuserdetails = require('../middleware/getuserdetails');
const decideMiddleware = require('../middleware/decidemiddleware');
const { body, validationResult } = require('express-validator');

// Retrieve appointment of the user --Login Required
router.post("/fetchallappointments",decideMiddleware , async (req, res) => {
    try {
        connectDb();
        let appointment=null;
        const ispatient=req.headers['ispatient']
        if(ispatient==="true") {
            appointment = await Appointment.find({ user: req.user.id }).select("-user -doctor");
        }
        else{
            appointment = await Appointment.find({ doctor: req.doctor.id }).select("-user -doctor");
        
        }
        res.json(appointment );
    } catch (error) {
        console.log("Internal server error occurred");
        console.log(error.message);
    }
})


// Add new appointment to the database --Login Required
router.post("/addappointment", getuserdetails,
    [
        body('doctorname', "doctorname cannot be empty").trim().notEmpty().isLength({min:5, max:30}),
        body('username', "username cannot be empty").trim().notEmpty().isLength({min:5, max:30}),
        body('hospital', "hospital cannot be empty").trim().notEmpty().isLength({min:5, max:30}),
        body('location', "location cannot be empty").trim().notEmpty().isLength({min:5, max:30}),
        body('date', "date cannot be empty").trim().notEmpty(),
        body('time', "time cannot be empty").trim().notEmpty()
    ],
    async (req, res) => {
        connectDb();
        const {doctorid,doctorname,username,hospital,location,date,time,status} = req.body;
        // Verifying the validations and sanitizers
        let success=false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success,error:errors});
        }
        try {
            const existingappointment=await Appointment.findOne({$and:[{doctor:doctorid},{date:date},{time:time}]});
            console.log(existingappointment);
            if(existingappointment){
                return res.status(400).json({success,error:"Time slot is not available"})
            }
            const appointment = await Appointment.create({
                user: req.user.id,
                status:status,
                doctor:doctorid,
                doctorname: doctorname,
                username: username,
                hospital: hospital,
                location:location,
                date:date,
                time:time
            })
            success=true;
            res.json({success,status});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    })

// Update the appointment of the user
router.put("/updateappointment/:id", decideMiddleware,
    [
        body('status', "Status cannot be empty").trim().notEmpty()
    ],
    async (req, res) => {
        try {
            connectDb();
            let success=false;
            const {status}=req.body;
            // Get appointmentid from the request params 
            let appointmentid = req.params.id;
            // Find whether the appointment exist with the given id
            let appointment = await Appointment.findById(appointmentid);
            // If appointment do not exist return unauthorised
            if (!appointment) {
                return res.status(404).json({success,error:"Not found any appointment."})
            }
            // Check whether the appointment is belong to the specified user or not 
            const ispatient=req.headers['ispatient'];
            if(ispatient==="true") {
                if (req.user.id !== appointment.user.toString()) {
                    // If not owner of the appointment return unauthorised error
                    return res.status(401).json({success,error:"Not allowed."})
                }
                else{
                    // Patient not allowed to update the status field
                    return res.status(401).json({success,error:"Patient/User cannot update the status"})
                }
            }
            else{
                if (req.doctor.id !== appointment.doctor.toString()) {
                    // If not owner of the appointment return unauthorised error
                    return res.status(401).json({success,error:"Not allowed."})
                }
    
            }
            // Find and delete the appointment 
            let result = await Appointment.findByIdAndUpdate(appointmentid,{status:status});
            console.log(result);
            success=true;
            res.json({success});
        } catch (error) {
            console.log("Internal server error occurred");
            console.log(error.message);
        }
    })
// Delete the appointment  --Login Required
router.delete("/deleteappointment/:id", decideMiddleware, async (req, res) => {
    try {
        connectDb();
        let success=false;
        // Get appointmentid from the request params 
        let appointmentid = req.params.id;
        // Find whether the appointment exist with the given id
        let appointment = await Appointment.findById(appointmentid);
        // If appointment do not exist return unauthorised
        if (!appointment) {
            return res.status(404).json({success,error:"Not found any appointment."})
        }
        // Check whether the appointment is belong to the specified user or not 
        const ispatient=req.headers['ispatient'];
        if(ispatient==="true") {
            if (req.user.id !== appointment.user.toString()) {
                // If not owner of the appointment return unauthorised error
                return res.status(401).json({success,error:"Not allowed."})
            }
        }
        else{
            if (req.doctor.id !== appointment.doctor.toString()) {
                // If not owner of the appointment return unauthorised error
                return res.status(401).json({success,error:"Not allowed."})
            }

        }
        // Find and delete the appointment 
        let result = await Appointment.findByIdAndDelete(appointmentid);
        console.log(result);
        success=true;
        res.json({success});
    } catch (error) {
        console.log("Internal server error occurred");
        console.log(error.message);
    }
})
module.exports = router;