const getFile = require("./getFile");

const fs = require("fs");
const path = require("path");

class videoDownloadSaveRemove {
constructor (dirPath){
this.dirPath = dirPath;
if (!fs.existsSync(dirPath)){
fs.mkdirSync(dirPath)
}
}

async saveFile(botToken, userId, fileId){

    return await getFile(botToken, fileId)
    .then(res=>{
        fs.writeFileSync(path.join( this.dirPath, userId.toString()), res );
           return (path.join(this.dirPath, userId.toString()));
    })



    

}

removeFile(userId){
    try {
    
        fs.readdirSync(this.dirPath).map(x=>{
            if (x.indexOf(userId)!=-1){
                fs.unlinkSync(path.join(this.dirPath, x))
            }
        })
      
    return "200"
    } catch (error) {
     if (error) throw error;
    }
    
}

}

module.exports = new videoDownloadSaveRemove(path.join('.', "TMP"));
