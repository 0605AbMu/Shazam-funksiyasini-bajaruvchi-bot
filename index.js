const botToken = "2140507423:AAEdxki1Xf0kBXvGLaDQhsa0z7vLIckU9J8";
const {Telegraf, Extra, Markup} = require("telegraf");
const bot = new Telegraf(botToken);
const videoSaver  = require("./scripts/videoSaver");
const music = require("./scripts/youTubeMusicDownloader");
const fs = require("fs")
const path = require("path");
const crud = require("./scripts/crud")
const channelLink = "@greenjobuz";

const command =  {
findSongByAudio:false
}

const processUserId = [];
const adminID = "1607198337";
const dMessageID = [];

bot.start(msg=>{
    
if(dMessageID.findIndex(({id})=>id==msg.message.from.id)==-1){dMessageID.push({id: msg.message.from.id, mid:[]})}

    msg.replyWithHTML("Assalomu alaykum. Xush kelibsiz!").then(res=>{dMessageID.find(({id})=>id==msg.message.from.id).mid.push(res.message_id) });

    
    
    if (adminID==msg.message.from.id.toString()){ msg.tg.getMyCommands().then(async res=>{
       res.push({command:"stat", description:"statistikani ko'rish"});
       res.push({command:"message", description:"barchaga xabar yuborish"});
        msg.tg.setMyCommands(res); 
    })} else{
        msg.tg.getMyCommands().then(async res=>{
            msg.tg.setMyCommands(res); 
         })
    }
     
 msg.tg.getChatMember(channelLink, msg.message.from.id)
    .then(async res=>{
    if (res.status=="member"||res.status=="creator"||res.status=="administrator"){
        
        msg.replyWithHTML(`<b>Assalomu alaykum ${msg.message.from.first_name}!\nMenga quyidagi buyruqlar orqali murojaat qiling:
/song - musiqaning nomi bilan qidirish
/artist - musiqaning artist nomi bilan qidirish
/shazam - istalgan video voice audio
lar orqali sizga kerakli musiqani topib beraman.</b>`)
        .then((res)=>{
            
            dMessageID.find(({id})=>id==msg.message.from.id).mid.map(x=>{try{msg.deleteMessage(x)}catch(e){}});
            dMessageID.splice(dMessageID.findIndex(({id})=>id==msg.message.from.id),1);
            
            
        })
        crud.readUserById(msg.message.from.id, res=>{
            if (!res)
            return crud.addUser({
                id: msg.message.from.id,
                name: msg.message.from.first_name||"yo'q",
                username: msg.message.from.username||"yo'q",
                status:"member"
            }, res=>{});
        })
    } else{
        dMessageID.find(({id})=>id==msg.message.from.id).mid.push(msg.message.message_id);
            msg.replyWithHTML(`<b>⚠️Siz Botimizdan foydalanishingiz uchun quyidagi Kanalimizga OBUNA bo'lmagansiz!\nKanalimizga obuna bo'ling va /start buyrug'uni yuboring...</b>`, Extra.markup(Markup.inlineKeyboard([{text:"Kanalimiz", url:"https://t.me/"+channelLink.split("@")[1]}])))
            .then(res=>{ dMessageID.find(({id})=>id==msg.message.from.id).mid.push(res.message_id)});       
    }
    
    })




})

bot.command("song", msg=>{
    msg.replyWithHTML("<b>Tez kunlarda ishga tushadi...</b>")
})
bot.command("artist", msg=>{
    msg.replyWithHTML("<b>Tez kunlarda ishga tushadi...</b>")
})


bot.command("shazam", msg=>{
    msg.tg.getChatMember(channelLink, msg.message.from.id)
    .then(async res=>{
        
    if (res.status=="member"||res.status=="creator"||res.status=="administrator"){
        if (dMessageID.find(({id})=>id==msg.message.from.id)) {
            dMessageID.find(({id})=>id==msg.message.from.id).mid.map(x=>{try{msg.deleteMessage(x)}catch(e){}});
            dMessageID.splice(dMessageID.findIndex(({id})=>id==msg.message.from.id),1);
         
        }
         

        // if (processUserId.indexOf(msg.message.from.id)==-1&&processUserId.length<=5){
        
            msg.replyWithHTML("<b>🤖Menga 2MB dan oshmaydigan Video, Audio yoki Voice yuboring, Musiqasini topib beraman!</b>");
            command.findSongByAudio = true;
            processUserId.push(msg.message.from.id)
        //     } else{
        //         if (processUserId.length>5) return msg.replyWithHTML("<b>Jarayondagi ishlar soni biroz ko'p. Keyinroq urunib ko'ring!</b>")
        // msg.replyWithHTML("<b>Siz bergan buyruq hozir jarayonda👆. Iltimos Oxirigacha Bajarilishini kuting yoki bekor qiling...</b>")
        //     }
    } else{
        //dMessageID.find(({id})=>id==msg.message.from.id).mid.push(msg.message.message_id);
        msg.replyWithHTML(`<b>⚠️Siz Botimizdan foydalanishingiz uchun quyidagi Kanalimizga OBUNA bo'lmagansiz!\nKanalimizga obuna bo'ling va /start buyrug'uni yuboring...</b>`, Extra.markup(Markup.inlineKeyboard([{text:"Kanalimiz", url:"https://t.me/"+channelLink.split("@")[1]}])))
        .then(res=>{ 
           try {
            if (!dMessageID.find(({id})=>id==msg.message.from.id)) {dMessageID.push({id: msg.message.from.id, mid:[]})}
            dMessageID.find(({id})=>id==msg.message.from.id).mid.push(res.message_id)
           } catch (error) {
               
           }
           
    
    });

    }
});



   
})



