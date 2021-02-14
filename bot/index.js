const Bot = require("el-bot");
const el = require("../el");

const bot = new Bot(el);
bot.mirai.api.axios.interceptors.response.use(
    res => {
        return res
    },
    (reason) => {
        bot.mirai.api.sendGroupMessage(`发生错误:\n${reason}`, 866368474)
        return new Promise(()=>{})
    }
)

bot.start()

// bot.start((msg) => {
//   if (bot.isDev) console.log(msg);
// });

// 监听消息
// bot.mirai.on("message", (msg) => {
//   console.log(msg)
// })
