const getFilePath = require("./getInf");
const axios = require("axios").default;




const getVideo =async (botToken, fileId)=>{
return  (await 
getFilePath(botToken, fileId)
.then(res=>{
   return  require("axios").default(`https://api.telegram.org/file/bot${botToken}/${res.result.file_path}`, {responseType:"arraybuffer"})
    .then(async (res)=>{
        return await res.data
    })

})
)

}


module.exports = getVideo; 