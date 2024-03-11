const express = require('express');
const router = express.Router();
const connectDb = require('../db/connectdb');
// const getuserdetails = require('../middleware/getuserdetails');
const Doctor = require("../models/Doctor");
router.get("/getalldoctors", async (req, res) => {
    try {
        connectDb();
        let doctors = await Doctor.find().select("name specialist hospital location");
        // console.log(doctors);
        res.json(doctors)
    } catch (error) {
        console.log("Internal server error occurred");
        console.log(error.message);
    }
})
module.exports=router