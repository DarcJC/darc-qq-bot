
import { SteamBinding } from './steam.schema';
export const bot = require('bot-commander');

import R6API from 'r6api.js'
const r6api = new R6API(process.env.BOT_R6_EMAIL, process.env.BOT_R6_PASSWORD)
import { Region, Platform } from 'r6api.js'

import {CommandMeta} from './index'
import { stat } from 'node:fs';


bot
    .command('!help')
    .alias('!帮助')
    .description('获得帮助')
    .action( (meta: CommandMeta) => {
        meta.reply(`D⚡a⚡r⚡c  B⚡o⚡t\n${bot.help()}`)
    })

bot
    .command('!mute <时长>')
    .alias('!禁言')
    .description('禁言指定用户')
    .action( (meta: CommandMeta, d: any) => {
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
    .action( (meta: CommandMeta) => {
        const res = getUserIDFromAtMessage(meta.msg)
        for (const i of res) {
            meta.bot.mirai.api.unmute((meta.msg.sender as any).group.id, i)
        }
    })


bot
    .command('!steambind <Steam ID>')
    .alias('!绑定Steam')
    .description('绑定一个Steam账号')
    .action( async (meta: CommandMeta, steam_id) => {
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


bot
    .command('!r6s <Uplay昵称> [地区] [平台]')
    .alias('!彩六战绩')
    .description('查询彩六战绩')
    .action( async (meta: CommandMeta, nickname: string, region?: Region, platform?: Platform) => {
        nickname = nickname.trim()
        if (!region) {
            region = 'apac'
        }
        if (!platform) {
            platform = 'uplay'
        }
        try {
            const id = await r6api.getId(platform, nickname)
            if (id.length === 0) {
                meta.reply(`无法找到名为 ${nickname} 的用户！`)
                return
            }
            const stats = await r6api.getStats(platform, id[0].id).then(el => el[0])
            const rank = await r6api.getRank(platform, stats.id, {
                regions: [region],
            })
            meta.reply(
`玩家 ${stats.id}
==============
游戏时间 ${stats.pve.general.playtime + stats.pvp.general.playtime}
PVP场数 ${stats.pvp.general.matches}
排位分数 ${ rank.length === 0 ? '当前赛季没有排位记录' : rank[0].seasons["20"].regions[region].current.name}(${ rank.length === 0 ? '当前赛季没有排位记录' : rank[0].seasons["20"].regions[region].current.mmr})
`)
        } catch(e) {
            meta.reply(`调用接口时发生错误:\n${e}`)
            return
        }
    })