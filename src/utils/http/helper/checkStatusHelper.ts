import i18n from '@/utils/i18n'
import router from '@/utils/router'
import { resetLogout } from '@/utils/system'
import { isMicroAppEnv } from '@/utils/micro'

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
    switch (status) {
        case 400:
            window.$message.error(i18n.t('Error_Status.400'))
            break
        case 401:
            if (!isMicroAppEnv) {
                window.$message.error(i18n.t('Error_Status.401'))
                setTimeout(() => {
                    resetLogout()
                    router.navigate({
                        to: '/login',
                    })
                }, 3000)
            } else {
                window.microApp.forceSetGlobalData({
                    errorCode: 401,
                })
            }
            break
        case 403:
            window.$message.error(i18n.t('Error_Status.403'))
            break
        case 404:
            window.$message.error(i18n.t('Error_Status.404'))
            break
        case 405:
            window.$message.error(i18n.t('Error_Status.405'))
            break
        case 408:
            window.$message.error(i18n.t('Error_Status.408'))
            break
        case 500:
            window.$message.error(i18n.t('Error_Status.500'))
            break
        case 502:
            window.$message.error(i18n.t('Error_Status.502'))
            break
        case 503:
            window.$message.error(i18n.t('Error_Status.503'))
            break
        case 504:
            window.$message.error(i18n.t('Error_Status.504'))
            break
        default:
            window.$message.error(i18n.t('Error_Status.400'))
            break
    }
}
