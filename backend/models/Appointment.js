const mongoose =require("mongoose");
const schema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status:{
        type:String,
        required:true
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor"
    },
    doctorname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    hospital:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    date: { 
        type: String, 
        required:true
    },
    time:{
        type:String,
        required:true
    }
})
const Appointment=mongoose.model("appointment",schema);
module.exports=Appointment;