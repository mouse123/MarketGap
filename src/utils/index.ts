import type { EastmoneyMarket, EastmoneyMarketEn } from '@/types/market'

const zhToEnKeyMap: Record<keyof EastmoneyMarket, keyof EastmoneyMarketEn> = {
    序号: 'id',
    代码: 'code',
    名称: 'name',
    最新价: 'latestPrice',
    涨跌幅: 'changePercent',
    涨跌额: 'changeAmount',
    成交量: 'volume',
    成交额: 'turnover',
    振幅: 'amplitude',
    最高: 'high',
    最低: 'low',
    今开: 'open',
    昨收: 'previousClose',
    量比: 'volumeRatio',
    换手率: 'turnoverRate',
    '市盈率-动态': 'peDynamic',
    市净率: 'pb',
    总市值: 'totalMarketCap',
    流通市值: 'circulatingMarketCap',
    涨速: 'speed',
    五分钟涨跌: 'change5min',
    六十日涨跌幅: 'change60d',
    年初至今涨跌幅: 'changeYTD',
}

const enToZhKeyMap: Record<keyof EastmoneyMarketEn, keyof EastmoneyMarket> = {
    id: '序号',
    code: '代码',
    name: '名称',
    latestPrice: '最新价',
    changePercent: '涨跌幅',
    changeAmount: '涨跌额',
    volume: '成交量',
    turnover: '成交额',
    amplitude: '振幅',
    high: '最高',
    low: '最低',
    open: '今开',
    previousClose: '昨收',
    volumeRatio: '量比',
    turnoverRate: '换手率',
    peDynamic: '市盈率-动态',
    pb: '市净率',
    totalMarketCap: '总市值',
    circulatingMarketCap: '流通市值',
    speed: '涨速',
    change5min: '五分钟涨跌',
    change60d: '六十日涨跌幅',
    changeYTD: '年初至今涨跌幅',
}

/**
 * 将 EastmoneyMarket (中文key) 转换为 EastmoneyMarketEn (英文key)
 */
export function eastmoneyMarketZhToEn(obj: Partial<EastmoneyMarket>): Partial<EastmoneyMarketEn> {
    const result: Partial<EastmoneyMarketEn> = {}
    for (const zhKey in obj) {
        const enKey = zhToEnKeyMap[zhKey as keyof EastmoneyMarket]
        if (enKey) {
            // @ts-expect-error 类型转换
            result[enKey] = obj[zhKey]
        }
    }
    return result
}

/**
 * 将 EastmoneyMarketEn (英文key) 转换为 EastmoneyMarket (中文key)
 */
export function eastmoneyMarketEnToZh(obj: Partial<EastmoneyMarketEn>): Partial<EastmoneyMarket> {
    const result: Partial<EastmoneyMarket> = {}
    for (const enKey in obj) {
        const zhKey = enToZhKeyMap[enKey as keyof EastmoneyMarketEn]
        if (zhKey) {
            // @ts-expect-error 类型转换
            result[zhKey] = obj[enKey]
        }
    }
    return result
}


export function waitFor(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 实现懒加载的函数，可以分步加载大量数据，适用于大数据量的分批处理和渲染。
 *
 * @template T
 * @param {T[]} source - 原始数据源数组。
 * @param {(data: T[], done: boolean) => void} callback - 每次加载完成后的回调函数。
 *        - data: 当前已加载的数据数组
 *        - done: 是否已全部加载完成
 * @param {Object} [options] - 可选参数对象。
 * @param {number} [options.time=10] - 每次加载的时间间隔（毫秒），默认10ms。
 * @param {number} [options.pageSize=30] - 每批加载的数据数量，默认30。
 * @returns {() => void} - 返回一个取消加载的函数，调用后可停止后续加载。
 *
 * @example
 * const cancel = lazyLoadData(
 *   bigArray,
 *   (data, done) => {
 *     render(data);
 *     if (done) console.log('全部加载完成');
 *   },
 *   { time: 20, pageSize: 50 }
 * );
 * // 如需中途取消加载
 * // cancel();
 */
export const lazyLoadData = <T>(
    source: T[],
    callback: (data: T[], done: boolean) => void,
    { time = 10, pageSize = 300 }: { time?: number; pageSize?: number } = {}
): () => void => {
    let isCancelled = false;

    if (!Array.isArray(source) || typeof callback !== 'function') {
        throw new Error('参数错误: source 必须为数组, callback 必须为函数');
    }

    if (source.length === 0) {
        callback([], true);
        return () => {};
    }

    if (source.length <= pageSize) {
        callback([...source], true);
        return () => {};
    }

    const total = Math.ceil(source.length / pageSize);

    const loadLoop = async (page = 1, data: T[] = []) => {
        if (isCancelled) return;
        const more = source.slice((page - 1) * pageSize, page * pageSize);
        const nextData = [...data, ...more];
        const done = page >= total;
        callback(nextData, done);
        if (!done && !isCancelled) {
            await waitFor(time);
            loadLoop(page + 1, nextData);
        }
    };

    loadLoop();

    return () => { isCancelled = true; };
};
