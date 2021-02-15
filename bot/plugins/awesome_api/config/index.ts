
export interface AwesomeApiConfig {
    JDApiKey: String
    NewsFeed: Array<number>
    NewsFeedCron: Array<string>
}

const config: AwesomeApiConfig = {
    JDApiKey: process.env.BOT_AWESOME_API_JD_KEY,
    NewsFeed: [296796793, 941429748, 1044972580],
    NewsFeedCron: [
        '0 0 6-18 * * ?',
    ],
}

export default config
