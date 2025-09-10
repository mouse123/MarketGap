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

// 利润预测数据接口
export interface ProfitForecast {
    年度: string;
    预测机构数: number;
    最小值: number;
    均值: number;
    最大值: number;
    行业平均数: number;
}

// 财务分析指标接口
export interface FinancialAnalysisIndicator {
    日期: string;
    
    // 每股指标
    '摊薄每股收益(元)': number;
    '加权每股收益(元)': number;
    '每股收益_调整后(元)': number;
    '扣除非经常性损益后的每股收益(元)': number | null;
    '每股净资产_调整前(元)': number;
    '每股净资产_调整后(元)': number;
    '每股经营性现金流(元)': number;
    '每股资本公积金(元)': number;
    '每股未分配利润(元)': number;
    '调整后的每股净资产(元)': number | null;
    
    // 利润率指标 (%)
    '总资产利润率(%)': number;
    '主营业务利润率(%)': number;
    '总资产净利润率(%)': number;
    '成本费用利润率(%)': number;
    '营业利润率(%)': number;
    '主营业务成本率(%)': number;
    '销售净利率(%)': number;
    '股本报酬率(%)': number;
    '净资产报酬率(%)': number;
    '资产报酬率(%)': number;
    '销售毛利率(%)': number | null;
    '净资产收益率(%)': number;
    '加权净资产收益率(%)': number;
    
    // 增长率指标 (%)
    '主营业务收入增长率(%)': number;
    '净利润增长率(%)': number;
    '净资产增长率(%)': number;
    '总资产增长率(%)': number;
    
    // 周转率指标
    '应收账款周转率(次)': number;
    '应收账款周转天数(天)': number;
    '存货周转天数(天)': number;
    '存货周转率(次)': number;
    '固定资产周转率(次)': number | null;
    '总资产周转率(次)': number;
    '总资产周转天数(天)': number;
    '流动资产周转率(次)': number;
    '流动资产周转天数(天)': number;
    '股东权益周转率(次)': number;
    
    // 比率指标
    流动比率: number;
    速动比率: number;
    '现金比率(%)': number;
    利息支付倍数: number;
    '长期债务与营运资金比率(%)': number | null;
    '股东权益比率(%)': number;
    '长期负债比率(%)': number | null;
    '股东权益与固定资产比率(%)': number | null;
    '负债与所有者权益比率(%)': number;
    '长期资产与长期资金比率(%)': number | null;
    '资本化比率(%)': number | null;
    '固定资产净值率(%)': number | null;
    '资本固定化比率(%)': number;
    '产权比率(%)': number;
    '清算价值比率(%)': number | null;
    '固定资产比重(%)': number | null;
    '资产负债率(%)': number;
    
    // 现金流量指标 (%)
    '经营现金净流量对销售收入比率(%)': number;
    '资产的经营现金流量回报率(%)': number;
    '经营现金净流量与净利润的比率(%)': number;
    '经营现金净流量对负债比率(%)': number;
    '现金流量比率(%)': number;
    
    // 其他财务指标
    三项费用比重: number;
    非主营比重: number;
    主营利润比重: number;
    '股息发放率(%)': number;
    '投资收益率(%)': number;
    
    // 绝对金额指标 (元)
    '主营业务利润(元)': number;
    '扣除非经常性损益后的净利润(元)': number;
    '总资产(元)': number;
    
    // 投资相关指标 (元)
    '短期股票投资(元)': number | null;
    '短期债券投资(元)': number | null;
    '短期其它经营性投资(元)': number | null;
    '长期股票投资(元)': number | null;
    '长期债券投资(元)': number | null;
    '长期其它经营性投资(元)': number | null;
    
    // 应收账款相关 (元)
    '1年以内应收帐款(元)': number | null;
    '1-2年以内应收帐款(元)': number | null;
    '2-3年以内应收帐款(元)': number | null;
    '3年以内应收帐款(元)': number | null;
    
    // 预付货款相关 (元)
    '1年以内预付货款(元)': number | null;
    '1-2年以内预付货款(元)': number | null;
    '2-3年以内预付货款(元)': number | null;
    '3年以内预付货款(元)': number | null;
    
    // 其它应收款相关 (元)
    '1年以内其它应收款(元)': number | null;
    '1-2年以内其它应收款(元)': number | null;
    '2-3年以内其它应收款(元)': number | null;
    '3年以内其它应收款(元)': number | null;
}

// Provide/Inject 相关类型
import type { InjectionKey, Ref } from 'vue'

export type MarketInfoType = Record<string, unknown>
export type ProfitForecastType = ProfitForecast[]
export type FinancialAnalysisIndicatorType = FinancialAnalysisIndicator[]

// Injection Keys
export const marketInfoKey: InjectionKey<Ref<MarketInfoType | null>> = Symbol('marketInfo')
export const marketCodeKey: InjectionKey<string | string[]> = Symbol('marketCode')
export const marketProfitForecastKey: InjectionKey<Ref<ProfitForecastType | null>> = Symbol('marketProfitForecast')
export const marketFinancialAnalysisIndicatorKey: InjectionKey<Ref<FinancialAnalysisIndicatorType | null>> = Symbol('marketFinancialAnalysisIndicator')