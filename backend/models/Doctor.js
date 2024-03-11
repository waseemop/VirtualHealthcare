const mongoose =require("mongoose");
const schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    specialist:{
        type:String,
        default: "General"
    },
    hospital:{
        type:String,
        required: true
    },
    mobile:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
})
const Doctor=mongoose.model("doctor",schema);
module.exports=Doctor;