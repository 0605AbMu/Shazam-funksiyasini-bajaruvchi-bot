const path = require("path");
const jfs =  require("jsonfile")
const dataPath = path.join( "data", "data.json");



class CRUD {

    constructor(dataPath){
        this.dataPath = dataPath;
    }


// Read All Users Data
 readAllUser = (cb)=>{
    jfs.readFile(this.dataPath)
   .then(async res=>{
       return cb(await res);
   }).then
}


// Add User By Data
 addUser = (data, cb)=>{
this.readAllUser(res=>{
   res.push(data);
   jfs.writeFile(this.dataPath, res)
   .then(async res=>{
       return cb(await data);
   })
   .catch(err=>{if(err)return cb(undefined)   })
})
}


//Update User By Id
updateUserById = (id, data, cb)=>{

this.readAllUser(res=>{
   const rt = res.findIndex(({id})=>id==id);
if (rt!=-1){
res.splice(rt, 1);
res.push(data);
jfs.writeFile(this.dataPath, res)
.then(async res=>{
   return cb(await data)
})
.catch(err=>{if(err)return cb(undefined)})

} else{
   return cb(undefined)
}

})

}

readUserById(idr, cb){
   this.readAllUser(res=>{
      return cb(res.find(({id})=>id==idr));
   })
}
// delete User By Id
 deleteUserById = (id, cb)=>{
this.readAllUser(res=>{
const rt = res.findIndex(({id})=>id==id);
const ddata = res[rt]
if(rt!=-1){
res.splice(rt, 1);
jfs.writeFile(this.dataPath, res)
.then(res=>{
   return cb(ddata)
})
.catch(err=>{if(err) return cb(undefined)})
} else{

   return cb(undefined)
}


})
}





}





module.exports =  new CRUD(dataPath)





