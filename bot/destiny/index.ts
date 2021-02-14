import Bot from "el-bot";
import { MessageChain } from "mirai-ts/dist/types/message-type";
import { Member } from "mirai-ts/dist/types/contact"
import { bot } from "./commands";


/**
 *
 * @param {Bot} ctx
 */
export default (ctx: Bot) => {
  const mirai = ctx.mirai;

  mirai.on("GroupRecallEvent", ({ operator, messageId, authorId }) => {
    if (operator.permission != 'OWNER') return
    const text = `${operator.memberName} 撤回了一条消息, 并拜托${authorId}不要再发色图了。`;
    mirai.api.sendGroupMessage(text, operator.group.id);
  });

  mirai.on("message", (msg) => {
    if (msg.plain.startsWith('!')) {
      // 将文本作为命令处理
      let permission: String = null
      if (msg.sender['permission']) permission = msg.sender['permission']
      bot.parse(msg.plain, {
        msg,
        bot: ctx,
        permission,
        reply: (m: string | MessageChain) => {
          if (msg.type == 'GroupMessage') mirai.api.sendGroupMessage(m, msg.sender.group.id, msg.messageChain[0].id)
          else if (msg.type == 'FriendMessage' || msg.type == 'TempMessage') msg.reply(m, true)
        },
        mute_msg: (d: number) => {
          if ((<Member>msg.sender).group == undefined) return
          msg.sender = (<Member>msg.sender)
          const user_id: number[] = []
          for (const item of msg.messageChain) {
            if (item.type == 'At') {
              user_id.push(item.target)
            }
          }
          for (const target of user_id) {
            mirai.api.mute(msg.sender.group.id, target, d)
          }
          return user_id.length
        },
      })
    }
  });
};
