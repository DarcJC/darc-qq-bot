
import {bot} from '../../index'
import {AxiosStatic} from 'axios';

export interface JDwxApiConfig {
    base_url?: String
    axios?: AxiosStatic
}

export interface IJDwxWeather {
    city: String // 城市名称
    cityId: number // 城市Id
    citycode: number // 城市代码
    date: String // 时间
    week: String // 星期几
    weather: String // 天气情况 如 '晴'
    temp: String // 当前气温
    temphigh: String // 最高气温
    templow: String // 最低气温
    img: String // 图片索引
    humidity: String // 湿度
    pressure: String // 气压
    windspeed: String // 风速
    winddirect: String // 风向
    windpower: String // 风速等级
    updatetime: String // 更新时间
    index: [{
        iname: String
        ivalue: String
        detail: String
    }] // 一些文字说明
    aqi: {
        aqi: String // 空气质量综合指数
        quality: String // 空气质量文字简述 '优'
        aqiinfo: {
            level: String // 等级
            color: String // 等级对应的颜色
            affect: String // 空气质量文字说明
            measure: String // 空气质量对各类人群影响说明
        }
    }
}

export type NewsChannel = '头条' | '新闻' | '军事' | '科技'

export interface IJDwxNews {
    channel: NewsChannel // 频道
    num: String // 数量
    list: [{
        title: String // 新闻标题
        time: String // 发布时间
        src: String // 消息来源
        category: String // 新闻类型板块
        pic: String // 封面图地址
        content: String // 内容
        url: String // 移动端网址
        weburl: String // Web网址
    }] // 新闻列表
}

export class JDWxApi {

    readonly api_key: String
    readonly base_url: String = 'https://way.jd.com'
    readonly axiso: AxiosStatic

    constructor(api_key: String, config?: JDwxApiConfig) {
        this.api_key = api_key
        this.axiso = bot.mirai.api.axios
        if (config) {
            if (config.base_url) this.base_url = config.base_url
            if (config.axios) this.axiso = config.axios
        }
    }

    /**
     * 获取目标城市的天气
     * @param city 城市名称
     */
    async getWeatherByCityName(city: String): Promise<IJDwxWeather> {
        city = encodeURI(String(city)) // 对city进行编码
        const res = await this.axiso.request({
            url: `${this.base_url}/jisuapi/weather?city=${city}&appkey=${this.api_key}`,
            method: 'GET',
        })
        if (res.data.code != "10000") {
            throw '天气接口调用超出每日限制！';
        }
        if (res.data.result.status != 0) {
            throw '查询的城市不存在！';
        }
        return res.data.result.result
    }

    async getNewsFromChannel(channel: NewsChannel): Promise<IJDwxNews> {
        const channel_encoded = encodeURI(channel)
        const res = await this.axiso.request({
            url: `${this.base_url}/jisuapi/get?channel=${channel_encoded}&num=10&start=0&appkey=${this.api_key}`,
            method: 'GET',
        })
        if (res.data.code != "10000") {
            throw '新闻接口调用超出每日限制！';
        }
        if (res.data.result.status != 0) {
            throw '查询的频道不存在！';
        }
        return res.data.result.result
    }

}
