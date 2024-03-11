const mongoose =require('mongoose');
const URI="mongodb://localhost:27017/wtproject"
const connectDb= ()=>{
   mongoose.connect(URI);
}
module.exports=connectDb;