const ytdl = require("ytdl-core");
const ytLink = require("./recogAudio");
const fs = require("fs")
const path = require("path")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


let convert =  (filePath, cb)=>{
   
    return ffmpeg({source: filePath})
     .noVideo()
     .outputFormat("mp3")
     .writeToStream(fs.createWriteStream(filePath+".mp3"), {end:true})
     .on("finish", ()=>{
        
        return cb(filePath+".mp3")
    })
   .on("error", (err)=>{
       if (err) return cb(undefined)
   })
 
 }



let ytMusicDownload = (filePath, userId, cb) =>{
ytLink(filePath, (res, inf)=>{
        if (!res) return cb(undefined);
        inf.link = res;
ytdl(res, {  filter:"audioonly", quality:"lowest" })
.pipe(fs.createWriteStream(path.join(path.dirname(__dirname), "TMP",userId)))
.on("finish", ()=>{
    convert(path.join(path.dirname(__dirname), "TMP",userId), rt=>{
        return  cb(rt, inf);
    })
  
})
.on("error", (err)=>{
   if (err) return cb(undefined) 
})
    
        })


}
module.exports = ytMusicDownload;
