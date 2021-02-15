const {BotCommand} = require('bot-commander');

export const bot = new BotCommand();

import {CommandMeta} from './index'
import {City, getCityById} from './city.schema'


bot
    .command('!绑定城市 <城市名>')
    .description('为自己绑定一个城市')
    .action( async (meta: CommandMeta, city: String) => {
        try {
            let doc = await City.findOneAndUpdate({
                uid: String(meta.msg.sender.id),
            }, {
                city,
            }, {
                new: true,
                upsert: true,
            })
            meta.msg.reply(`绑定成功！目前你绑定的城市为${doc.city}。`, true)
        } catch(e) {
            meta.msg.reply(`绑定过程遇到错误：\n${e}`, true)
        }
    })

bot
    .command('!天气')
    .description('查询绑定城市的天气情况')
    .action( async (meta: CommandMeta) => {
        try {
            const city_name = await getCityById(String(meta.msg.sender.id))
            if (!city_name) {
                meta.msg.reply('你还没有绑定城市！\n请使用 !绑定城市 <城市名> 为自己绑定一个城市。', true)
                return
            }
            const weather = await meta.jdwxApi.getWeatherByCityName(city_name)
            const msg = 
`
${weather.city}：${weather.weather}，当前气温${weather.temp}℃(${weather.templow}~${weather.temphigh})

详细信息：
${(()=>{
    let res = ''
    for (let i in weather.index) {
        res += `${weather.index[i].iname}：${weather.index[i].detail}\n\n`
    }
    return res
})()}数据更新时间：${weather.updatetime}
`
            meta.msg.reply(msg, true)
        } catch (e) {
            meta.msg.reply(`发生错误:\n${e}`, true)
        }
    })
