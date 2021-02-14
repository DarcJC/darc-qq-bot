const { default: Bot } = require("el-bot");

const {commander, bot} = require("./commands")


/**
 *
 * @param {Bot} ctx
 */
module.exports = (ctx) => {
  const mirai = ctx.mirai;

  mirai.api.handleStatusCode().then((value)=>{
  }, (reason) => {
    mirai.api.sendGroupMessage(`发生错误:\n${reason}`, 866368474)
  })

  mirai.on("GroupRecallEvent", ({ operator, messageId, authorId }) => {
    if (operator.permission != 'OWNER') return
    const text = `${operator.memberName} 撤回了一条消息, 并拜托${authorId}不要再发色图了。`;
    mirai.api.sendGroupMessage(text, operator.group.id);
  });

  mirai.on("message", (msg) => {
    if (msg.plain.startsWith('!')) {
      // 将文本作为命令处理
      bot.parse(msg.plain, {
        'msg': msg,
        bot: ctx,
        permission: msg.sender.permission,
        reply: (m) => {
          if (msg.type == 'GroupMessage') mirai.api.sendGroupMessage(m, msg.sender.group.id, msg.messageChain[0].id)
          else if (msg.type == 'FriendMessage' || msg.type == 'TempMessage') msg.reply(m, true)
        },
        mute_msg: (d) => {
          user_id = []
          for (item of msg.messageChain) {
            if (item.type == 'At') {
              user_id.push(item.target)
            }
          }
          for (target of user_id) {
            mirai.api.mute(msg.sender.group.id, target, d)
          }
          return user_id.length
        },
      })
    }
  });
};
