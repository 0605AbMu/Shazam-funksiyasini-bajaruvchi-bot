const app =  (require("express"))();
const path = require("path")
app.get("/", (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname, "data.json"));
})
let add = app.listen(process.env.PORT||4000, ()=>{
    
}).address();

console.log("Bot ishga tushdi!\nPort: "+add.port)