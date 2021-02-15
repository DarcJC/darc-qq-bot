require("dotenv").config();
const { resolve } = require("path");
const { utils } = require("el-bot");
import El from 'el-bot/dist/config/el'

const http_api_setting = utils.config.parse(
  resolve(__dirname, "./mirai_http_setting.yml")
)
const config = utils.config.parse(resolve(__dirname, "./index.yml"))

const elConfiguration: El = {
  qq: parseInt(process.env.BOT_QQ),
  setting: http_api_setting,
  db: {
    // 默认关闭
    enable: Boolean(process.env.BOT_DB_ENABLE),
    uri: process.env.BOT_DB_URI,
    analytics: true,
  },
  bot: config,
  // webhook
  webhook: {
    enable: true,
    path: "/webhook",
    port: 7777,
    secret: process.env.BOT_WEBHOOK_SECRET as any | 'default_webhook_secret',
  },
};

export default elConfiguration
