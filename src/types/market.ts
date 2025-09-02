export interface EastmoneyMarket {
    序号: number;
    代码: string;
    名称: string;
    最新价: number;
    涨跌幅: number;
    涨跌额: number;
    成交量: number;
    成交额: number;
    振幅: number;
    最高: number;
    最低: number;
    今开: number;
    昨收: number;
    量比: number;
    换手率: number;
    ['市盈率-动态']?: number; // 总市值/全年预测净利润，预测净利润 = 多家机构预测的净利润，取的平均值
    市净率: number; // 市值/净资产，净资产 = （总资产 - 总负债）
    总市值: number;
    流通市值: number;
    涨速: number;
    五分钟涨跌?: number; // 5分钟涨跌
    六十日涨跌幅?: number; // 60日涨跌幅
    年初至今涨跌幅?: number;
}

export interface EastmoneyMarketEn {
    id: number; // 序号
    code: string; // 代码
    name: string; // 名称
    latestPrice: number; // 最新价
    changePercent: number; // 涨跌幅
    changeAmount: number; // 涨跌额
    volume: number; // 成交量
    turnover: number; // 成交额
    amplitude: number; // 振幅
    high: number; // 最高
    low: number; // 最低
    open: number; // 今开
    previousClose: number; // 昨收
    volumeRatio: number; // 量比
    turnoverRate: number; // 换手率
    peDynamic?: number; // 市盈率-动态
    pb: number; // 市净率
    totalMarketCap: number; // 总市值
    circulatingMarketCap: number; // 流通市值
    speed: number; // 涨速
    change5min?: number; // 五分钟涨跌
    change60d?: number; // 六十日涨跌幅
    changeYTD?: number; // 年初至今涨跌幅
}