bot.command("help", msg=>{
    msg.replyWithVideo({source:"helper.mp4"}, Extra.HTML(true).caption("<b>Botdan foydalanish qo'llanmasi to'liq videoda👆</b>"));
})

bot.command("message", msg=>{
    if (msg.message.from.id==adminID){
        command.message = true;
        return msg.replyWithHTML("<b>Menga birorta xabar yuboring men uni barcha bot foydalanuvchilariga uzataman</b>")
    } else{
        return msg.replyWithHTML("<b>‼Siz adminstarator emassiz.</b>");
    }
})


bot.command("stat", msg=>{
    if (msg.message.from.id!=adminID){msg.replyWithHTML("<b>Siz administrator emassiz!</b>"); return;}
    crud.readAllUser(res=>{
        
        msg.replyWithHTML("Botdagi jami a'zolar soni: "+res.length+" ta.\nUlar quyidagilar👇👇").finally(()=>{

            let s = ""
            res.map(x=>{
                s = s+`\n${res.indexOf(x)+1}:
    ID: <i>${x.id}</i>
    Ismi: <i>${x.name}</i>
    username: <i>${x.username?("@"+x.username):"mavjud emas"}</i>`
            })
            msg.replyWithHTML(`<b>${s}</b>`)
        })
        
    })
})


bot.on(["video", "audio", "voice","video_note"], msg=>{
    let file_id;

if (msg.message.video) file_id = msg.message.video.file_id;
if (msg.message.audio) file_id = msg.message.audio.file_id;
if (msg.message.voice) file_id = msg.message.voice.file_id;
if (msg.message.video_note) file_id = msg.message.video_note.file_id;
crud.readUserById(msg.message.from.id, res=>{
    if (!command.findSongByAudio){msg.replyWithHTML("<b>Kerakli buyruqni tanlang!</b>"); return;}
    if (res&&res.status=="member"&&command.findSongByAudio){
        general(botToken, msg.message.from.id.toString(), file_id, (res, inf)=>{
            if (!res) return msg.replyWithHTML("<b>⚠️Bu Musiqa Topilmadi.Iltimos qaytadan xarakat qilib ko'ring!</b>").finally(()=>{videoSaver.removeFile(msg.chat.id); processUserId.splice(processUserId.indexOf(msg.message.from.id), 1);});
            if (res=="err") return msg.replyWithHTML("<b>⚠️Faylning hajmi 2MB dan oshmasin yoki Musiqaning biroz qismini voice orqali yozib yuboring. Iltimos qaytadan urunib ko'ring</b>").finally(()=>{videoSaver.removeFile(msg.chat.id);processUserId.splice(processUserId.indexOf(msg.message.from.id), 1); });
            
            msg.replyWithAudio({source:res}, Extra.caption(
                `<b>
💽Albom nomi: <i>${inf.title}</i>;
🔹Musiqa turi: <i>${inf.type}</i>;
🎙Musiqa ijrochisi: <i>${inf.subtitle}</i>;
▪️Musiqa nomi: <i>${inf.subject}</i>;
🔸Musiqa Janri: <i>${inf.genres}</i>;
🔗Musiqa uchun link: <i>${inf.link}</i>;
Yaqinlaringizga ulashing: <i>@${msg.botInfo.username}</i>
</b>
                `
            ).HTML(true) ).finally(()=>{videoSaver.removeFile(msg.chat.id); processUserId.splice(processUserId.indexOf(msg.message.from.id), 1)});
            
        
        })
        msg.replyWithHTML("<b>🕥Iltimos Biroz kuting...</b>")
        if (command.findSongByAudio) {
            if (processUserId.indexOf(msg.message.from.id)!=-1){processUserId.splice(processUserId.indexOf(msg.message.from.id), 1)};
             command.findSongByAudio = false;
             return;
        } 
    
    
    // Shart Tugadi
    } else{
        
        msg.replyWithHTML(`<b>⚠️Siz Botimizdan foydalanishingiz uchun quyidagi Kanalimizga OBUNA bo'lmagansiz!\nKanalimizga obuna bo'ling va /start buyrug'uni yuboring...</b>`, Extra.markup(Markup.inlineKeyboard([{text:"Kanalimiz", url:"https://t.me/"+channelLink.split("@")[1]}])))
    
    }
    

})

})

bot.on("message", msg=>{
    if(command.message){
        crud.readAllUser(res=>{
            res.map(x=>{
            try {
                msg.tg.sendCopy(x.id, msg.message,Extra.HTML(true))
              
            } catch (error) {
                
            }
                
            });
            command.message = false;
            msg.tg.sendMessage(adminID, "Xabaringiz barchaga yetkazildi!");
        })
    }
})


function general(botToken, userId, fileId, cb){

    videoSaver.saveFile(botToken, userId, fileId)
    .catch(err=>{
        if (err) return cb("err")
    
    })
    
    .then(res=>{
        if (fs.statSync(res).size/1000/1000>2) return cb("err");
        
        
    music(res, userId, (res, inf)=>{
        if (!res) return cb(undefined);
        if (fs.statSync(res).size/1000/1000>16) return cb("err");
        fs.renameSync(res, path.join(path.parse(fs.realpathSync(res)).dir, (inf?inf.title:"No'malum ")+userId+".mp3"))
        return cb(path.join("TMP", (inf?inf.title:"No'malum ")+userId+".mp3"),inf)
    })
    
    })

}




bot.launch({polling:true});

setInterval(() => {
    if (processUserId.length==0){
        
//         videoSaver.removeAll();
//         console.log("HI")
    }
}, 6000);

require("./data/bring");
