import Bot from "el-bot";
import { MessageChain, ChatMessage } from "mirai-ts/dist/types/message-type";
import { bot } from "./command";
import config, {AwesomeApiConfig} from './config';
import schedule from "node-schedule";
import { utils } from "el-bot";
import {
    JDWxApi
} from './apis';
import { parse } from "el-bot/dist/utils/config";

export interface CommandMeta {
    ctx: Bot
    msg: ChatMessage
    jdwxApi: JDWxApi,
}

export default async (ctx: Bot, options: AwesomeApiConfig) => {
    const mirai = ctx.mirai;
    utils.config.merge(config, options)
    const jdwxApi = new JDWxApi(config.JDApiKey)

    mirai.on("message", (msg) => {
        if (msg.plain.startsWith('!')) {
            const meta: CommandMeta = {
                ctx,
                msg,
                jdwxApi,
            }
            bot.parse(msg.plain, meta)
        }
    })

    config.NewsFeedCron.forEach(element => {
        schedule.scheduleJob(element, async () => {
            try {
                const news = await jdwxApi.getNewsFromChannel('头条')
                let msg = '头条新闻：\n'
                for (let i in news.list) {
                    msg += `${1+parseInt(i)}、${news.list[i].title}(来源：${news.list[i].src})[${news.list[i].weburl}]\n\n`
                }
                config.NewsFeed.forEach(feeder => {
                    mirai.api.sendGroupMessage(msg, feeder)
                })
            } catch (e) {
                mirai.api.sendGroupMessage(`新闻订阅发生异常: ${e}`, 866368474)
            }
        })
    });
}
