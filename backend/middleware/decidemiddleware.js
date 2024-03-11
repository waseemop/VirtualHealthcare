const getuserdetails = require("./getuserdetails")
const getdoctordetails = require("./getdoctordetails")

const decideMiddleware = (req, res, next) => {
    const ispatient=req.headers['ispatient']
    if(ispatient==="true") {
        // console.log("inside if in decide middle ware");
        return getuserdetails(req, res,next);
    } else {
        return getdoctordetails(req, res,next);
    }
    // ispatient? getuserdetails(req, res,next):getdoctordetails(req, res,next)
}
module.exports=decideMiddleware;