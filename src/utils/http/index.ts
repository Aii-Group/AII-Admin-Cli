import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import i18n from '@/utils/i18n'
import { ResultEnum } from '@/enums'
import { DownloadTypes } from '@/enums'
import { ApiClient as MockApiClient } from '@/api/mockApiClient'
import NProgress from '@/utils/nprogress'
import { isMicroAppEnv } from '@/utils/micro'
import { useLanguageStore, useUserStore } from '@/stores/system'

import { downloadFile } from './helper/downloadHelper'
import { checkStatus } from './helper/checkStatusHelper'

// 创建通用的拦截器配置
const createInterceptors = () => ({
    request: {
        onFulfilled: (config: AxiosRequestConfig) => {
            NProgress.start()
            const userInfo = useUserStore.getState().userInfo
            const language = useLanguageStore.getState().language
            const token: string = userInfo?.token ?? ''
            config.headers!['Authorization'] = `Bearer ${token}`
            config.headers!['Accept-Language'] = language || i18n.language
            return config
        },
        onRejected: (error: any) => {
            NProgress.done()
            window.$message.error(error.msg || error.message)
            return Promise.reject(error)
        },
    },
    response: {
        onFulfilled: async (response: AxiosResponse) => {
            NProgress.done()
            const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
            if (contentType) {
                if (DownloadTypes.some((type) => contentType?.includes(type))) {
                    await downloadFile(response)
                    return
                }
            }
            if (response.data.code === ResultEnum.SUCCESS) {
                return response.data
            } else {
                window.$message.error(response.data.msg || response.data.message)
                return Promise.reject(response)
            }
        },
        onRejected: (error: any) => {
            NProgress.done()
            checkStatus(error.response?.status)
            return Promise.reject(error)
        },
    },
})

// 创建 mock 服务实例
export const mockApiClient = new MockApiClient({
    baseURL: '/api/v1',
    timeout: 10000,
    withCredentials: !isMicroAppEnv,
    interceptors: createInterceptors(),
})
