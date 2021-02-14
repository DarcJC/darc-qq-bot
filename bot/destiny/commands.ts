
import { SteamBinding } from './steam.schema';
export const bot = require('bot-commander');


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
            if (Number.isNaN(d)) {
                meta.reply('禁言时长无效')
                return
            }
            meta.mute_msg(d)
        }
    })

function getUserIDFromAtMessage(msg) {
    const user_id = []
    for (const item of msg.messageChain) {
        if (item.type == 'At') {
            user_id.push(item.target)
        }
    }
    return user_id
}

bot
    .command('!unmute')
    .alias('!解除禁言')
    .description('解除对目标用户的禁言')
    .action( (meta) => {
        const res = getUserIDFromAtMessage(meta.msg)
        for (const i of res) {
            meta.bot.mirai.api.unmute(meta.msg.sender.group.id, i)
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
