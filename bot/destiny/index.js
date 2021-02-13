const { default: Bot } = require("el-bot");

const {commander, bot} = require("./commands")


/**
 *
 * @param {Bot} ctx
 */
module.exports = (ctx) => {
  const mirai = ctx.mirai;

  mirai.on("GroupRecallEvent", ({ operator, messageId, authorId }) => {
    if (operator.permission != 'OWNER') return
    const text = `${operator.memberName} 撤回了一条消息, 并拜托${authorId}不要再发色图了。`;
    mirai.api.sendGroupMessage(text, operator.group.id);
  });

  mirai.on("message", async (msg) => {
    if (msg.plain.startsWith('!')) {
      // 将文本作为命令处理
      bot.parse(msg.plain, {
        reply: (m) => {
          msg.reply(m, true)
        },
        mute_msg: (d) => {
          user_id = []
          for (item of msg.messageChain) {
            if (item.type == 'At') {
              user_id.push(item.target)
            }
          }
          console.log(user_id)
          for (target of user_id) {
            mirai.api.mute(msg.sender.group.id, target, d)
          }
          return user_id.length
        },
        permission: msg.sender.permission,
      })
    }
  });
};
