const axios = require("axios").default;
let getInfo = async (botToken, fileId)=>{
    return (await axios(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    ).then((res)=>{
        return res.data;
    }))
}


let getFilePath = async(botToken, fileId)=>{
    return await getInfo(botToken, fileId).then((res)=>{return res})
}


module.exports =  getFilePath;
