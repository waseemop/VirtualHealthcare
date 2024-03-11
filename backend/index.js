const express = require('express');
const auth = require("./routes/auth");
const appointment = require("./routes/appointment");
const alldoctors = require("./routes/alldoctors");
const app = express();
const port = 4000;
const cors=require('cors')
app.use(express.json());
app.use(cors())


//  Instead of cors can use this if needed
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', ['Content-Type','authtoken']);
//   next();
// });

//TODO: Create a env file to avoid hardcoding urls ports and apis 
// Use dotenv npm package to do it.
app.use('/api/auth',auth);
app.use("/api/appointment",appointment);
app.use("/api/",alldoctors);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})