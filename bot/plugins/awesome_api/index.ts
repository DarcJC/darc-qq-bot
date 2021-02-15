import Bot from "el-bot";
import { MessageChain, ChatMessage } from "mirai-ts/dist/types/message-type";
import { bot } from "./command";
import config from './config';
import {
    JDWxApi
} from './apis';

export interface CommandMeta {
    ctx: Bot
    msg: ChatMessage
    jdwxApi: JDWxApi,
}

export default async (ctx: Bot) => {
    const mirai = ctx.mirai;
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
}
