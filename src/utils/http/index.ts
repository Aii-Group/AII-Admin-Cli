import { ApiClient } from '@/mockClient'
import NProgress from '@/utils/nprogress'
import { ResultEnum } from '@/enums/httpEnum'
import { isMicroAppEnv } from '@/utils/micro'
import { useUserStore } from '@/stores/system'

import { checkStatus } from './helper/checkStatusHelper'
import { downloadFile, downloadTypes } from './helper/downloadHelper'

const apiClient = new ApiClient({
    baseURL: '/api/v1',
    timeout: 10000,
    withCredentials: !isMicroAppEnv,
    interceptors: {
        request: {
            onFulfilled: (config) => {
                NProgress.start()
                const userInfo = useUserStore.getState().userInfo
                const token: string = userInfo?.token ?? ''
                config.headers['token'] = token
                return config
            },
            onRejected: (error) => {
                NProgress.done()
                window.$message.error(error.message)
                return Promise.reject(error)
            },
        },
        response: {
            onFulfilled: async (response) => {
                NProgress.done()
                const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
                if (contentType) {
                    if (downloadTypes.some((type) => contentType?.includes(type))) {
                        await downloadFile(response)
                        return
                    }
                }
                if (response.data.code === ResultEnum.SUCCESS) {
                    return response.data
                } else {
                    window.$message.error(response.data.message)
                    return Promise.reject(response)
                }
            },
            onRejected: (error) => {
                NProgress.done()
                checkStatus(error.response?.status)
                return Promise.reject(error)
            },
        },
    },
})

export default apiClient
