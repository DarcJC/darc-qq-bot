
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

export interface IBusRoute {
    transitno: String // 线路编号
    startstation: String // 起始站
    endstation: String // 终点站
    starttime: String // 首班时间
    endtime: String // 尾班时间
    price: String // 票价(起始)
    maxprice: String // 最高票价
    buscompany: String // 巴士公司
    timetable: String // 时间表
    updatetime: String // 更新时间
    list: [{
        sequenceno: number // 站点编号 从1开始
        station: String // 站点名称
        lat: String // 纬度
        lng: String // 经度
        subway?: String // 地铁站 (如果有)
    }]
}

export type HotWordTrend = 'rise' | 'fall' | 'fair'

export interface IHotWord {
    num: String  // 排名 从1开始
    level: String // 热词级别
    trend: HotWordTrend // 趋势 rise为升 fail为降低 fair为持平
    name: String // 热词名称
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

    /**
     * 获取目标频道的新闻
     * @param {NewsChannel} channel
     */
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

    /**
     * 获取公交车信息
     * @param city_name 城市名
     * @param bus 公交线名
     */
    async getBusRoute(city_name: String, bus: String): Promise<[IBusRoute]> {
        city_name = encodeURI(String(city_name))
        bus = encodeURI(String(bus))
        const res = await this.axiso.request({
            url: `${this.base_url}/jisuapi/transitLine?city=${city_name}&transitno=${bus}&appkey=${this.api_key}`,
            method: 'GET',
        })
        if (res.data.code != "10000") {
            throw '公交接口调用超出每日限制！';
        }
        if (res.data.result.status != 0) {
            throw '查询的城市/公交线路不存在！';
        }
        return res.data.result.result
    }

    async getHotWord(): Promise<[IHotWord]> {
        const res = await this.axiso.request({
            url: `${this.base_url}/showapi/rcInfo?typeId=1&appkey=${this.api_key}`,
            method: 'GET',
        })
        if (res.data.code != "10000") {
            throw '热词接口调用超出每日限制！';
        }
        return res.data.result.showapi_res_body.list
    }

}
