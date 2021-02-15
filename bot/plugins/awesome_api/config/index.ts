
export interface AwesomeApiConfig {
    JDApiKey: String
}

const config: AwesomeApiConfig = {
    JDApiKey: process.env.BOT_AWESOME_API_JD_KEY,
}

export default config
