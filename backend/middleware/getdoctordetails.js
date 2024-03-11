const JWT_SECRET="jumps over the lazy dog The quick brown fox";
const JWT=require("jsonwebtoken");
const getdoctordetails=(req,res,next)=>{
    let authtoken=req.header('authtoken');
    if(!authtoken){
        return res.status(401).send({error:"Please use a valid auth token"})
    }
    try {
        const payload=JWT.verify(authtoken,JWT_SECRET);
        req.doctor=payload.doctor;
        console.log(payload.doctor);
    } catch (error) {
        return res.status(401).send({error:"Please use a valid auth token"})
    }
    next();
}
module.exports=getdoctordetails;