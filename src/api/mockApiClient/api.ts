// 自动生成的 API 客户端文件
// 请勿手动修改此文件

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import * as Types from './types'

export interface ApiClientConfig extends AxiosRequestConfig {
    baseURL?: string
    interceptors?: Types.InterceptorConfig
}

export class ApiClient {
    private mockApiClient: AxiosInstance

    constructor(config: ApiClientConfig = {}) {
        const { baseURL = '/api/v1', interceptors, ...axiosConfig } = config

        this.mockApiClient = axios.create({
            baseURL,
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' },
            ...axiosConfig,
        })

        this.setupInterceptors(interceptors)
    }

    private setupInterceptors(interceptors?: Types.InterceptorConfig) {
        const reqFulfilled = interceptors?.request?.onFulfilled || ((config: any) => config)
        const reqRejected = interceptors?.request?.onRejected || ((error: any) => Promise.reject(error))
        this.mockApiClient.interceptors.request.use(reqFulfilled, reqRejected)

        const resFulfilled = interceptors?.response?.onFulfilled || ((response: any) => response.data)
        const resRejected =
            interceptors?.response?.onRejected ||
            ((error: any) => {
                const apiError: Types.ApiError = {
                    message: error.message,
                    status: error.response?.status,
                    code: error.code,
                }
                return Promise.reject(apiError)
            })
        this.mockApiClient.interceptors.response.use(resFulfilled, resRejected)
    }

    setRequestInterceptor(interceptor: Types.RequestInterceptor) {
        this.mockApiClient.interceptors.request.use(
            interceptor.onFulfilled || ((config: any) => config),
            interceptor.onRejected || ((error: any) => Promise.reject(error)),
        )
    }

    setResponseInterceptor(interceptor: Types.ResponseInterceptor) {
        this.mockApiClient.interceptors.response.use(
            interceptor.onFulfilled || ((response: any) => response),
            interceptor.onRejected || ((error: any) => Promise.reject(error)),
        )
    }

    clearInterceptors() {
        this.mockApiClient.interceptors.request.clear()
        this.mockApiClient.interceptors.response.clear()
        this.setupInterceptors()
    }

    // ── 认证 ──
    /**
     * 用户登录
     * 用户登录接口，验证用户名和密码
     * @route POST /login
     */
    login = async (data: Types.LoginRequest, config?: AxiosRequestConfig): Promise<Types.LoginApiResponse> => {
        return this.mockApiClient.post('/login', data, config)
    }

    // ── 菜单 ──
    /**
     * 获取菜单列表
     * 获取系统菜单列表，用于构建导航菜单
     * @route GET /getMenu
     */
    getMenu = async (config?: AxiosRequestConfig): Promise<Types.MenuApiResponse> => {
        return this.mockApiClient.get('/getMenu', config)
    }

    // ── 表格 ──
    /**
     * 获取表格数据
     * 分页获取表格数据，支持筛选条件
     * @route POST /getTableData
     */
    getTableData = async (
        data: Types.TableQueryParams,
        config?: AxiosRequestConfig,
    ): Promise<Types.TableDataApiResponse> => {
        return this.mockApiClient.post('/getTableData', data, config)
    }
}

export const apiClient = new ApiClient()

export default apiClient
