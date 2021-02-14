
const bot = require('bot-commander');
const {SteamBinding} = require('./steam.schema')



bot
    .command('!help')
    .alias('!帮助')
    .description('获得帮助')
    .action( meta => {
        meta.reply(`D⚡a⚡r⚡c  B⚡o⚡t\n${bot.help()}`)
    })

bot
    .command('!mute <时长>')
    .alias('!禁言')
    .description('禁言指定用户')
    .action( (meta, d) => {
        if (meta.permission == 'OWNER' || meta.permission == 'ADMINISTRATOR') {
            d = parseInt(d.trim())
            if (d.isNaN()) {
                meta.reply('禁言时长无效')
                return
            }
            meta.mute_msg(d)
        }
    })


bot
    .command('!steambind <Steam ID>')
    .alias('!绑定Steam')
    .description('绑定一个Steam账号')
    .action( async (meta, steam_id) => {
        steam_id = parseInt(steam_id)
        if (steam_id === NaN) {
            meta.reply(`Steam ID: ${steam_id} 无效.`)
            return
        }
        const doc = new SteamBinding()
        doc.uid = meta.msg.sender.id
        doc.steamid = steam_id
        await doc.save()
        meta.reply(`绑定成功, 你目前的SteamID为: ${doc.uid}`)
    })


exports.commander = bot

exports.bot = bot
