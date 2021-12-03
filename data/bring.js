const app =  (require("express"))();
const path = require("path");
const crud = require("../scripts/crud");
app.get("/", (req, res ,next)=>{
    res.status(200).send("OK. It is Shazam Cool Bot core!");
})

app.head("/", (req,res,next)=>{
res.setHeader("Content-Type", "application/JSON");
})

let add = app.listen(process.env.PORT||4000, ()=>{
    
}).address();

console.log("Bot ishga tushdi!\nHost: "+add.address+"\nPort: "+add.port)
require("../index")