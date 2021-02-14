
import { SteamBinding } from './steam.schema';
export const bot = require('bot-commander');

import R6API from 'r6api.js'
const r6api = new R6API(process.env.BOT_R6_EMAIL, process.env.BOT_R6_PASSWORD)
import { Region, Platform } from 'r6api.js'

// import { getProfile, searchDestinyPlayer, HttpClientConfig, BungieMembershipType } from 'bungie-api-ts/destiny2';
import Destiny2API from 'node-destiny-2';
const destiny2api = new Destiny2API({
    key: process.env.BOT_BUNGIE_API_KEY,
});

import {CommandMeta} from './index'
import {formatDateSemantic, parseDestinyClass, parseDestinyRace} from './utils'

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
    .action( async (meta: CommandMeta, steam_id: string) => {
        try {
            let doc = await SteamBinding.findOneAndUpdate({
                uid: String(meta.msg.sender.id),
            }, {
                steamid: steam_id,
            }, {
                new: true,
                upsert: true,
            })
            meta.reply(`绑定成功, 你目前的SteamID为: ${doc.steamid}`)
        } catch(e) {
            meta.reply(`发生错误:\n${e}`)
            return
        }
    })


bot
    .command('!r6s <Uplay昵称> [地区] [平台]')
    .alias('!彩六战绩')
    .description('查询彩六战绩')
    .action( async (meta: CommandMeta, nickname: string, region?: Region, platform?: Platform) => {
        nickname = nickname.trim()
        nickname = encodeURI(nickname)
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


bot
    .command('!d2s <昵称>')
    .alias('!命运2战绩')
    .description('查询命运2信息')
    .action( async (meta: CommandMeta, id: string) => {
        id = id.trim()
        id = encodeURI(id)
        try {
            const search_result = await destiny2api.searchDestinyPlayer(3, id)
            if (search_result.Response?.length === 0) {
                meta.reply(`无法由昵称「${id}查询到用户」`)
                return
            }
            const membershipId = search_result.Response[0].membershipId
            const res = await destiny2api.getProfile(3, membershipId, [100, 200])
            const characters = res.Response.characters.data
            const profile = res.Response.profile.data
            // const profileCurrencies = res.Response.profileCurrencies
            function buildCharactersDesc(characters, profile) {
                function buildCharacterDesc(character) {
                    const o = 
`
🌠${parseDestinyClass(character.classType)}(id:${character.characterId})，
🎯它是一个 ${parseDestinyRace(character.raceType)}。
✨该角色光等为 ${character.light}，
🎈最后游玩时间是 ${formatDateSemantic(character.dateLastPlayed, "yyyyMMdd HH:mm:ss")}，
⏰本赛季游玩时长为 ${parseInt(character.minutesPlayedThisSession) / 60}时 / ${parseInt(character.minutesPlayedTotal) / 60}时(总时长)，
`
                    return o
                }
                let res = ""
                for (const key of profile.characterIds) {
                    res += buildCharacterDesc(characters[key])
                    res += '※※※※※※※'
                }
                return res
            }
            meta.reply(
`
守护者「${profile.userInfo.displayName}」，
你的最后上线日期是 ${formatDateSemantic(profile.dateLastPlayed, "yyyyMMdd HH:mm:ss")}。
==========
当前赛季为【天选赛季(赛季代码:${profile.currentSeasonHash})】，
赛季最高光等为 ${profile.currentSeasonRewardPowerCap}。
==========
你有 ${profile.characterIds.length} 个角色：\n
${buildCharactersDesc(characters, profile)}
`
            )
        } catch (e) {
            meta.reply(`查询时发生错误:\n${e}`)
        }
    })