const { default: Bot } = require("el-bot");
/**
 *
 * @param {Bot} ctx
 */
module.exports = (ctx) => {
  const mirai = ctx.mirai;
  mirai.on("message", (msg) => {
    // todo
  });
};
