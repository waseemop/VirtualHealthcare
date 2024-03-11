const JWT_SECRET="The quick brown fox jumps over the lazy dog";
const JWT=require("jsonwebtoken");
const getuserdetails=(req,res,next)=>{
    let authtoken=req.header('authtoken');
    if(!authtoken){
        return res.status(401).send({error:"Please use a valid auth token"})
    }
    try {
        const payload=JWT.verify(authtoken,JWT_SECRET);
        req.user=payload.user;
    } catch (error) {
        return res.status(401).send({error:"Please use a valid auth token"})
    }
    next();
}
module.exports=getuserdetails;