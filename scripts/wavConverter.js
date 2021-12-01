const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs")
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegPath);

let convert =  (filePath, cb)=>{
   
   return ffmpeg(filePath)
    .noVideo()
    .outputFormat("ogg")
    .pipe(fs.createWriteStream(filePath+".ogg"))
    .on("finish", ()=>{
        return cb(filePath)
    })
   .on("error", (err)=>{
       if (err) return cb(undefined)
   })
    

}

//module.exports = convert;

//convert("F:\\shazamBot\\TMP\\1179599037", res=>{console.log(res)});

