const app =  (require("express"))();
const path = require("path");
const crud = require("../scripts/crud");
app.get("/", (req,res,next)=>{
crud.readAllUser(ress=>{
    res.send(ress)
})    

})
let add = app.listen(process.env.PORT||4000, ()=>{
    
}).address();

console.log("Bot ishga tushdi!\nPort: "+add.port)

require("./index.js")
