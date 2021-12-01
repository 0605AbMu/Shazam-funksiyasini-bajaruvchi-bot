const botToken = "1286410494:AAF6YLre5UKA1NjZkOulFVVPVhzF7PcSfO8";
const {Telegraf, Extra, Markup} = require("telegraf");
const bot = new Telegraf(botToken);
const videoSaver  = require("./scripts/videoSaver");
const music = require("./scripts/youTubeMusicDownloader");
const fs = require("fs")
const path = require("path");
const crud = require("./scripts/crud")
const channelLink = "@expren";

const command =  {
findSongByAudio:false
}

const processUserId = [];
const adminID = "1179599037";

bot.start(msg=>{
    msg.replyWithHTML("Assalomu alaykum. Xush kelibsiz!");
    if (adminID==msg.message.from.id.toString()) msg.tg.getMyCommands().then(async res=>{
       res.push({command:"stat", description:"statistikani ko'rish"})
        msg.tg.setMyCommands(res); 
    })
     
    msg.tg.getChatMember(channelLink, msg.message.from.id)
    .then(async res=>{
    if (res.status=="member"||res.status=="creator"||res.status=="administrator"){
        msg.replyWithHTML("<b>Kanalimiz a'zosi ekanligingiz tasdiqlandi.\nMarhamat botdan foydalanishingiz mumkin!</b>")
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
            msg.replyWithHTML(`<b>⚠️Siz Botimizdan foydalanishingiz uchun quyidagi Kanalimizga OBUNA bo'lmagansiz!\nKanalimizga obuna bo'ling va /start buyrug'uni yuboring...</b>`, Extra.markup(Markup.inlineKeyboard([{text:"Kanalimiz", url:"https://t.me/"+channelLink.split("@")[1]}])))        
    }
    })




})


bot.command("findsongbyaudio", msg=>{
    if (processUserId.indexOf(msg.message.from.id)==-1){
    msg.replyWithHTML("<b>🤖Menga 1-2 min lik multimedia jo'nating. Men undagi Musiqani topib berishga harakat qilaman!</b>");
    command.findSongByAudio = true;
    processUserId.push(msg.message.from.id)
    } else{
msg.replyWithHTML("<b>Siz bergan buyruq hozir jarayonda👆. Iltimos Oxirigacha Bajarilishini kuting yoki bekor qiling...</b>")
    }
})

bot.command("help", msg=>{
    msg.replyWithHTML("<b>Botda ishlash qo'llanmasi....</b>")
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
            if (!res) return msg.replyWithHTML("<b>⚠️Bu Musiqa Topilmadi!</b>").finally(()=>{videoSaver.removeFile(msg.chat.id)});
            if (res=="err") return msg.replyWithHTML("<b>⚠️Faylning hajmi katta yoki resurs yetarli emas. Uni xotiraga saqlab bo'lmadi. Iltimos qaytadan urunib ko'ring</b>").finally(()=>{videoSaver.removeFile(msg.chat.id)});
            
            msg.replyWithAudio({source:res}, Extra.caption(
                `<b>
💽Albom nomi: <i>${inf.title}</i>;
🔹Musiqa turi: <i>${inf.type}</i>;
🎙Musiqa ijrochisi: <i>${inf.subtitle}</i>;
▪️Musiqa nomi: <i>${inf.subject}</i>;
🔸Musiqa Janri: <i>${inf.genres}</i>;
🔗Musiqa uchun link: <i>${inf.link}</i>;
Yaqinlaringizga ulashing: <i>[shareLink]</i>
</b>
                `
            ).HTML(true) ).finally(()=>{videoSaver.removeFile(msg.chat.id)})
            
        
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




function general(botToken, userId, fileId, cb){

    videoSaver.saveFile(botToken, userId, fileId)
    .catch(err=>{
        if (err) return cb("err")
    
    })
    
    .then(res=>{
        if (fs.statSync(res).size/1000/1000>7) return cb("err");
        
        
    music(res, userId, (res, inf)=>{
        if (!res) return cb(undefined);
        if (fs.statSync(res).size/1000/1000>16) return cb("err");
        fs.renameSync(res, path.join(path.parse(fs.realpathSync(res)).dir, (inf?inf.title:"No'malum ")+userId+".mp3"))
        return cb(path.join("TMP", (inf?inf.title:"No'malum ")+userId+".mp3"),inf)
    })
    
    })

}




bot.launch({polling:true});
