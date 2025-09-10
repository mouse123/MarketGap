import token from './xueqiu/token.json'

const getXueqiuApiAndToken = () => {
    const api = 'http://127.0.0.1:8080/api/public'
    return { api, token: token.token }
}

export const getXueqiuByCode = async (code) => {
    console.log('getXueqiuByCode', code)
    const { api, token } = getXueqiuApiAndToken()
    const response = await fetch(`${api}/stock_individual_spot_xq?symbol=${code}&token=${token}`)
    return response.json()
}

export const stock_profit_forecast_ths = async (code) => {
    console.log('stock_profit_forecast_ths', code)
    const response = await fetch(`${api}/stock_profit_forecast_ths?symbol=${code.substring(2)}`)
    return response.json()
}

export const stock_financial_analysis_indicator = async (code) => {
    console.log('stock_financial_analysis_indicator', code)
    const response = await fetch(`${api}/stock_financial_analysis_indicator?symbol=${code.substring(2)}&start_year=2025`)
    return response.json()
}