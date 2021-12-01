const instagramGetUrl = require("instagram-url-direct")
const axios =  require("axios");
const fs = require("fs")

let instaDownloader = (url, downloadPathAndFileName)=>{

    
instagramGetUrl(url)
.then((res)=>{
axios.default(res.url_list[0], {responseType: "arraybuffer"})
.then(res=>{
    fs.writeFileSync(downloadPathAndFileName, res.data);
})
})

}

module.exports = instaDownloader;



