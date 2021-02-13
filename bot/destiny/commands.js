
const bot = require('bot-commander');


bot
    .command('!help')
    .alias('!帮助')
    .description('获得帮助')
    .action( meta => {
        meta.reply(`W⚡D⚡N⚡M⚡D⚡\n${bot.help()}`)
    })

bot
    .command('!mute <时长>')
    .alias('!禁言')
    .description('禁言指定用户')
    .action( (meta, d) => {
        if (meta.permission == 'OWNER' || meta.permission == 'ADMINISTRATOR') {
            d = parseInt(d.trim())
            if (d == NaN) {
                meta.reply('禁言时长无效🐷')
            }
            meta.mute_msg(d)
        }
    })


exports.commander = bot

exports.bot = bot
