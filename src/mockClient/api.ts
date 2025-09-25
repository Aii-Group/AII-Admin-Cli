// 自动生成的 API 客户端文件
// 请勿手动修改此文件

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as Types from './types'

// 拦截器配置接口
export interface ApiClientConfig extends AxiosRequestConfig {
    baseURL?: string
    interceptors?: Types.InterceptorConfig
}

export class ApiClient {
    private apiClient: AxiosInstance

    constructor(config: ApiClientConfig = {}) {
        const { baseURL = '/api/v1', interceptors, ...axiosConfig } = config

        this.apiClient = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            ...axiosConfig,
        })

        this.setupInterceptors(interceptors)
    }

    private setupInterceptors(interceptors?: Types.InterceptorConfig) {
        // 请求拦截器
        const requestOnFulfilled = interceptors?.request?.onFulfilled || ((config) => config)
        const requestOnRejected = interceptors?.request?.onRejected || ((error) => Promise.reject(error))
        this.apiClient.interceptors.request.use(requestOnFulfilled, requestOnRejected)

        // 响应拦截器
        const responseOnFulfilled = interceptors?.response?.onFulfilled || ((response) => response.data)
        const responseOnRejected =
            interceptors?.response?.onRejected ||
            ((error) => {
                const apiError: Types.ApiError = {
                    message: error.message,
                    status: error.response?.status,
                    code: error.code,
                }
                return Promise.reject(apiError)
            })
        this.apiClient.interceptors.response.use(responseOnFulfilled, responseOnRejected)
    }

    // 动态设置拦截器的方法
    setRequestInterceptor(interceptor: Types.RequestInterceptor) {
        this.apiClient.interceptors.request.use(
            interceptor.onFulfilled || ((config) => config),
            interceptor.onRejected || ((error) => Promise.reject(error)),
        )
    }

    setResponseInterceptor(interceptor: Types.ResponseInterceptor) {
        this.apiClient.interceptors.response.use(
            interceptor.onFulfilled || ((response) => response),
            interceptor.onRejected || ((error) => Promise.reject(error)),
        )
    }

    // 清除所有拦截器
    clearInterceptors() {
        this.apiClient.interceptors.request.clear()
        this.apiClient.interceptors.response.clear()
        // 重新设置默认拦截器
        this.setupInterceptors()
    }

    // 认证 相关接口
    /**
     * 用户登录
     * 用户登录接口，验证用户名和密码
     */
    login = async (data: Types.LoginRequest, config?: AxiosRequestConfig): Promise<any> => {
        return this.apiClient.post('/login', data, config)
    }

    // 菜单 相关接口
    /**
     * 获取菜单列表
     * 获取系统菜单列表，用于构建导航菜单
     */
    getMenu = async (config?: AxiosRequestConfig): Promise<any> => {
        return this.apiClient.get('/getMenu', config)
    }

    // 表格 相关接口
    /**
     * 获取表格数据
     * 分页获取表格数据，支持筛选条件
     */
    getTableData = async (data: Types.TableQueryParams, config?: AxiosRequestConfig): Promise<any> => {
        return this.apiClient.post('/getTableData', data, config)
    }
}

// 默认导出实例
export const apiClient = new ApiClient()

export default apiClient
