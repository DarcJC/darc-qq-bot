import Bot from "el-bot";
import el from "../el";
// import mongoose, { mongo } from 'mongoose'

export const bot = new Bot(el);

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

// bot.logger.info("正在连接数据库...")

// mongoose.connect(process.env.BOT_DB_URI || "mongodb://localhost:27017/el-bot", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
// })

// bot.logger.success(`成功连接到数据库「${mongoose.connection.name}」`)


// bot.start((msg) => {
//   if (bot.isDev) console.log(msg);
// });

// 监听消息
// bot.mirai.on("message", (msg) => {
//   console.log(msg)
// })
