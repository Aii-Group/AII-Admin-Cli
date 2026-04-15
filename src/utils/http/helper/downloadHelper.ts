import { AxiosResponse } from 'axios'
import { TypeToExtEnum } from '@/enums'

export const downloadFile = async (response: AxiosResponse) => {
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
    const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'] || ''
    let ext = 'bin'

    // 根据content-type确定文件扩展名
    if (contentType) {
        for (const [type, e] of Object.entries(TypeToExtEnum)) {
            if (contentType.includes(type)) {
                ext = e
                break
            }
        }
    }

    let fileName = `download.${ext}`

    // 从content-disposition头中提取文件名
    if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
        if (match) {
            fileName = decodeURIComponent(match[1] || match[2])
        }
    }

    try {
        let blob: Blob

        // 确保正确处理blob数据
        if (response.data instanceof Blob) {
            blob = response.data
        } else if (response.data instanceof ArrayBuffer) {
            blob = new Blob([response.data], { type: contentType || 'application/octet-stream' })
        } else if (typeof response.data === 'string') {
            // 对于文本类型文件
            blob = new Blob([response.data], { type: contentType || 'text/plain' })
        } else {
            // 其他情况，尝试转换为JSON字符串
            const dataStr = typeof response.data === 'object' ? JSON.stringify(response.data) : String(response.data)
            blob = new Blob([dataStr], { type: contentType || 'application/octet-stream' })
        }

        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Download file error:', error)
        window.$message.error('Download file failed')
    }
}
