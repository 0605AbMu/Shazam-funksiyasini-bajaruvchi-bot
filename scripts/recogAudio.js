const request = require("postman-request")
const fs = require("fs");
const path = require("path");
const axios =  require("axios").default;

let recogAudio = (filePath,cb) => {
const formData = {
  file: {
    value:  fs.createReadStream(filePath),
    options: {
      filename: path.parse(filePath).base,
      contentType: 'audio/ogg'
    }
  }
};

return request.post({url:'https://shazam-core.p.rapidapi.com/v1/tracks/recognize', formData: formData, headers:{
  'x-rapidapi-host': 'shazam-core.p.rapidapi.com',
  'x-rapidapi-key': '2b8b6c43acmsh60c9c387522ddecp1af488jsn58a7f7c73745'
} }, function optionalCallback(err, httpResponse, body) {
  if(err) return  cb(undefined);
  //console.log(body)
  let d;
  if ((body.indexOf("413")==-1)){
    if (JSON.parse(body).track==undefined) return cb(undefined);
    d = JSON.parse(body);
  } else{ return cb(undefined)};
  
  let data;
  if (d.track){
  data = {
    title: d.track.title||"Aniqlanmadi!",
    subtitle: d.track.subtitle||"Aniqlanmadi",
    type: d.track.type||"Aniqlanmadi",
    subject: d.track.share?d.track.share.subject:"Aniqlanmadi",
    genres: d.track.genres?d.track.genres.primary:"Aniqlanmadi"
  }} else{ data=undefined}
  
   cb(d, data);
});


}




let youTubeLink = async (filePath, cb) => {
 recogAudio(filePath, async (res, inf)=>{
   
    try {

    axios(await res.track.sections.find(({youtubeurl})=>youtubeurl).youtubeurl)
    .then(res=>{
      
      return cb(res.data.actions[0].uri, inf)
    })    
  } catch (error) {
    if (error) return cb(undefined);
  }




  })
}

module.exports = youTubeLink;