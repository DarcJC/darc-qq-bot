require("dotenv").config();
const { resolve } = require("path");
const { utils } = require("el-bot");

module.exports = {
  qq: parseInt(process.env.BOT_QQ),
  setting: utils.config.parse(
    resolve(__dirname, "./mirai_http_setting.yml")
  ),
  db: {
    // 默认关闭
    enable: Boolean(process.env.BOT_DB_ENABLE),
    uri: process.env.BOT_DB_URI,
    analytics: true,
  },
  config: utils.config.parse(resolve(__dirname, "./index.yml")),
  // webhook
  webhook: {
    enable: true,
    path: "/webhook",
    port: 7777,
    secret: process.env.BOT_WEBHOOK_SECRET | 'default_webhook_secret',
  },
};
